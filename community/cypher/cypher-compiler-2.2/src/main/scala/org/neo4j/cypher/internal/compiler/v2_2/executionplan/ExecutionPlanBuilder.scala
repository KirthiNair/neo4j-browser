/**
 * Copyright (c) 2002-2014 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package org.neo4j.cypher.internal.compiler.v2_2.executionplan

import java.util.Date

import org.neo4j.cypher.internal.Profiled
import org.neo4j.cypher.internal.compiler.v2_2._
import org.neo4j.cypher.internal.compiler.v2_2.ast.Statement
import org.neo4j.cypher.internal.compiler.v2_2.commands._
import org.neo4j.cypher.internal.compiler.v2_2.executionplan.builders._
import org.neo4j.cypher.internal.compiler.v2_2.pipes._
import org.neo4j.cypher.internal.compiler.v2_2.planner.CantHandleQueryException
import org.neo4j.cypher.internal.compiler.v2_2.profiler.Profiler
import org.neo4j.cypher.internal.compiler.v2_2.spi._
import org.neo4j.cypher.internal.compiler.v2_2.symbols.SymbolTable
import org.neo4j.graphdb.GraphDatabaseService
import org.neo4j.graphdb.factory.GraphDatabaseSettings
import org.neo4j.kernel.InternalAbstractGraphDatabase

case class PlanFingerprint(creationDate: Date, txId: Long, snapshot: GraphStatisticsSnapshot)

case class PipeInfo(pipe: Pipe,
                    updating: Boolean,
                    periodicCommit: Option[PeriodicCommitInfo] = None,
                    fingerprint: Option[PlanFingerprint] = None,
                    plannerUsed: PlannerName)

case class PeriodicCommitInfo(size: Option[Long]) {
  def batchRowCount = size.getOrElse(/* defaultSize */ 1000L)
}

trait NewLogicalPlanSuccessRateMonitor {
  def newQuerySeen(queryText: String, ast:Statement)
  def unableToHandleQuery(queryText: String, ast:Statement, origin: CantHandleQueryException)
}

trait PipeBuilder {
  def producePlan(inputQuery: PreparedQuery, planContext: PlanContext): PipeInfo
}

class ExecutionPlanBuilder(graph: GraphDatabaseService,
                           pipeBuilder: PipeBuilder) extends PatternGraphBuilder {
  val MIN_DIVERGENCE = 0.5

  def build(planContext: PlanContext, inputQuery: PreparedQuery): ExecutionPlan = {
    val abstractQuery = inputQuery.abstractQuery

    val pipeInfo = pipeBuilder.producePlan(inputQuery, planContext)
    val PipeInfo(pipe, updating, periodicCommitInfo, fp, planner) = pipeInfo

    val columns = getQueryResultColumns(abstractQuery, pipe.symbols)
    val resultBuilderFactory = new DefaultExecutionResultBuilderFactory(pipeInfo, columns, inputQuery.planType)
    val func = getExecutionPlanFunction(periodicCommitInfo, abstractQuery.getQueryText, updating, resultBuilderFactory)

    val TTL = getQueryPlanTTL
    val profileMarker = inputQuery.planType == Profiled
    new ExecutionPlan {
      val fingerprint: Option[PlanFingerprint] = fp
      def execute(queryContext: QueryContext, params: Map[String, Any]) = func(queryContext, params, profileMarker)
      def profile(queryContext: QueryContext, params: Map[String, Any]) = func(new UpdateCountingQueryContext(queryContext), params, true)
      def isPeriodicCommit = periodicCommitInfo.isDefined
      def plannerUsed = planner
      def isStale(lastTxId: Long, statistics: GraphStatistics): Boolean = {
        val date = new Date()
        fingerprint.fold(false) { fingerprint =>
          lastTxId != fingerprint.txId &&
            fingerprint.creationDate.getTime + TTL <= date.getTime &&
            fingerprint.snapshot.diverges(fingerprint.snapshot.recompute(statistics), MIN_DIVERGENCE)
        }
      }
    }
  }

  private def getQueryPlanTTL: Integer = {
    graph match {
      case iagdb: InternalAbstractGraphDatabase =>
        iagdb.getConfig.get(GraphDatabaseSettings.query_plan_ttl)
      case _ =>
        GraphDatabaseSettings.query_plan_ttl.getDefaultValue.toInt
    }
  }

  private def getQueryResultColumns(q: AbstractQuery, currentSymbols: SymbolTable): List[String] = q match {
    case in: PeriodicCommitQuery =>
      getQueryResultColumns(in.query, currentSymbols)

    case in: Query =>
      // Find the last query part
      var query = in
      while (query.tail.isDefined) {
        query = query.tail.get
      }

      query.returns.columns.flatMap {
        case "*" => currentSymbols.identifiers.keys
        case x => Seq(x)
      }

    case union: Union =>
      getQueryResultColumns(union.queries.head, currentSymbols)

    case _ =>
      List.empty
  }

  private def getExecutionPlanFunction(periodicCommit: Option[PeriodicCommitInfo],
                                       queryId: AnyRef,
                                       updating: Boolean,
                                       resultBuilderFactory: ExecutionResultBuilderFactory):
  (QueryContext, Map[String, Any], Boolean) => InternalExecutionResult =
    (queryContext: QueryContext, params: Map[String, Any], profile: Boolean) => {
      val builder = resultBuilderFactory.create()

      val builderContext = if (updating) new UpdateCountingQueryContext(queryContext) else queryContext
      builder.setQueryContext(builderContext)

      if (periodicCommit.isDefined) {
        if (!builderContext.isTopLevelTx)
          throw new PeriodicCommitInOpenTransactionException()
        builder.setLoadCsvPeriodicCommitObserver(periodicCommit.get.batchRowCount)
      }

      if (profile)
        builder.setPipeDecorator(new Profiler())

      builder.build(graph, queryId, params)
    }
}
/**
 * This module depicts the behaviour of the edit drawer that displays
 * the all drawerSections of edit drawer
 */

import React, { Component } from 'react'
import { Drawer, DrawerBody, DrawerHeader } from 'browser-components/drawer'
import { ViewProperties } from './ViewProperties'
import * as _ from 'lodash'
import { EntityType } from './EntityType'
import { RelationshipType } from './RelationshipType'

export class EditRelationship extends Component {
  render () {
    return (
      <Drawer id='db-drawer'>
        <DrawerHeader>Editor</DrawerHeader>
        <DrawerBody>
          <EntityType itemType={this.props.entityType} />
          <RelationshipType relationshipType={this.props.relationshipType} />
          <ViewProperties ShowProperties={this.props.nodeProperties} />
        </DrawerBody>
      </Drawer>
    )
  }
}

/*
 * This module depicts the behaviour of the edit drawer that displays the node relationship
 * properties
 */

import React, { Component } from 'react'
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerSection,
  DrawerSectionBody,
  DrawerSubHeader
} from 'browser-components/drawer'

import * as _ from 'lodash'
import { getStringValue } from './utils'
import { EntityType } from './EntityType'
import { NodeLabel } from './NodeLabel'
import { RelationshipType } from './RelationshipType'

export class EditNodes extends Component {
  render () {
    let content = null
    content = _.map(this.props.nodeProperties, (value, key) => {
      return (
        <div key={key}>
          {key}:{getStringValue(value)}
        </div>
      )
    })

    return (
      <Drawer id='db-drawer'>
        <DrawerHeader>Editor</DrawerHeader>
        <DrawerBody>
          <DrawerSection>
            <EntityType itemType={this.props.entityType} />
            <DrawerSubHeader> Properties</DrawerSubHeader>
            <DrawerSectionBody>{content}</DrawerSectionBody>
            <NodeLabel nodeLabel={this.props.nodeLabel} />
            <RelationshipType relationshipType={this.props.relationshipType} />
          </DrawerSection>
        </DrawerBody>
      </Drawer>
    )
  }
}

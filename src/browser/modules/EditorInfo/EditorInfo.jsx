/*
 * This module depicts the behaviour of the edit drawer.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withBus } from 'react-suber'
import { EditNodes } from './EditNodes'
import {
  Drawer,
  DrawerHeader,
  DrawerBody,
  DrawerSection
} from 'browser-components/drawer/index'
import { EntityType } from './EntityType'

export class EditorInfo extends Component {
  render () {
    return this.props.selectedItem ? (
      <div>
        <EditNodes
          nodeProperties={this.props.selectedItem._fields[0].properties}
          entityType={this.props.entityType}
          nodeLabel={
            this.props.selectedItem._fields[0].labels
              ? this.props.selectedItem._fields[0].labels[0]
              : ''
          }
          relationshipType={
            this.props.selectedItem._fields[0].type
              ? this.props.selectedItem._fields[0].type
              : ''
          }
        />
      </div>
    ) : (
      <Drawer id='db-drawer'>
        <DrawerHeader>Editor</DrawerHeader>
        <DrawerBody>
          <DrawerSection>
            <EntityType itemType='Canvas' />
          </DrawerSection>
        </DrawerBody>
      </Drawer>
    )
  }
}
const mapStateToProps = state => {
  return {
    selectedItem: state.itemEditor.selectedItem,
    entityType: state.itemEditor.entityType
  }
}

export default withBus(connect(mapStateToProps)(EditorInfo))

/**
 * This component is used to display the node label on editor drawer
 */
import React from 'react'
import {
  DrawerSubHeader,
  DrawerSection,
  DrawerSectionBody
} from 'browser-components/drawer'
import * as _ from 'lodash'

export const NodeLabel = props => {
  let labels = _.map(props.nodeLabel, label => {
    return label || null
  })
  return labels.length > 0 ? (
    <DrawerSection>
      <DrawerSubHeader>Node Label</DrawerSubHeader>
      {_.map(labels, value => {
        return <DrawerSectionBody>{value}</DrawerSectionBody>
      })}
    </DrawerSection>
  ) : null
}

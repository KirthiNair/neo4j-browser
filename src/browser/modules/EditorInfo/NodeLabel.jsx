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

export const NodeLabel = ({ nodeLabel = [] }) => {
  const noLabels = nodeLabel.length > 0 ? null : 'Selected node has no labels.'

  return (
    <DrawerSection>
      <DrawerSubHeader>Node Labels</DrawerSubHeader>
      {noLabels}
      {_.map(nodeLabel, value => {
        return <DrawerSectionBody key={value}>{value}</DrawerSectionBody>
      })}
    </DrawerSection>
  )
}

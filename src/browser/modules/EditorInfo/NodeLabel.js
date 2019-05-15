/**
 * This component is used to display the node label on editor drawer
 */
import React from 'react'
import {
  DrawerSubHeader,
  DrawerSection,
  DrawerSectionBody
} from 'browser-components/drawer'

export const NodeLabel = ({ nodeLabel = '' }) => {
  return nodeLabel ? (
    <DrawerSection>
      <DrawerSubHeader>Node Label</DrawerSubHeader>
      <DrawerSectionBody>{nodeLabel}</DrawerSectionBody>
    </DrawerSection>
  ) : (
    ''
  )
}

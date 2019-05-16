import React from 'react'
import {
  DrawerSubHeader,
  DrawerSection,
  DrawerSectionBody
} from 'browser-components/drawer'

/**
 * This functional component is used to display the type of entity on selection.
 */

export const EntityType = ({ itemType = '' }) => {
  return (
    <DrawerSection>
      <DrawerSubHeader>Entity Type</DrawerSubHeader>
      <DrawerSectionBody>{itemType}</DrawerSectionBody>
    </DrawerSection>
  )
}

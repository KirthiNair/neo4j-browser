import React from 'react'
import {
  DrawerSubHeader,
  DrawerSection,
  DrawerSectionBody
} from 'browser-components/drawer'

export const RelationshipType = ({ relationshipType = '' }) => {
  return relationshipType ? (
    <DrawerSection>
      <DrawerSubHeader>Relationship Type</DrawerSubHeader>
      <DrawerSectionBody>{relationshipType}</DrawerSectionBody>
    </DrawerSection>
  ) : (
    ''
  )
}

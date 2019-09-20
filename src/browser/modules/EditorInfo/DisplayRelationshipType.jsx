import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import PartialConfirmationButtons from 'browser-components/buttons/PartialConfirmationButtons'
import CreatableSelect from 'react-select/creatable'
import { colourStyles } from './CreateRelationship'

/**
 * Component to display the relationship type
 * @param {*} props
 */

function DisplayRelationshipType (props) {
  useEffect(() => {
    props.fetchSelectOptions('relationship', 'relationshipType')
    setButtonVisibility(false)
    if (
      props.selectedNodeId ===
      props.value.segments[0].relationship.start.toInt()
    ) {
      setSelectedNode('start')
    } else {
      setSelectedNode('end')
    }
  }, [])
  const [selectedType, setSelectedType] = useState(props.relationshipType)
  const [showButtons, setButtonVisibility] = useState(false)
  const [selectedNode, setSelectedNode] = useState(null)

  const onConfirmed = () => {
    if (selectedType) {
      props.editEntityAction(
        {
          id: props.relationshipId,
          value: selectedType.value,
          selectedNode: selectedNode
        },
        'update',
        'relationshipType'
      )
      setButtonVisibility(false)
    }
  }

  const onCanceled = () => {
    setButtonVisibility(false)
  }

  return (
    <div
      style={{ marginLeft: 8, marginRight: 8, marginBottom: 16, width: '100%' }}
    >
      <CreatableSelect
        isClearable
        placeholder='Type'
        styles={colourStyles}
        defaultValue={{ label: selectedType, value: selectedType }}
        onChange={selectedType => {
          if (selectedType && selectedType.value !== props.relationshipType) {
            setSelectedType(selectedType)
            setButtonVisibility(true)
          } else {
            setButtonVisibility(false)
          }
        }}
        options={props.relationshipTypeList}
      />
      {showButtons ? (
        <PartialConfirmationButtons
          onConfirmed={onConfirmed}
          onCanceled={onCanceled}
        />
      ) : null}
    </div>
  )
}

DisplayRelationshipType.propTypes = {
  relationshipType: PropTypes.string
}

export default DisplayRelationshipType

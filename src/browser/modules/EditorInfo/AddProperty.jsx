import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { StyledTable, StyledValue, StyledKey } from '../DatabaseInfo/styled'
import {
  PlusIcon,
  TickMarkIcon,
  CancelIcon
} from 'browser-components/icons/Icons'
import {
  DrawerSection,
  DrawerSectionBody
} from 'browser-components/drawer/index'
import { TextInput } from 'browser-components/Form'
import styled from 'styled-components'
import { getStringValue } from './utils'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import PartialConfirmationButtons from 'browser-components/buttons/PartialConfirmationButtons'

const IconButton = styled.button`
  margin-left: 4px;
  border: 0;
  background: transparent;
  &:focus {
    outline: none;
  }
`

function AddProperty (props) {
  const [textField, handleToggle] = useState(false)

  const initialState = {
    newProperties: {}
  }
  const [myState, updatePropertiesState] = useState(initialState)

  const handleChange = (key1, value) => {
    let newState = _.cloneDeep(myState)
    updatePropertiesState({
      ...newState,
      newProperties: {
        ...newState.newProperties,
        [key1]: getStringValue(value)
      }
    })
  }
  function DropDownContents (props) {
    return (
      <FormControl
        style={{
          marginTop: 16,
          marginBottom: 16,
          minWidth: 120
        }}
        variant='outlined'
      >
        <Select
          name='datatype'
          style={{
            background: '#fff',
            fontSize: '14px',
            textAlign: '-webkit-center',
            height: '34px',
            color: '#555',
            borderTop: '1px solid #ccc',
            borderRadius: '4px'
          }}
          value={myState.newProperties.datatype}
          onChange={e => {
            props.handleChange(e.target.name, e.target.value)
          }}
        >
          <MenuItem value='string'>String</MenuItem>
        </Select>
      </FormControl>
    )
  }

  return (
    <React.Fragment>
      <IconButton onClick={() => handleToggle(!textField)}>
        <PlusIcon />
        AddProperty
      </IconButton>
      {textField ? (
        <DrawerSection>
          <DrawerSectionBody>
            <StyledTable>
              <tr>
                <StyledKey>key:</StyledKey>
                <StyledValue>
                  <TextInput
                    id='key'
                    onChange={e => {
                      handleChange(e.target.id, e.target.value)
                    }}
                    style={{ width: '120px' }}
                  />
                </StyledValue>
              </tr>
              <tr>
                <StyledKey> Data Type:</StyledKey>
                <StyledValue>
                  <DropDownContents handleChange={handleChange} />
                </StyledValue>
              </tr>
              <StyledKey>Value :</StyledKey>
              <StyledValue>
                <TextInput
                  id='propValue'
                  onChange={e => {
                    handleChange(e.target.id, e.target.value)
                  }}
                  style={{ width: '120px' }}
                />
              </StyledValue>
              <PartialConfirmationButtons
                cancelIcon={
                  <IconButton onClick={() => handleToggle(textField)}>
                    <CancelIcon />
                  </IconButton>
                }
                onCanceled={() => {
                  handleToggle(false)
                }}
                confirmIcon={<TickMarkIcon />}
                onConfirmed={() => {
                  handleToggle(!textField)
                  props.editEntityAction(
                    {
                      id: props.id,
                      key: myState.newProperties.key,
                      value: myState.newProperties.propValue
                    },
                    'create',
                    'nodeProperty'
                  )
                }}
              />
            </StyledTable>
          </DrawerSectionBody>
        </DrawerSection>
      ) : null}
    </React.Fragment>
  )
}

AddProperty.propTypes = {
  editEntityAction: PropTypes.func
}

export default AddProperty

import React from 'react'
import styled from 'styled-components'
import { AppController } from '../logic/app-controller'

const StyledDiv = styled.div`
  grid-row-start: 1;
  grid-row-end: 1;
  grid-column-start: 1;
  grid-column-end: 1;
  border: 1px solid silver;
  border-radius: 0.2em;
  padding: 0.1em;
`
const StyledImage = styled.img`
  max-width: 100%;
  object-fit: contain;
`

export function BirdDetails() {
  const selectedRow = AppController.instance.useSelectedRow()

  if (selectedRow == null) {
    return <StyledDiv>Details will show once row is selected</StyledDiv>
  }

  return (
    <StyledDiv>
      <StyledImage src={selectedRow.previewUrl} />
    </StyledDiv>
  )
}

import React from 'react'
import styled from 'styled-components'
import { AppController } from '../logic/app-controller'

const StyledTextArea = styled.textarea`
  @import url('https://fonts.googleapis.com/css?family=Space+Mono&display=swap');
  font-family: 'Space Mono', monospace;
  font-size: 0.8em;
  grid-row-start: 1;
  grid-row-end: 1;
  grid-column-start: 2;
  grid-column-end: 2;
`

const StyledButton = styled.button`
  cursor: pointer;
  text-align: center;
  grid-row-start: 1;
  grid-row-end: 1;
  grid-column-start: 3;
  grid-column-end: 3;
`

export function QueryInput() {
  const query = AppController.instance.useQuery()
  const handleChange = (event: { target: { value: string } }) =>
    (AppController.instance.query = event.target.value)
  return <StyledTextArea defaultValue={query} onChange={handleChange} />
}

export function QueryExecute() {
  const handleClick = () => AppController.instance.runQuery()
  return <StyledButton onClick={handleClick}>Run</StyledButton>
}

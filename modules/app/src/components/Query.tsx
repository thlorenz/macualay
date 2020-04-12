import React, { useState } from 'react'
import styled from 'styled-components'
import { AppController } from '../logic/app-controller'

const StyledTextArea = styled.textarea`
  @import url('https://fonts.googleapis.com/css?family=Space+Mono&display=swap');
  font-family: 'Space Mono', monospace;
  font-size: 0.8em;
  width: 80vw;
  height: 5em;
  display: inline-block;
`

const StyledDiv = styled.div`
  background: antiquewhite;
  border: solid 1px silver;
  border-radius: 3px;
  display: inline-block;
  width: 95vw;
`

const StyledButton = styled.button`
  cursor: pointer;
  display: inline-block;
  text-align: center;
`

export function Query() {
  const [query, setQuery] = useState('Enter query here')
  const handleChange = (event: { target: { value: string } }) => setQuery(event.target.value)
  const handleClick = () => AppController.instance.runQuery(query)
  return (
    <StyledDiv>
      <StyledTextArea
        defaultValue={query}
        onChange={handleChange}
      />
      <StyledButton onClick={handleClick}>Run</StyledButton>
    </StyledDiv>
  )
}

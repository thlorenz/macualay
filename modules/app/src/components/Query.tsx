import React from 'react'
import Select, { ActionMeta, ValueType } from 'react-select'
import styled from 'styled-components'
import { AppController } from '../logic/app-controller'
import { Query } from '../queries/queries'

const StyledTextArea = styled.textarea`
  @import url('https://fonts.googleapis.com/css?family=Source+Code+Pro:500&display=swap');
  padding: 0.4em 0.9em;
  font-family: 'Source Code Pro', monospace;
  font-size: 1em;
  grid-row-start: 1;
  grid-row-end: 1;
  grid-column-start: 2;
  grid-column-end: 2;
`

const StyledMenu = styled.div`
  grid-row-start: 1;
  grid-row-end: 1;
  grid-column-start: 3;
  grid-column-end: 3;
`
const StyledButton = styled.button`
  cursor: pointer;
  text-align: center;
  width: 100%;
  height: 4em;
  margin-bottom: 0.3em;
`

export function QueryInput() {
  const query = AppController.instance.useQuery()
  const handleChange = (event: { target: { value: string } }) =>
    AppController.instance.editedQuery(event.target.value)
  return <StyledTextArea value={query.value} onChange={handleChange} />
}

export function QueryMenu() {
  const queries = AppController.instance.useQueries()
  const query = AppController.instance.useQuery()

  const onrunQuery = () => AppController.instance.runQuery()
  const onquerySelected = (query: ValueType<Query>, _: ActionMeta) =>
    AppController.instance.selectedQuery(query as Query)
  return (
    <StyledMenu>
      <StyledButton onClick={onrunQuery}>Run</StyledButton>
      <Select value={query} options={queries} onChange={onquerySelected} />
    </StyledMenu>
  )
}

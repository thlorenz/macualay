import React, { useEffect } from 'react'
import { QueryInput, QueryExecute } from './Query'
import { Table } from './Table'
import styled from 'styled-components'
import { BirdDetails } from './BirdDetails'

const Container = styled.div`
  display: flex;
  justify-content: center;
`
const Grid = styled.div`
  display: grid;
  grid-template-rows: 200px auto;
  grid-template-columns: 300px auto 50px;
  width: 90vw;
`

export function App() {
  useEffect(() => {})
  return (
    <Container>
      <Grid>
        <BirdDetails />
        <QueryInput />
        <QueryExecute />
        <Table />
      </Grid>
    </Container>
  )
}

import React, { useEffect } from 'react'
import { QueryInput, QueryMenu } from './Query'
import { Table } from './Table'
import styled from 'styled-components'
import { BirdDetails } from './BirdDetails'

const Container = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
  width: 100vw;
`
const Grid = styled.div`
  display: grid;
  grid-template-rows: 200px auto;
  grid-template-columns: 300px auto 150px;
  width: 90vw;
`

export function App() {
  useEffect(() => {})
  return (
    <Container>
      <Grid>
        <BirdDetails />
        <QueryInput />
        <QueryMenu />
        <Table />
      </Grid>
    </Container>
  )
}

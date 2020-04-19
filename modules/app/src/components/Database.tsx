import React from 'react'
import Select, { ActionMeta, ValueType } from 'react-select'
import styled from 'styled-components'
import { AppController } from '../logic/app-controller'
import { Database } from '../databases/databases'
import { createDatabase } from '../logic/save-dialog'
import { StyledHeader } from './styles'

const StyledMenu = styled.div`
  grid-row-start: 1;
  grid-row-end: 1;
  grid-column-start: 4;
  grid-column-end: 4;
`
const StyledButton = styled.button`
  cursor: pointer;
  text-align: center;
  width: 100%;
  height: 4em;
  margin-bottom: 0.3em;
`
export function DatabaseMenu() {
  const databases: readonly Database[] = AppController.instance.useDatabases()
  const syncingDatabase: Database = AppController.instance.useSyncingDatabase()

  const onsyncingDatabaseSelected = (
    database: ValueType<Database>,
    _: ActionMeta
  ) => AppController.instance.selectedDatabase(database as Database)

  const oncreateDB = async () => {
    try {
      const dbFile = await createDatabase()
      AppController.instance.createdDatabase(dbFile)
    } catch (err) {
      console.error(err)
    }
  }

  const onaddSelectedRows = () => AppController.instance.addSelectedRows()
  console.log({ databases, syncingDatabase })

  return (
    <StyledMenu>
      <StyledHeader>Database</StyledHeader>
      <StyledButton onClick={oncreateDB}>Create</StyledButton>
      <StyledButton onClick={onaddSelectedRows}>Add Selected</StyledButton>
      <Select
        value={syncingDatabase}
        options={databases}
        onChange={onsyncingDatabaseSelected}
      />
    </StyledMenu>
  )
}

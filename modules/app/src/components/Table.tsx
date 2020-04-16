import React, { useMemo } from 'react'
import { AppController } from '../logic/app-controller'
import { BirdDataRow } from '@modules/core'
import DataTable, { IDataTableColumn } from 'react-data-table-component'

function columnsFromData(data: BirdDataRow[]): IDataTableColumn<BirdDataRow>[] {
  if (data.length === 0) return []
  const row = data[0]
  const cols = Object.keys(row).map((x) => ({
    name: x,
    selector: x,
    sortable: true,
  }))
  return cols
}

export function Table() {
  const data: BirdDataRow[] = AppController.instance.useQueryResult()
  const columns = useMemo(() => columnsFromData(data), [data])
  function handleRowClicked(row: BirdDataRow) {
    AppController.instance.selectedRow = row
  }

  return (
    <DataTable
      title="Query Result"
      data={data.map((x) => ({ ...x, id: x.assetId }))}
      columns={columns}
      onRowClicked={handleRowClicked}
      highlightOnHover
      pointerOnHover
      selectableRows
      dense
      style={{
        gridRowStart: 2,
        gridRowEnd: 2,
        gridColumnStart: 1,
        gridColumnEnd: 4,
        overflow: 'scroll',
      }}
    />
  )
}

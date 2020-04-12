import React from 'react'
import { AppController } from '../logic/app-controller'
import { BirdDataRow } from '@modules/core'

function columnsFromData(data: BirdDataRow[]) {
  if (data.length === 0) return []
  const row = data[0]
  const cols: string[] = Object.keys(row)
  return cols
}

function renderRow(row: BirdDataRow) {
  const cells = Object.values(row).map(x => <td>{x}</td>)
  return (
    <tr>
      {cells}
    </tr>
  )
}

export function Table() {
  const data: BirdDataRow[] = AppController.instance.useQueryResult()
  const columns: string[] = columnsFromData(data)
  return (
    <table>
      <thead>
      {columns.map(col => <th>{col}</th>)}
      </thead>
      <tbody>
      {data.map(renderRow)}
      </tbody>
    </table>
  )
}

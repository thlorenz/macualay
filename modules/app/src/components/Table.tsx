import { BirdDataRow } from '@modules/core'
import React, { useMemo } from 'react'
import DataTable, {
  IDataTableColumn,
  IDataTableProps,
} from 'react-data-table-component'
import { AppController } from '../logic/app-controller'

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

const syncedMark = '\u2713'
const syncedColumn = {
  name: 'Added',
  selector: 'Synced',
  sortable: true,
  style: { color: 'green', fontSize: '1.5em' },
  center: true,
  maxWidth: '0.01em',
}

export function Table() {
  const data: BirdDataRow[] = AppController.instance.useQueryResult()
  const syncedAssetIDs = AppController.instance.useSyncedAssetIDs()
  const clearCheckedRows = AppController.instance.useClearCheckedRows()

  const columns = useMemo(() => columnsFromData(data), [data])
  function handleRowClicked(row: BirdDataRow) {
    AppController.instance.selectedRow = row
  }
  const onSelectedRowsChange: IDataTableProps<
    BirdDataRow
  >['onSelectedRowsChange'] = ({ selectedRows }) => {
    AppController.instance.updateCheckedAssetIDs(
      selectedRows.map((x) => x.assetId)
    )
  }

  function toColumns(x: BirdDataRow) {
    const synced = syncedAssetIDs.has(x.assetId)
    const syncLabel = synced ? syncedMark : ''
    return {
      Synced: syncLabel,
      ...x,
      id: x.assetId,
    }
  }

  return (
    <DataTable
      title="Query Result"
      data={data.map(toColumns)}
      columns={[syncedColumn, ...columns]}
      onRowClicked={handleRowClicked}
      onSelectedRowsChange={onSelectedRowsChange}
      highlightOnHover
      pointerOnHover
      selectableRows
      dense
      clearSelectedRows={clearCheckedRows}
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

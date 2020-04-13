import { EffectCallback, useEffect, useState } from 'react'
import { EventEmitter } from 'events'
import assert from 'assert'
import { BirdDataRow, DB, getDB } from '@modules/core'

export class AppController extends EventEmitter {
  private _query: string = 'Enter query here'
  private _selectedRow?: BirdDataRow

  constructor(private readonly _db: DB) {
    super()
  }

  public get query(): string {
    return this._query
  }

  public set query(value: string) {
    assert(value != null, 'cannot set null query')
    this._query = value
    this.emit('query-updated', this._query)
  }

  public get selectedRow(): BirdDataRow | undefined {
    return this._selectedRow
  }

  public set selectedRow(value: BirdDataRow | undefined) {
    this._selectedRow = value
    this.emit('row-selected', this._selectedRow)
  }

  async runQuery() {
    assert(this._query != null, 'cannot run null query')
    const result = await this._db.selectAllBirdData()
    this._emitQueryResult(result)
  }

  useSelectedRow = () => {
    const [selectedRow, setSelectedRow] = useState(this._selectedRow)

    const effect: EffectCallback = () => {
      function onRowSelected(row: BirdDataRow) {
        setSelectedRow(row)
      }

      this.on('row-selected', onRowSelected)
      return () => {
        this.off('row-selected', onRowSelected)
      }
    }
    useEffect(effect)

    return selectedRow
  }

  useQuery = () => {
    const [query, setQuery] = useState(this._query)
    const effect: EffectCallback = () => {
      function onQueryUpdated(query: string) {
        setQuery(query)
      }

      this.on('query-updated', onQueryUpdated)
      return () => {
        this.off('query-updated', onQueryUpdated)
      }
    }
    useEffect(effect)

    return query
  }

  useQueryResult = () => {
    const [queryResult, setQueryResult] = useState<BirdDataRow[]>([])

    const effect: EffectCallback = () => {
      function onQueryResult(result: BirdDataRow[]) {
        setQueryResult(result)
      }

      this.on('query-result', onQueryResult)
      return () => {
        this.off('query-result', onQueryResult)
      }
    }
    useEffect(effect)

    return queryResult
  }

  private static _instance: AppController | undefined

  static get instance(): AppController {
    assert(AppController._instance != null, 'need to call init first')
    return AppController._instance!
  }

  static get isInitialized() {
    return AppController._instance != null
  }

  static async init(dbLocation: string) {
    const db = await getDB(dbLocation)
    AppController._instance = new AppController(db)
  }

  async dispose() {
    try {
      await this._db.close()
    } catch (err) {
      console.error(err)
    }
  }

  private _emitQueryResult(result: BirdDataRow[]) {
    this.emit('query-result', result)
  }
}

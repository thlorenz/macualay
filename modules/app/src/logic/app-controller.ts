import { EffectCallback, useEffect, useState } from 'react'
import { EventEmitter } from 'events'
import assert from 'assert'
import { BirdDataRow, DB, getDB } from '@modules/core'

import { queries, Query } from '../queries/queries'

export class AppController extends EventEmitter {
  private _query: Query = queries.defaultQuery
  private _queries: readonly Query[] = queries.queries
  private _selectedRow?: BirdDataRow

  constructor(private readonly _db: DB) {
    super()
  }

  public refreshQueries() {}

  public get query() {
    return this._query
  }

  public editedQuery = (query: Query, value: string) => {
    assert(value != null, 'cannot set null query')
    if (query.custom) {
      this._query = { ...query, value }
    } else {
      this._query = { ...query, label: '<edit>', value }
    }
    this.emit('query-updated', this._query)
  }

  public selectedQuery(query: Query) {
    assert(query != null, 'cannot set null query')
    this._query = query
    this.emit('query-updated', this._query)
    this.runQuery()
  }

  public get selectedRow(): BirdDataRow | undefined {
    return this._selectedRow
  }

  public set selectedRow(value: BirdDataRow | undefined) {
    this._selectedRow = value
    this.emit('row-selected', this._selectedRow)
  }

  public savedQueryAs(savedQuery: Query) {
    this._queries = queries.refresh()
    this.emit('queries-updated', this._queries)
    this.selectedQuery(savedQuery)
  }

  public savedCurrentQuery() {
    this._queries = queries.refresh()
    this.emit('queries-updated', this._queries)
  }

  async runQuery() {
    assert(this._query != null, 'cannot run null query')
    const result = await this._db.queryWithResult(this.query.value)
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

  useQuery: () => Query = () => {
    const [query, setQuery] = useState(this._query)
    const effect: EffectCallback = () => {
      function onQueryUpdated(query: Query) {
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

  useQueries = () => {
    const [queries, setQueries] = useState<readonly Query[]>(this._queries)
    const effect: EffectCallback = () => {
      function onQueriesUpdated(queries: readonly Query[]) {
        setQueries(queries)
      }

      this.on('queries-updated', onQueriesUpdated)
      return () => {
        this.off('queries-updated', onQueriesUpdated)
      }
    }
    useEffect(effect)
    return queries
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

import { EffectCallback, useEffect, useState } from 'react'
import { EventEmitter } from 'events'
import assert from 'assert'
import { BirdDataRow, DB, connectDB } from '@modules/core'

import { queries, Query } from '../queries/queries'
import { Database, databases } from '../databases/databases'
import { syncDatabase, syncedAssetIds, SyncDetails } from './sync-database'

export class AppController extends EventEmitter {
  private _query: Query = queries.defaultQuery
  private _queries: readonly Query[] = queries.queries
  private _selectedRow?: BirdDataRow
  private _databases: readonly Database[] = databases.databases
  private _checkedAssetIDs: string[] = []

  constructor(private readonly _db: DB, private _syncingDatabase: Database) {
    super()
    this._updateSyncedAssetIds()
  }

  //
  // Database
  //
  useDatabases = () => {
    const [databases, setDatabases] = useState<readonly Database[]>(
      this._databases
    )

    const effect: EffectCallback = () => {
      function onDatabasesChanged(databases: Database[]) {
        setDatabases(databases)
      }

      this.on('databases-changed', onDatabasesChanged)
      return () => {
        this.off('databases-changed', onDatabasesChanged)
      }
    }
    useEffect(effect)

    return databases
  }

  useSyncingDatabase = () => {
    const [database, setDatabase] = useState(this._syncingDatabase)

    const effect: EffectCallback = () => {
      function onSyncingDatabaseChanged(database: Database) {
        databases.setCurrentDatabase(database)
        setDatabase(database)
      }

      this.on('syncing-database-changed', onSyncingDatabaseChanged)
      return () => {
        this.off('syncing-database-changed', onSyncingDatabaseChanged)
      }
    }
    useEffect(effect)

    return database
  }

  selectedDatabase(database: Database) {
    this._syncingDatabase = database
    this.emit('syncing-database-changed', this._syncingDatabase)
    this._updateSyncedAssetIds()
  }

  createdDatabase(dbFile: string) {
    this._databases = databases.refresh()
    this._syncingDatabase = databases.findDatabase(dbFile)
    this.emit('databases-changed', this._databases)
    this.emit('syncing-database-changed', this._syncingDatabase)
    this._updateSyncedAssetIds()
  }

  updateCheckedAssetIDs(assetIDs: string[]) {
    this._checkedAssetIDs = assetIDs
  }

  async _updateSyncedAssetIds() {
    const assetIDs = await syncedAssetIds(this._syncingDatabase.filePath)
    this.emit('synced-assetids-changed', assetIDs)
  }

  async addCheckedRows() {
    const syncRequest: SyncDetails = {
      mainDB: this._db,
      syncPath: this._syncingDatabase.filePath,
      assetIDs: this._checkedAssetIDs,
      action: 'add',
    }
    try {
      await syncDatabase(syncRequest)
      this._updateSyncedAssetIds()
      this.emit('checked-rows-added')
    } catch (err) {
      console.error(err)
    }
  }

  async removeCheckedRows() {
    const syncRequest: SyncDetails = {
      mainDB: this._db,
      syncPath: this._syncingDatabase.filePath,
      assetIDs: this._checkedAssetIDs,
      action: 'remove',
    }
    try {
      await syncDatabase(syncRequest)
      this._updateSyncedAssetIds()
      this.emit('checked-rows-added')
    } catch (err) {
      console.error(err)
    }
  }

  //
  // Sync Status
  //
  useSyncedAssetIDs() {
    const [syncedAssetIDs, setSyncedAssetIDs] = useState<Set<string>>(new Set())
    const effect: EffectCallback = () => {
      function onSyncedAssetIDsChanged(syncedAssetIDs: string[]) {
        setSyncedAssetIDs(new Set(syncedAssetIDs))
      }
      this.on('synced-assetids-changed', onSyncedAssetIDsChanged)
      return () => {
        this.off('synced-assetids-changed', onSyncedAssetIDsChanged)
      }
    }
    useEffect(effect)

    return syncedAssetIDs
  }

  useClearCheckedRows() {
    const [clearCheckedRows, setClearCheckedRows] = useState(false)
    const effect: EffectCallback = () => {
      function onCheckedRowsAdded() {
        setClearCheckedRows(true)
        setTimeout(() => setClearCheckedRows(false), 10)
      }
      this.on('checked-rows-added', onCheckedRowsAdded)
      return () => {
        this.off('checked-rows-added', onCheckedRowsAdded)
      }
    }
    useEffect(effect)

    return clearCheckedRows
  }

  //
  // Query
  //
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
    const db = await connectDB(dbLocation)
    const currentDatabase = await databases.getCurrentDatabase()
    AppController._instance = new AppController(db, currentDatabase)
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

import { EffectCallback, useEffect, useState } from 'react'
import { EventEmitter } from 'events'
import assert from 'assert'
import { BirdDataRow, DB, getDB } from '@modules/core'

export class AppController extends EventEmitter {
  constructor(private readonly _db: DB) {
    super()
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

  async runQuery(query: string) {
    const result = await this._db.selectAllBirdData()
    this._emitQueryResult(result)
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

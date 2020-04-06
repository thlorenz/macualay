import { Database } from 'sqlite3'
import { createBirdDataTable } from './create-table'
import { BirdData } from './types'

class DB {
  constructor(private readonly _db: Database) {}

  private _initTables(): Promise<void> {
    return new Promise((resolve, reject) =>
      this._db.exec(createBirdDataTable, (err: Error | null) =>
        err == null ? resolve() : reject(err)
      )
    )
  }

  addBirdDataRow(data: BirdData) {
    return new Promise((resolve, reject) =>
      this._db.exec(


      )
    )
  }

  static create(): Promise<DB> {
    return DB._instance != null
      ? Promise.resolve(DB._instance)
      : this._createDB()
  }

  private static _createDB(): Promise<DB> {
    return new Promise((resolve, reject) => {
      let db: Database
      db = new Database(DB.location, async (err: Error | null) => {
        if (err != null) reject(err)
        DB._instance = new DB(db)
        try {
          await DB._instance._initTables()
          resolve(DB._instance)
        } catch (err) {
          reject(err)
        }
      })
    })
  }

  private static _instance: DB | null = null
  static location = ':memory:'

  close(): Promise<void> {
    return new Promise((resolve, reject) =>
      this._db.close((err: Error | null) =>
        err == null ? resolve() : reject(err)
      )
    )
  }
}

export const getDB = DB.create

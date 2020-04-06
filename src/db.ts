import { Database } from 'sqlite3'

class DB {
  constructor(private readonly _db: Database) {}

  static create(): Promise<DB> {
    return DB._instance != null
      ? Promise.resolve(DB._instance)
      : new Promise((resolve, reject) => {
          let db: Database
          db = new Database(DB.location, (err: Error | null) => {
            if (err != null) reject(err)
            DB._instance = new DB(db)
            resolve(DB._instance)
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

export const getDB =  DB.create

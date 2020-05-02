import { accessSync, mkdirSync, readdirSync } from 'fs'
import { basename, join } from 'path'
import { storage } from '../logic/storage'
import { appDataRoot } from '../logic/util'

export const dataDirectory = join(appDataRoot, 'data')
mkdirSync(dataDirectory, { recursive: true })

export type Database = { label: string; filePath: string }

export function databaseLabelFromPath(p: string) {
  const file = basename(p)
  return file.replace(/.sqlite$/, '')
}

class Databases {
  private _databases: Database[] = []

  constructor() {
    this.refresh()
  }

  public refresh() {
    this._databases = []
    this._addDatabasesInside(dataDirectory)
    return this.databases
  }

  private _addDatabasesInside(dirname: string) {
    const files = readdirSync(dirname).filter((x) => /\.sqlite$/.test(x))
    for (const file of files) {
      const filePath = join(dirname, file)
      const label = databaseLabelFromPath(file)
      this._databases.push({ label, filePath })
    }
  }

  public findDatabase(filePath: string) {
    return (
      this._databases.find((x) => x.filePath === filePath) || this._databases[0]
    )
  }

  get databases(): ReadonlyArray<Database> {
    return this._databases
  }

  async getCurrentDatabase(): Promise<Database> {
    const db: Database | {} = await storage.get('current-database')
    if ((<Database>db).filePath == null) return this._databases[0]
    try {
      accessSync((<Database>db).filePath)
      return <Database>db
    } catch (_) {
      return this._databases[0]
    }
  }

  setCurrentDatabase(database: Database): Promise<void> {
    return storage.set<Database>('current-database', database)
  }
}

export const databases = new Databases()

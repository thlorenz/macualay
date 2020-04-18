import { mkdirSync, readdirSync } from 'fs'
import { join, basename } from 'path'
import { appRoot } from '../logic/util'

export const dataDirectory = join(appRoot, 'macualay', 'data')
mkdirSync(dataDirectory, { recursive: true })

export type Database = { label: string; filePath: string }

export function databaseLabelFromPath(p: string) {
  const file = basename(p)
  return file.replace(/.sqlite$/, '')
}

class Databases {
  private _databases: Database[] = []

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
}

export const databases = new Databases()

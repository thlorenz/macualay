import { mkdirSync, readdirSync, readFileSync } from 'fs'
import { join, basename } from 'path'
import { appDataRoot } from '../logic/util'

export type Query = {
  label: string
  value: string
  custom: boolean
  filePath: string
}

export const queryDirectory = join(appDataRoot, 'queries')
mkdirSync(queryDirectory, { recursive: true })

export function labelFromPath(p: string) {
  const file = basename(p)
  return file.replace(/.sql$/, '')
}

class Queries {
  private _queries: Query[] = []
  constructor() {
    this.refresh()
  }

  public refresh() {
    this._queries = []
    this._addQueriesInside(queryDirectory, true)
    this._addQueriesInside(__dirname, false)
    return this.queries
  }

  public findQuery(label: string) {
    return this._queries.find((x) => x.label === label) || this._queries[0]
  }

  private _addQueriesInside(dirname: string, custom: boolean) {
    const files = readdirSync(dirname).filter((x) => /\.sql$/.test(x))
    for (const file of files) {
      const filePath = join(dirname, file)
      const src = readFileSync(filePath, 'utf8')
      const label = labelFromPath(file)
      this._queries.push({ label, value: src, custom, filePath })
    }
  }

  get queries(): ReadonlyArray<Query> {
    return this._queries
  }
  get defaultQuery(): Query {
    return this.findQuery('bird-info-like')
  }
}

export const queries = new Queries()

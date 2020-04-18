import { mkdirSync, readdirSync, readFileSync } from 'fs'
import { join, basename } from 'path'
import { appRoot } from '../logic/util'

export type Query = { label: string; value: string }

export const queryDirectory = join(appRoot, 'macualay', 'queries')
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
    this._addQueriesInside(__dirname)
    this._addQueriesInside(queryDirectory)
    return this.queries
  }

  public findQuery(label: string) {
    return this._queries.find((x) => x.label === label) || this._queries[0]
  }

  private _addQueriesInside(dirname: string) {
    const files = readdirSync(dirname).filter((x) => /\.sql$/.test(x))
    for (const file of files) {
      const src = readFileSync(join(dirname, file), 'utf8')
      const label = labelFromPath(file)
      this._queries.push({ label, value: src })
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

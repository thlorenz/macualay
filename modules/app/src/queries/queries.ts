import { mkdirSync, readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { appRoot } from '../logic/util'

export type Query = { label: string; value: string }

const queries: Query[] = []

const queryDirectory = join(appRoot, 'macualay', 'queries')
mkdirSync(queryDirectory, { recursive: true })

const files = readdirSync(__dirname).filter((x) => /\.sql$/.test(x))
for (const file of files) {
  const src = readFileSync(join(__dirname, file), 'utf8')
  const label = file.replace(/.sql$/, '')
  queries.push({ label, value: src })
}

const defaultQuery =
  queries.find((x) => x.label === 'bird-info-like') || queries[0]
export { queries, defaultQuery }

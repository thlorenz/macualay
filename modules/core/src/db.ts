import { Database } from 'sqlite3'
import { BIRD_DATA_TABLE, createBirdDataTable } from './create-table'
import { BirdData, BirdDataRow, ExifData } from './types'

function escape(v: any) {
  if (typeof v !== 'string') return v
  return v.replace(/'/g, `''`)
}

const exifDataCols = [
  'exposure_time',
  'lens_model',
  'f_number',
  'focal_length',
  'iso',
  'mime_type',
  'create_dt',
  'model',
  'make',
]

// @ts-ignore
const ebirdDataCols = [
  'taxon_order',
  'sci_name_codes',
  'banding_codes',
  'order',
  'family_com_name',
  'family_sci_name',
]
export const idCols = [
  'assetId',
  'userId',
  'catalogId',
  'eBirdChecklistId',
] as const

export const locationCols = ['location', 'latitude', 'longitude'] as const

export const urlCols = [
  'previewUrl',
  'largeUrl',
  'mediaUrl',
  'thumbnailUrl',
  'mediaDownloadUrl',
  'specimenUrl',
  'userProfileUrl',
  'ebirdSpeciesUrl',
  'eBirdChecklistUrl',
] as const

export const ratingCols = ['rating', 'ratingCount'] as const

export const birdInfoCols = [
  'reportAs',
  'speciesCode',
  'sciName',
  'commonName',
] as const

export const imageInfoCols = ['width', 'height'] as const

export const databaseColumns = [
  ...idCols,
  'userDisplayName',
  ...locationCols,
  ...urlCols,
  ...ratingCols,
  ...birdInfoCols,
  ...imageInfoCols,
  ...exifDataCols,
  'mediaType',
  'source',
  'licenseType',
  // ...ebirdDataCols
] as const
const allCols = databaseColumns.join(',')

const numberCols = ['latitude', 'longitude', 'width', 'height']

export class DB {
  private constructor(private readonly _db: Database) {}

  private _execQuery(query: string): Promise<void> {
    return new Promise((resolve, reject) =>
      this._db.exec(query, (err: Error | null) =>
        err == null ? resolve() : reject(err)
      )
    )
  }

  queryWithResult(query: string): Promise<any[]> {
    return new Promise((resolve, reject) =>
      this._db.all(query, (err: Error | null, rows: any[]) =>
        err == null ? resolve(rows) : reject(err)
      )
    )
  }

  private _initTables(): Promise<void> {
    return this._execQuery(createBirdDataTable)
  }

  addBirdDataRow(data: BirdData) {
    const row: Record<string, any> | BirdDataRow = { ...data }
    delete row.exifData
    for (const [k, val] of Object.entries(data.exifData)) {
      if (exifDataCols.includes(k)) row[k] = val
    }

    const values: (string | number | ExifData)[] = []
    for (const [k, v] of Object.entries(row)) {
      const colIdx = databaseColumns.indexOf(k)
      values[colIdx] = numberCols.includes(k) ? v : `'${escape(v)}'`
    }
    const parameters = values.join(',')

    const query = `INSERT INTO ${BIRD_DATA_TABLE} (${allCols}) VALUES (${parameters})`
    return this._execQuery(query)
  }

  async selectAllBirdData(): Promise<BirdDataRow[]> {
    return this.queryWithResult(`SELECT * FROM ${BIRD_DATA_TABLE};`)
  }

  static createOrConnect(location = DB.location): Promise<DB> {
    return new Promise((resolve, reject) => {
      let sqliteDB: Database
      sqliteDB = new Database(location, async (err: Error | null) => {
        if (err != null) reject(err)
        const db = new DB(sqliteDB)
        try {
          await db._initTables()
          resolve(db)
        } catch (err) {
          reject(err)
        }
      })
    })
  }

  static location = ':memory:'

  close(): Promise<void> {
    return new Promise((resolve, reject) =>
      this._db.close((err: Error | null) =>
        err == null ? resolve() : reject(err)
      )
    )
  }
}

export const connectDB = DB.createOrConnect
export { BIRD_DATA_TABLE }

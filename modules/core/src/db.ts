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

const columns = [
  // IDs
  'assetId',
  'userId',
  'catalogId',
  'eBirdChecklistId',

  'userDisplayName',

  // Location
  'location',
  'latitude',
  'longitude',

  // URLs
  'previewUrl',
  'largeUrl',
  'mediaUrl',
  'thumbnailUrl',
  'mediaDownloadUrl',
  'specimenUrl',
  'userProfileUrl',
  'ebirdSpeciesUrl',
  'eBirdChecklistUrl',

  // Rating
  'rating',
  'ratingCount',

  // Bird Info
  'reportAs',
  'speciesCode',
  'sciName',
  'commonName',

  // Image Info
  'width',
  'height',

  // ExifData
  ...exifDataCols,

  // Misc
  'mediaType',
  'source',
  'licenseType',

  // Ebird data
  // ...ebirdDataCols
]
const allCols = columns.join(',')

const numberCols = ['latitude', 'longitude', 'width', 'height']

class DB {
  constructor(private readonly _db: Database) {}

  _execQuery(query: string): Promise<void> {
    return new Promise((resolve, reject) =>
      this._db.exec(query, (err: Error | null) =>
        err == null ? resolve() : reject(err)
      )
    )
  }

  _allQuery(query: string): Promise<any[]> {
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
      const colIdx = columns.indexOf(k)
      values[colIdx] = numberCols.includes(k) ? v : `'${escape(v)}'`
    }
    const parameters = values.join(',')

    const query = `INSERT INTO ${BIRD_DATA_TABLE} (${allCols}) VALUES (${parameters})`
    return this._execQuery(query)
  }

  async selectAllBirdData(): Promise<BirdDataRow[]> {
    return this._allQuery(`SELECT * FROM ${BIRD_DATA_TABLE};`)
  }

  static create(location = DB.location): Promise<DB> {
    return DB._instance != null
      ? Promise.resolve(DB._instance)
      : DB._createDB(location)
  }

  private static _createDB(location: string): Promise<DB> {
    return new Promise((resolve, reject) => {
      let db: Database
      db = new Database(location, async (err: Error | null) => {
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

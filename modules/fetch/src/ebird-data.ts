import assert from 'assert'
import { EbirdSpeciesData } from '@modules/core'
import fs from 'fs'
import path from 'path'

const CSV_FILE = path.join(__dirname, '../../../data/ebird.csv')

// 0 based index in csv result
const ebirdDataFields = {
  SPECIES_CODE: 2,
  TAXON_ORDER: 4,
  SCI_NAME_CODES: 6,
  BANDING_CODES: 7,
  ORDER: 8,
  FAMILY_COM_NAME: 9,
  FAMILY_SCI_NAME: 10,
}

let processedCSV: Map<string, EbirdSpeciesData> | undefined

async function processCSV(
  csvFile: string = CSV_FILE
): Promise<Map<string, EbirdSpeciesData>> {
  if (processedCSV != null) return Promise.resolve(processedCSV)

  const src = await fs.promises.readFile(csvFile, 'utf8')
  const rows = src.split('\n').slice(1)
  processedCSV = new Map()
  for (const row of rows) {
    const cols = row.split(',').map((x) => x.trim())
    processedCSV.set(cols[ebirdDataFields.SPECIES_CODE], {
      taxon_order: parseFloat(cols[ebirdDataFields.TAXON_ORDER]),
      sci_name_codes: cols[ebirdDataFields.SCI_NAME_CODES],
      banding_codes: cols[ebirdDataFields.BANDING_CODES],
      ebird_order: cols[ebirdDataFields.ORDER],
      family_com_name: cols[ebirdDataFields.FAMILY_COM_NAME],
      family_sci_name: cols[ebirdDataFields.FAMILY_SCI_NAME],
    })
  }
  return processedCSV
}

export async function ebirdSpeciesData(
  speciesCode: string
): Promise<EbirdSpeciesData> {
  const data = await processCSV()
  assert(data.has(speciesCode), `unknown species ${speciesCode}`)
  return data.get(speciesCode)!
}

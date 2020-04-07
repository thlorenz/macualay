import assert from 'assert'
import fetch from 'node-fetch'
import { EbirdSpeciesData } from './types'

// 0 based index in csv result
const ebirdDataFields = {
  TAXON_ORDER: 4,
  SCI_NAME_CODES: 6,
  BANDING_CODES: 7,
  ORDER: 8,
  FAMILY_COM_NAME: 9,
  FAMILY_SCI_NAME: 10,
}

// @ts-ignore
function extractFromCsv(csv: string): EbirdSpeciesData {
  const rows = csv.split('\n')
  assert(rows.length >= 2, 'need header + one data row')
  const cols: string[] = rows[1].split(',')

  return {
    taxon_order: parseFloat(cols[ebirdDataFields.TAXON_ORDER]),
    sci_name_codes: cols[ebirdDataFields.SCI_NAME_CODES],
    banding_codes: cols[ebirdDataFields.BANDING_CODES],
    order: cols[ebirdDataFields.ORDER],
    family_com_name: cols[ebirdDataFields.FAMILY_COM_NAME],
    family_sci_name: cols[ebirdDataFields.FAMILY_SCI_NAME],
  }
}

export async function fetchEbirdData(species: string) {
  const url = `https://api.ebird.org/v2/ref/taxonomy/ebird?${species}`
  const res = await fetch(url)
  assert(res.status === 200, 'request failed')
  const csv = await res.text()
  console.log(csv)
}

(async () => {
  await fetchEbirdData('zebdov')
})()

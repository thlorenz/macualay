import * as path from 'path'
import {
  connectDB,
  MacaulayPage,
  EbirdSpeciesData,
  EMPTY_EBIRD_SPECIES_DATA,
} from '@modules/core'
import { ebirdSpeciesData } from './ebird-data'

export async function processMacualayPage(
  page: MacaulayPage,
  dbLocation: string
) {
  const db = await connectDB(dbLocation)
  for (const result of page.results.content) {
    let ebirdData: EbirdSpeciesData = EMPTY_EBIRD_SPECIES_DATA
    try {
      ebirdData = await ebirdSpeciesData(result.speciesCode)
    } catch (err) {
      console.error(err)
    }
    await db.addBirdData(result, ebirdData)
  }
  const birdData = await db.selectAllBirdData()
  console.log(birdData)
  await db.close()
}

;(async () => {
  const dbLocation = path.resolve(__dirname, '../../../data/macaulay.sqlite')
  const page = require('../../../data/page.01.json')
  try {
    await processMacualayPage(page, dbLocation)
  } catch (err) {
    console.error(err)
  }
})()

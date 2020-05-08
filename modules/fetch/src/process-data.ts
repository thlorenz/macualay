import {
  connectDB,
  MacaulayPage,
  EbirdSpeciesData,
  EMPTY_EBIRD_SPECIES_DATA,
  DB,
} from '@modules/core'
import { ebirdSpeciesData } from './ebird-data'

import debug from 'debug'

const logError = debug('process:error')

export async function processMacualayPage(
  page: MacaulayPage,
  dbLocation: string
) {
  let db: DB
  try {
    db = await connectDB(dbLocation)
    for (const result of page.results.content) {
      let ebirdData: EbirdSpeciesData = EMPTY_EBIRD_SPECIES_DATA
      try {
        ebirdData = await ebirdSpeciesData(result.speciesCode)
        await db.addBirdData(result, ebirdData)
      } catch (err) {
        logError('adding %o, %o, %s', result, ebirdData, err)
      }
    }
  } catch (err) {
    logError(err)
  } finally {
    // @ts-ignore assigned inside try/catch
    await db.close()
  }
}

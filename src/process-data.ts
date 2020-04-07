import { MacaulayPage } from './types'
import { getDB } from './db'
import * as path from 'path'

export async function processMacualayPage(page: MacaulayPage, dbLocation: string) {
  const db = await getDB(dbLocation)
  for (const result of page.results.content) {
    await db.addBirdDataRow(result)
  }
  const birdData = await db.selectAllBirdData()
  console.log(birdData)
  await db.close()
}

(async () => {
  const dbLocation = path.resolve(__dirname, '../data/macaulay.sqlite')
  console.log({ dbLocation} )
  const page = require('../data/page.01.json')
  try {
    await processMacualayPage(page, dbLocation)
  } catch (err) {
    console.error(err)
  }
})()

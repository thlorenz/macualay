import * as path from 'path'
import { connectDB, MacaulayPage } from '@modules/core'

export async function processMacualayPage(
  page: MacaulayPage,
  dbLocation: string
) {
  const db = await connectDB(dbLocation)
  for (const result of page.results.content) {
    await db.addBirdDataRow(result)
  }
  const birdData = await db.selectAllBirdData()
  console.log(birdData)
  await db.close()
}

;(async () => {
  const dbLocation = path.resolve(__dirname, '../../../data/macaulay.sqlite')
  console.log({ dbLocation })
  const page = require('../../../data/page.01.json')
  try {
    await processMacualayPage(page, dbLocation)
  } catch (err) {
    console.error(err)
  }
})()

import { MacaulayPage } from './types'
import { getDB } from './db'

export async function processMacualayPage(page: MacaulayPage) {
  const db = await getDB()
  for (const result of page.results.content) {
    await db.addBirdDataRow(result)
  }
  const birdData = await db.selectAllBirdData()
  console.log(birdData)
  await db.close()
}

(async () => {
  const page = require('../data/page.01.json')
  try {
    await processMacualayPage(page)
  } catch (err) {
    console.error(err)
  }
})()

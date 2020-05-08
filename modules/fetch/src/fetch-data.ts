import * as path from 'path'
import fetch from 'node-fetch'
import { MacaulayPage } from '@modules/core'
import { processMacualayPage } from './process-data'

import debug from 'debug'

const logInfo = debug('fetch:info')
// const logDebug = debug('fetch:debug')

const MACAULAY_URL = 'https://search.macaulaylibrary.org/catalog.json'
const USER_ID = 'USER163746'
const COUNT = 100

const rootURL = `${MACAULAY_URL}?userId=${USER_ID}&count=${COUNT}`

const urlForCursor = (cursor: string) =>
  `${rootURL}&initialCursorMark=${encodeURIComponent(cursor)}`

const startURL = rootURL

async function fetchAll(dbLocation: string) {
  const visitedCursors: Set<string> = new Set()
  return fetchRecursive(startURL, dbLocation, visitedCursors)
}

async function fetchRecursive(
  url: string,
  dbLocation: string,
  visitedCursors: Set<string>
): Promise<void> {
  logInfo(url)
  const res = await fetch(url)
  const page: MacaulayPage = await res.json()
  const nextCursor = page.results?.nextCursorMark
  if (nextCursor == null || visitedCursors.has(nextCursor)) return

  await processMacualayPage(page, dbLocation)
  visitedCursors.add(nextCursor)
  return fetchRecursive(urlForCursor(nextCursor), dbLocation, visitedCursors)
}

;(async () => {
  try {
    const dbLocation = path.resolve(__dirname, '../../../data/macaulay.sqlite')
    await fetchAll(dbLocation)
  } catch (err) {
    console.error(err)
  }
})()

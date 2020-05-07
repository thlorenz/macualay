const MACAULAY_URL = 'https://search.macaulaylibrary.org/catalog.json'
const USER_ID = 'USER163746'
const COUNT = 100

const rootURL = `${MACAULAY_URL}?userId=${USER_ID}&&count=${COUNT}`

const urlForCursor = (cursor: string) => `${rootURL}&&cursorMark=${cursor}`
const startURL = rootURL

async function fetchAll() {}

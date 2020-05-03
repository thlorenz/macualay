import { connectDB, DB } from '@modules/core'

export type SyncRequest = {
  mainDB: DB
  syncPath: string
  assetIDs: string[]
}

export async function syncDatabase(syncRequest: SyncRequest) {
  let syncDB
  try {
    syncDB = await connectDB(syncRequest.syncPath)
    const rows = await syncRequest.mainDB.resolveRows(syncRequest.assetIDs)
    await syncDB.addBirdDataRows(rows)
  } catch (err) {
    console.error(err)
  } finally {
    await syncDB?.close()
  }
}

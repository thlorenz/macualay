import { connectDB, DB } from '@modules/core'

export type SyncDetails = {
  mainDB: DB
  syncPath: string
  assetIDs: string[]
}

export async function syncDatabase(syncRequest: SyncDetails) {
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

export async function syncedAssetIds(syncPath: string): Promise<string[]> {
  let syncDB
  try {
    syncDB = await connectDB(syncPath)
    return syncDB.getAllAssetIds()
  } catch (err) {
    console.error(err)
    return Promise.resolve([])
  }
}

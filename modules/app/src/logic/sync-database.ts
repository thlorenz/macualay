import { connectDB, DB } from '@modules/core'

export class UnreachableCaseError extends Error {
  constructor(val: never | undefined) {
    super(`Unreachable case inside switch statement: ${val}`)
  }
}

type SyncAction = 'add' | 'remove'
export type SyncDetails = {
  mainDB: DB
  syncPath: string
  assetIDs: string[]
  action: SyncAction
}

export async function syncDatabase(syncRequest: SyncDetails) {
  let syncDB
  try {
    syncDB = await connectDB(syncRequest.syncPath)
    switch (syncRequest.action) {
      case 'add': {
        const rows = await syncRequest.mainDB.resolveRows(syncRequest.assetIDs)
        await syncDB.addBirdDataRows(rows)
        break
      }
      case 'remove': {
        await syncDB.removeBirdData(syncRequest.assetIDs)
        break
      }
      default:
        throw new UnreachableCaseError(syncRequest.action)
    }
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

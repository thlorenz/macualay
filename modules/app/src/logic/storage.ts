import { mkdirSync } from 'fs'
import { appDataRoot } from '../logic/util'
import electronStorage from 'electron-json-storage'
import { join } from 'path'

export const storageDirectory = join(appDataRoot, 'storage')
mkdirSync(storageDirectory, { recursive: true })
electronStorage.setDataPath(storageDirectory)

class Storage {
  async get<T extends object>(key: string): Promise<T> {
    return new Promise((resolve, reject) => {
      electronStorage.get(key, (err, data) =>
        err == null ? resolve(data as T) : reject(err)
      )
    })
  }

  async set<T extends object>(key: string, value: T): Promise<void> {
    return new Promise((resolve, reject) => {
      electronStorage.set(key, value, (err) =>
        err == null ? resolve() : reject(err)
      )
    })
  }
}

export const storage = new Storage()

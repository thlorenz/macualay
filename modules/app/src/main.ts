import { connectDB } from '@modules/core'
import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  IpcMainEvent,
  Rectangle,
  screen,
} from 'electron'
import isDev from 'electron-is-dev'
import * as fs from 'fs'
import * as path from 'path'
import { dataDirectory } from './databases/databases'
import { labelFromPath, Query, queryDirectory } from './queries/queries'

const TWITCH_SETUP = false

let mainWindow: BrowserWindow | null

function getPrimaryDisplay() {
  const displays = screen.getAllDisplays()
  return displays[0].workArea
}

function getSecondaryDisplay() {
  const displays = screen.getAllDisplays()
  const last = displays.pop()!
  const area = last.workArea
  return area
}

function placeRightSecondaryDisplay(): Rectangle {
  const area = getSecondaryDisplay()
  const width = area.width / 2
  const height = area.height
  return {
    x: area.x + width,
    y: area.y,
    width,
    height,
  }
}

function placeLeftPrimaryDisplay(): Rectangle {
  const area = getPrimaryDisplay()
  const width = area.width / 5
  const height = area.height
  return {
    x: area.x,
    y: area.y,
    width,
    height,
  }
}

async function createWindow() {
  const rect = TWITCH_SETUP
    ? placeLeftPrimaryDisplay()
    : placeRightSecondaryDisplay()

  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
  })

  // and load the index.html of the app.
  await mainWindow.loadFile(path.join(__dirname, '../index.html'))

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  mainWindow.setOpacity(1.0)

  ipcMain
    .on(
      'save-query-as',
      async (event: IpcMainEvent, defaultLabel: string, query: string) => {
        let error: Error | undefined = undefined
        let label: string | undefined = undefined
        const res = await dialog.showSaveDialog(mainWindow!, {
          title: 'Save current query as',
          defaultPath: path.join(queryDirectory, `${defaultLabel}.sql`),
          filters: [{ name: 'SQL Files', extensions: ['sql'] }],
        })
        if (res.canceled || res.filePath == null) return
        try {
          await fs.promises.writeFile(res.filePath, query, 'utf8')
          label = labelFromPath(res.filePath)
        } catch (err) {
          error = err
        } finally {
          event.reply('saved-query-as', { err: error, label })
        }
      }
    )
    .on('save-query', async (event: IpcMainEvent, query: Query) => {
      let error: Error | undefined = undefined
      try {
        await fs.promises.writeFile(query.filePath, query.value, 'utf8')
      } catch (err) {
        error = err
      } finally {
        event.reply('saved-query', { err: error })
      }
    })
    .on('create-database', async (event: IpcMainEvent) => {
      let error: Error | undefined = undefined
      const res = await dialog.showSaveDialog(mainWindow!, {
        title: 'Select database location',
        defaultPath: path.join(dataDirectory, `new.sqlite`),
        filters: [{ name: 'SQLite Databases', extensions: ['sqlite'] }],
      })
      if (res.canceled || res.filePath == null) return

      try {
        const db = await connectDB(res.filePath)
        await db.close()
      } catch (err) {
        error = err
      } finally {
        event.reply('created-database', { err: error, dbFile: res.filePath })
      }
    })

  if (isDev) {
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
      forceHardReset: false,
      hardResetMethod: 'exit',
    })
    mainWindow.webContents.openDevTools({ mode: 'bottom' })
  }
}

if (app != null) {
  app.allowRendererProcessReuse = false
  app
    .on('ready', createWindow)
    .on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })
    .on('activate', () => {
      if (mainWindow === null) {
        createWindow()
      }
    })
}

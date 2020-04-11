import { app, BrowserWindow, Rectangle, screen } from 'electron'
import * as path from 'path'
import isDev from 'electron-is-dev'

let mainWindow: BrowserWindow | null

function getLastDisplay() {
  const displays = screen.getAllDisplays()
  const last = displays.pop()!
  const area = last.workArea
  return area
}

function placeRight(area: Rectangle): Rectangle {
  const width = area.width / 2
  const height = area.height
  return {
    x: area.x + width,
    y: area.y,
    width,
    height,
  }
}

async function createWindow() {
  const area = getLastDisplay()
  const rect = placeRight(area)

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
  app.allowRendererProcessReuse = true
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

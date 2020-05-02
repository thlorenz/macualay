import { join } from 'path'
import { homedir } from 'os'

export const APP_NAME = 'macaulay'
export const appData =
  process.env.APPDATA || process.platform === 'darwin'
    ? join(homedir(), 'Library', 'Preferences')
    : join(homedir(), '.local', 'share')

export const appDataRoot = join(appData, APP_NAME)

import { join } from 'path'
import { homedir } from 'os'

export const appRoot =
  process.env.APPDATA || process.platform === 'darwin'
    ? join(homedir(), 'Library', 'Preferences')
    : join(homedir(), '.local', 'share')

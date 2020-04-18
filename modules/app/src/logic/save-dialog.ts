import { ipcRenderer, IpcRendererEvent } from 'electron'
import { Query } from '../queries/queries'

export async function saveQueryAs(
  label: string,
  query: string
): Promise<string> {
  ipcRenderer.send('save-query-as', label, query)
  return new Promise((resolve, reject) => {
    ipcRenderer.on(
      'saved-query-as',
      (_event: IpcRendererEvent, result: { err?: Error; label?: string }) => {
        if (result.err == null) resolve(result.label!)
        else reject(result.err)
      }
    )
  })
}

export async function saveQuery(query: Query): Promise<string> {
  ipcRenderer.send('save-query', query)
  return new Promise((resolve, reject) => {
    ipcRenderer.on(
      'saved-query',
      (_event: IpcRendererEvent, result: { err?: Error }) => {
        if (result.err == null) resolve()
        else reject(result.err)
      }
    )
  })
}

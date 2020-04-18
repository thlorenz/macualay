import { ipcRenderer, IpcRendererEvent } from 'electron'

export async function saveQuery(label: string, query: string): Promise<string> {
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

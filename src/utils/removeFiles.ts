import { readdirSync, unlink } from 'fs'
import path from 'path'

export function removeFiles (filesDir: string): void {
  readdirSync(filesDir)?.forEach(fileName => {
    unlink(path.join(filesDir, fileName), (err) => {
      if (err != null) throw err
      console.log(`${fileName} was deleted`)
    })
  })
}

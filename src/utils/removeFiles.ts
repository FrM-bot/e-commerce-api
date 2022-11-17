import fs from 'node:fs'
import path from 'path'

export function removeFiles (filesDir: string): void {
  fs.readdirSync(filesDir)?.forEach(fileName => {
    fs.unlink(path.join(filesDir, fileName), (err) => {
      if (err !== null) throw err
      console.log(`${fileName} was deleted`)
    })
  })
}

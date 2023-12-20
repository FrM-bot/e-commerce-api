import { unlink } from 'node:fs/promises'

export async function removeFile (filePath: string) {
  await unlink(filePath)
  console.log(`${filePath} was deleted`)
}

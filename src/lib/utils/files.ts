import { unlink } from 'node:fs/promises'
export const Files = {
  async delete ({ path }: { path: string }) {
    try {
      await unlink(path)
      console.log(`${path} was deleted`)
    } catch (error) {
      console.error(error)
    }
  },
  async deleteMany ({ filePaths }: { filePaths: string[] }) {
    try {
      const promises = filePaths.map(async path => await this.delete({ path }))
      await Promise.all(promises)
    } catch (error) {
      console.error(error)
    }
  }
}

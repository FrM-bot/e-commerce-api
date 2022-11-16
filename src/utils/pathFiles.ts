import path from 'path'
const { pathname } = new URL('../', import.meta.url)
const pathFiles = pathname.slice(1)

export const destFiles = path.join(pathFiles, '../tpm')

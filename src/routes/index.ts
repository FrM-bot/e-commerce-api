import { Router } from 'express'

import path from 'node:path'

import fs from 'node:fs/promises'

const router = Router()

const { pathname } = new URL('./', import.meta.url)
const rootPath = pathname.slice(1)

const PATH_ROUTER = `${rootPath}`

console.log({ PATH_ROUTER, pathname })

function removeExtension (fileName: string): string {
  const file = fileName.split('.')[0]
  return file
}

async function readFiles (path: string) {
  try {
    const files = await fs.readdir(path)
    console.log({ files })
    return files
  } catch (error: any) {
    console.error(error)
  }
}

void readFiles(path.join('dist', 'routes')).then(files => {
  files?.forEach((fileName) => {
    const cleanName = removeExtension(fileName)
    if (cleanName !== 'index') {
      import(`./${cleanName}.js`)
        .then(moduleRouter => {
          console.log(`Se está cargando la ruta: /${cleanName}`)
          router.use(`/${cleanName}`, moduleRouter.router)
        }).catch(console.error)
    }
  })
})

// fs.readdirSync(PATH_ROUTER).forEach((fileName) => {
//   const cleanName = removeExtension(fileName)
//   if (cleanName !== 'index') {
//     import(`./${cleanName}.js`)
//       .then(moduleRouter => {
//         console.log(`Se está cargando la ruta: /${cleanName}`)
//         router.use(`/${cleanName}`, moduleRouter.router)
//       }).catch(console.error)
//   }
// })

export { router }

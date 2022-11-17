import { Router } from 'express'

import fs from 'fs'

const router = Router()

const { pathname } = new URL('./', import.meta.url)
const rootPath = pathname.slice(1)

const PATH_ROUTER = `${rootPath}`

function removeExtension (fileName: string): string {
  const file = fileName.split('.')[0]
  return file
}

fs.readdirSync(PATH_ROUTER).forEach((fileName) => {
  const cleanName = removeExtension(fileName)
  if (cleanName !== 'index') {
    import(`./${cleanName}.js`)
      .then(moduleRouter => {
        console.log(`Se está cargando la ruta: /${cleanName}`)
        router.use(`/${cleanName}`, moduleRouter.router)
      }).catch(console.error)
  }
})

export { router }

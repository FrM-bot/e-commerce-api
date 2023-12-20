import { join, parse } from 'node:path'
import { readdir } from 'node:fs/promises'
import { NODE_ENV } from '@lib/config'

const mainFolder = NODE_ENV === 'production' ? 'dist' : 'src'

const PATH_ROUTER = join(mainFolder, 'routes')

function removeExtension (fileName: string) {
  const { name, ext } = parse(fileName)
  return {
    name,
    ext
  }
}

async function readFiles (path: string) {
  try {
    const files = await readdir(path)
    return files
  } catch (error: any) {
    console.error(error)
  }
}

const files = await readFiles(PATH_ROUTER) ?? []

let Routes: Array<{ path: string, createRouter: ({ Model: { ...Model } }) => any }> = []

for (const fileName of files) {
  const { name } = removeExtension(fileName)
  if (name !== 'index') {
    const routeModule = await import(`./${fileName}`)
    if (routeModule?.createRouter) {
      Routes = Routes.concat({
        path: `/${name}`,
        createRouter: routeModule.createRouter
      })
    }
  }
}

export { Routes }

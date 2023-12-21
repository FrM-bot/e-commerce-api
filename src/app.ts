/* eslint-disable @typescript-eslint/no-unsafe-argument */
import 'dotenv/config'
import Express from 'express'
import { Routes } from './routes/index.js'
import { corsMiddleware } from './middlewares/index.js'
import type { DatabaseModels } from './lib/interfaces/index.js'

export const createApp = ({ Models, mode = 'development', port = 3001 }: { Models: DatabaseModels, mode?: string, port?: number }) => {
  const app = Express()

  app.disable('X-Powered-By')

  app.use(corsMiddleware())

  app.use(Express.static('public'))

  app.use(Express.json())

  console.log('Paths:')
  for (const { path, createRouter } of Routes) {
    console.log('- ', path)
    app.use(path, createRouter({ Model: { ...Models } }))
  }

  app.use('/mode', (req, res) => {
    res.send({
      data: mode
    })
  })

  app.listen(port, () => {
    console.log(`App listen on: http://localhost:${port}`)
    console.log(`Mode: ${mode}`)
  })
}

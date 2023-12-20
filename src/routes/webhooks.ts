import { type RequestHandler, Router } from 'express'
import { WebhooksController } from '../controllers/index.js'
import type { DatabaseModels } from '../lib/interfaces/index.js'

export type ModelsRequired = Pick<DatabaseModels, 'item' | 'user' >

const createRouter = ({ Model }: { Model: ModelsRequired }) => {
  const controller = new WebhooksController({ Model })
  const router = Router()

  router.post('/mercadolibre', controller.post as RequestHandler<any, any, Record<string, any>>)

  return router
}

export { createRouter }

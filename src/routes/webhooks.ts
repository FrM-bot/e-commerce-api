import { Router } from 'express'
import { WebhooksController } from '../controllers/index.js'
import type { DatabaseModels } from '../lib/interfaces/index.js'

export type ModelsRequired = Pick<DatabaseModels, 'item' | 'payment' | 'stock' | 'cart' | 'user'>

const createRouter = ({ Model }: { Model: ModelsRequired }) => {
  const controller = new WebhooksController({ Model })
  const router = Router()

  router.post('/mercadolibre', controller.post)

  return router
}

export { createRouter }

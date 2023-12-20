import { Router } from 'express'
import { WebhooksController } from '../controllers/index.js'
import type { UserModel, ItemModel } from '../lib/interfaces/index.js'

interface ModelUserRouterRequired { user: UserModel, item: ItemModel }

const createRouter = ({ Model }: { Model: ModelUserRouterRequired }) => {
  const controller = new WebhooksController({ Model })
  const router = Router()

  router.post('/mercadolibre', controller.post as any)

  return router
}

export { createRouter, ModelUserRouterRequired }

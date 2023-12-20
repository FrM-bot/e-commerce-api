import { Router } from 'express'
import { FavoritesController } from '../controllers/index.js'
import { Token } from '../lib/utils/index.js'
import type { DatabaseModels } from '../lib/interfaces/index.js'

export type ModelsRequired = Pick<DatabaseModels, 'user' >

const createRouter = ({ Model }: { Model: ModelsRequired }) => {
  const controller = new FavoritesController({ Model })
  const router = Router()

  router.put('/add/:itemId', Token.middleware, controller.addFavorite as any)

  router.delete('/remove/:itemId', Token.middleware, controller.removeFavorite as any)

  return router
}

export { createRouter }

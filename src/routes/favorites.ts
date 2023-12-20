import { type RequestHandler, Router } from 'express'
import { FavoritesController } from '../controllers/index.js'
import { Token } from '../lib/utils/index.js'
import type { DatabaseModels } from '../lib/interfaces/index.js'

export type ModelsRequired = Pick<DatabaseModels, 'user' >

const createRouter = ({ Model }: { Model: ModelsRequired }) => {
  const controller = new FavoritesController({ Model })
  const router = Router()

  router.put('/add/:itemId', Token.middleware, controller.addFavorite as unknown as RequestHandler<any, any, Record<string, any>>)

  router.delete('/remove/:itemId', Token.middleware, controller.removeFavorite as unknown as RequestHandler<any, any, Record<string, any>>)

  return router
}

export { createRouter }

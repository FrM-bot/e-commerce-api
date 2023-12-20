import { type RequestHandler, Router } from 'express'
import { CartController } from '../controllers/index.js'
import { Token } from '../lib/utils/index.js'
import type { DatabaseModels } from '../lib/interfaces/index.js'

export type ModelsRequired = Pick<DatabaseModels, 'user' | 'cart' >

const createRouter = ({ Model }: { Model: ModelsRequired }) => {
  const controller = new CartController({ Model })

  const router = Router()

  router.put('/add/:itemId', Token.middleware, controller.addCart as unknown as RequestHandler<any, any, Record<string, any>>)

  router.patch('/:itemId', Token.middleware, controller.editCart as unknown as RequestHandler<any, any, Record<string, any>>)

  router.delete('/remove/:itemId', Token.middleware, controller.removeCart as unknown as RequestHandler<any, any, Record<string, any>>)

  return router
}

export { createRouter }

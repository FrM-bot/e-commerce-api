/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Router } from 'express'
import { CartController } from '../controllers/index.js'
import { Token } from '../lib/utils/index.js'
import type { DatabaseModels } from '../lib/interfaces/index.js'

export type ModelsRequired = Pick<DatabaseModels, 'user' | 'cart' >

const createRouter = ({ Model }: { Model: ModelsRequired }) => {
  const controller = new CartController({ Model })

  const router = Router()

  router.put('/add/:itemId', Token.middleware, controller.addCart as any)

  router.patch('/:itemId', Token.middleware, controller.editCart as any)

  router.delete('/remove/:itemId', Token.middleware, controller.removeCart as any)

  return router
}

export { createRouter }

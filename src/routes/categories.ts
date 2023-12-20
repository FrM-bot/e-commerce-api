/* eslint-disable @typescript-eslint/unbound-method */
import { Router } from 'express'
import { CategoryController } from '../controllers/index.js'
import { Token } from '../lib/utils/index.js'
import type { DatabaseModels } from '../lib/interfaces/index.js'

export type ModelsRequired = Pick<DatabaseModels, 'category' >

const createRouter = ({ Model }: { Model: ModelsRequired }) => {
  const controller = new CategoryController({ Model })

  const router = Router()

  router.get('/', controller.getAll)

  router.patch('/:id', Token.middleware, controller.patch)

  router.delete('/:id', Token.middleware, controller.delete)

  return router
}

export { createRouter }

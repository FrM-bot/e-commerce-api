/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Router } from 'express'
import { UserController } from '../controllers/index.js'
import { Token } from '../lib/utils/index.js'
import type { DatabaseModels } from '../lib/interfaces/index.js'

export type ModelsRequired = Pick<DatabaseModels, 'item' | 'user' >

const createRouter = ({ Model }: { Model: ModelsRequired }) => {
  const controller = new UserController({ Model })
  const router = Router()

  router.get('/', Token.middleware, controller.get as any)

  router.post('/register/:provider', Token.middleware, controller.register as any)

  return router
}

export { createRouter }

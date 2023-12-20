/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type RequestHandler, Router } from 'express'
import { UserController } from '../controllers/index.js'
import { Token } from '../lib/utils/index.js'
import type { DatabaseModels } from '../lib/interfaces/index.js'

export type ModelsRequired = Pick<DatabaseModels, 'item' | 'user' >

const createRouter = ({ Model }: { Model: ModelsRequired }) => {
  const controller = new UserController({ Model })
  const router = Router()

  router.get('/', Token.middleware, controller.get as unknown as RequestHandler<any, any, Record<string, any>>)

  router.post('/register/:provider', Token.middleware, controller.register as unknown as RequestHandler<any, any, Record<string, any>>)

  return router
}

export { createRouter }

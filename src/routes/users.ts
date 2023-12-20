import { Router } from 'express'
import { UserController } from '@src/controllers'
import { Token } from '@lib/utils'
import type { DatabaseModels } from '@lib/interfaces'

export type ModelsRequired = Pick<DatabaseModels, 'item' | 'user' >

const createRouter = ({ Model }: { Model: ModelsRequired }) => {
  const controller = new UserController({ Model })
  const router = Router()

  router.get('/', Token.middleware, controller.get as any)

  router.post('/register/:provider', Token.middleware, controller.register as any)

  return router
}

export { createRouter }

import { Router } from 'express'
import { CategoryController } from '@src/controllers'
import { Token } from '@lib/utils'
import type { DatabaseModels } from '@lib/interfaces'

export type ModelsRequired = Pick<DatabaseModels, 'category' >

const createRouter = ({ Model }: { Model: ModelsRequired }) => {
  const controller = new CategoryController({ Model })

  const router = Router()

  router.get('/', Token.middleware, controller.getAll as any)

  router.patch('/:id', Token.middleware, controller.patch as any)

  router.delete('/:id', Token.middleware, controller.delete as any)

  return router
}

export { createRouter }

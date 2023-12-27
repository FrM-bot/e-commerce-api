import { Router } from 'express'
import { AuthController } from '../controllers/index.js'
import type { DatabaseModels } from '../lib/interfaces/index.js'

export type ModelsRequired = Pick<DatabaseModels, 'user' | 'payment' | 'stock' | 'cart'>

const createRouter = ({ Model }: { Model: ModelsRequired }) => {
  const controller = new AuthController({ Model })

  const router = Router()

  router.patch('/login', controller.authUser)

  return router
}

export { createRouter }

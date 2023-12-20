import { Router } from 'express'
import { AuthController } from '@src/controllers'
import { DatabaseModels } from '@lib/interfaces'

export type ModelsRequired = Pick<DatabaseModels, 'user' >

const createRouter = ({ Model }: { Model: ModelsRequired }) => {
  const controller = new AuthController({ Model })

  const router = Router()

  router.patch('/login', controller.authUser)

  return router
}

export { createRouter }

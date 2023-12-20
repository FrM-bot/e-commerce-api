import { Router } from 'express'
import { AddressController } from '@src/controllers'
import type { DatabaseModels } from '@lib/interfaces'
import { Token } from '@lib/utils'
// import type { Model } from '@lib/interfaces'

export type ModelsRequired = Pick<DatabaseModels, 'user' | 'address' >

const createRouter = ({ Model }: { Model: ModelsRequired }) => {
  const controller = new AddressController({ Model })

  const router = Router()

  router.post('/', Token.middleware, controller.add as any)

  return router
}

export { createRouter }

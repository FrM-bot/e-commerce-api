/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Router } from 'express'
import { AddressController } from '../controllers/index.js'
import type { DatabaseModels } from '../lib/interfaces/index.js'
import { Token } from '../lib/utils/index.js'
// import type { Model } from '@lib/interfaces'

export type ModelsRequired = Pick<DatabaseModels, 'user' | 'address' >

const createRouter = ({ Model }: { Model: ModelsRequired }) => {
  const controller = new AddressController({ Model })

  const router = Router()

  router.post('/', Token.middleware, controller.add as any)

  return router
}

export { createRouter }

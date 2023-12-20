import { Router } from 'express'
import { Token } from '../lib/utils/index.js'
import { PaymentController } from '../controllers/index.js'
import type { DatabaseModels } from '../lib/interfaces/index.js'

export type ModelsRequired = Pick<DatabaseModels, 'stock' | 'user' >

const createRouter = ({ Model }: { Model: ModelsRequired }) => {
  const controller = new PaymentController({ Model })

  const router = Router()

  router.get('/:method/:id', controller.pay)

  router.patch('/:method', Token.middleware, controller.payItems as any)

  return router
}

export { createRouter }

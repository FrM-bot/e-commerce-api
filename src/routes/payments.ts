import { Router } from 'express'

import { payItemController, payItemsController } from '../controllers/payments.controller.js'

const router = Router()

router.post('/:id', payItemController)

router.post('/', payItemsController)

export { router }

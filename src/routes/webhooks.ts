import { Router } from 'express'
import { webhooksNotificationsController } from '../controllers/webhooks.controller.js'

const router = Router()

// http://localhost:3002/item
router.post('/', webhooksNotificationsController)

// router.get('/:id', getItemController)

// router.get('/:name', getItemByNameController)

// router.delete('/:id', deleteItemController)

// router.put('/:id', updateItemController)

export { router }

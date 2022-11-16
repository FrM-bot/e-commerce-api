import { Router } from 'express'
import { postItemController, getItemController, updateItemController } from '../controllers/item.controller.js'

const router = Router()

// http://localhost:3002/item
router.post('/', postItemController)

router.get('/:id', getItemController)

// router.get('/:name', getItemByNameController)

// router.delete('/:id', deleteItemController)

router.put('/:id', updateItemController)

export { router }

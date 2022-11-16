import { Router } from 'express'
import { getItemsByIdController, getItemsController } from '../controllers/items.controller.js'
// import { upload } from '../middleware/multer.js'

const router = Router()

// http://localhost:3002/items
router.post('/', getItemsByIdController)

router.get('/', getItemsController)

export { router }

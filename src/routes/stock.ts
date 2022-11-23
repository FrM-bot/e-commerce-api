import { Router } from 'express'
import { addStockController, updateStockController } from '../controllers/stock.controller.js'
import { upload } from '../middleware/multer.js'

const router = Router()

// http://localhost:3002/stock
router.post('/', upload.array('images'), addStockController)

router.put('/:id', upload.array('images'), updateStockController)

// router.get('/:id', getItemController)

// router.get('/:name', getItemByNameController)

// router.delete('/:id', deleteItemController)

// router.put('/:id', updateItemController)

export { router }

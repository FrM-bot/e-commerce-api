import { Router } from 'express'
import { StockController } from '../controllers/index.js'
import { upload } from '../middlewares/index.js'
import type { DatabaseModels } from '../lib/interfaces/index.js'

export type ModelsRequired = Pick<DatabaseModels, 'stock' >

const createRouter = ({ Model }: { Model: ModelsRequired }) => {
  const router = Router()

  const controller = new StockController({ Model })

  router.patch('/images/remove/:id', controller.removeImages)

  router.patch('/images/add/:id', upload.array('images'), controller.addImages)

  router.get('/:id', controller.getBy)

  router.put('/:id', upload.array('images'), controller.post)

  router.patch('/:id', controller.edit)

  router.delete('/:id', controller.delete)

  return router
}

export { createRouter }

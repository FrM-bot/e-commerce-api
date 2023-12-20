import { Router } from 'express'
import { ItemController } from '../controllers/index.js'
import { type DatabaseModels } from '../lib/interfaces/index.js'

export type ModelsRequired = Pick<DatabaseModels, 'item' >

const createRouter = ({ Model }: { Model: ModelsRequired }) => {
  const controller = new ItemController({ Model })

  const router = Router()

  router.get('/:id', controller.getBy)

  router.patch('/:id', controller.edit)

  router.get('/', controller.getAll)

  router.post('/', controller.post)

  return router
}

export { createRouter }

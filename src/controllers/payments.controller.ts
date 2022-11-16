import type { Request, Response } from 'express'
import { payItemService, payItemsService } from '../services/payments.service.js'
import { handlerHttpError } from '../utils/error.handler.js'

const payItemController = async ({ body, params }: Request, res: Response): Promise<void> => {
  try {
    const { quantity } = body
    const { id } = params
    const data = await payItemService(id, quantity)
    res.send({ data })
  } catch (error) {
    handlerHttpError({ res, error: 'ERROR_PAY_ITEM', errorRaw: error })
  }
}

const payItemsController = async ({ body }: Request, res: Response): Promise<void> => {
  try {
    const data = await payItemsService(body)
    res.send({ data })
  } catch (error) {
    handlerHttpError({ res, error: 'ERROR_PAY_ITEMS', errorRaw: error })
  }
}

export { payItemController, payItemsController }

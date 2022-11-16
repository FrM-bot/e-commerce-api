import type { Request, Response } from 'express'
import { getItemsByIdService, getItemsService } from '../services/items.service.js'
import { handlerHttpError } from '../utils/error.handler.js'

export const getItemsByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const itemsIds = req.body
    const data = await getItemsByIdService(itemsIds)
    res.send({ data })
  } catch (error) {
    handlerHttpError({ res, error: 'ERROR_GET_ITEM', errorRaw: error })
  }
}
export const getItemsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await getItemsService()
    res.send({ data })
  } catch (error) {
    handlerHttpError({ res, error: 'ERROR_GET_ITEM', errorRaw: error })
  }
}

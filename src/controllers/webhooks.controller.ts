import type { Request, Response } from 'express'
import {
  webhooksNotificationsService
} from '../services/webhooks.service.js'
import { handlerHttpError } from '../utils/error.handler.js'

// export const addStockController = async ({ params }: Request, res: Response): Promise<void> => {
//   try {
//     const { id } = params
//     const data = await addStockService(id)
//     res.send({ data })
//   } catch (error) {
//     handlerHttpError({ res, error: 'ERROR_GET_ITEM', errorRaw: error })
//   }
// }

export const webhooksNotificationsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await webhooksNotificationsService(req)
    res.send({ data })
  } catch (error) {
    handlerHttpError({ res, error: 'ERROR_POST_ITEM', errorRaw: error })
  }
}

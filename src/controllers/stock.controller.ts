import type { Request, Response } from 'express'
import {
  addStockService,
  updateStockService
} from '../services/stock.service.js'
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

export const addStockController = async (
  { body, files, file }: Request,
  res: Response
): Promise<void> => {
  try {
    console.log({ body, files }, typeof body?.images, file)
    const data = await addStockService({ ...body, files })
    res.send({ data })
  } catch (error) {
    handlerHttpError({ res, error: 'ERROR_POST_ITEM', errorRaw: error })
  }
}

export const updateStockController = async (
  { body, params }: Request,
  res: Response
): Promise<void> => {
  try {
    console.log(body)
    const data = await updateStockService(body, params?.id)
    res.send({ data })
  } catch (error) {
    handlerHttpError({ res, error: 'ERROR_POST_ITEM', errorRaw: error })
  }
}

import type { Request, Response } from 'express'
import { handlerHttpError } from '../utils/error.handler.js'
import { userProfileService, userAddCartService, userRemoveCartService } from '../services/user.service.js'

export const userProfileController = async (
  req: Request & { userId?: string | undefined },
  res: Response
) => {
  try {
    if (!req?.userId) {
      return handlerHttpError({ res, error: 'ERROR_PAY_ITEMS' })
    }
    const data = await userProfileService(req.userId)
    res.send({ data })
  } catch (error) {
    handlerHttpError({ res, error: 'ERROR_PAY_ITEMS', errorRaw: error })
  }
}
export const userAddCartProductController = async (
  req: Request & { userId?: string | undefined },
  res: Response
) => {
  try {
    if (!req?.userId) {
      return handlerHttpError({ res, error: 'ERROR_PAY_ITEMS' })
    }
    const idProduct = req.params.id
    const data = await userAddCartService(req.userId, idProduct)
    res.send({ data })
  } catch (error) {
    handlerHttpError({ res, error: 'ERROR_Add_CART_ITEM', errorRaw: error })
  }
}

export const userRemoveCartProductController = async (
  req: Request & { userId?: string | undefined },
  res: Response
) => {
  try {
    if (!req?.userId) {
      return handlerHttpError({ res, error: 'ERROR_PAY_ITEMS' })
    }
    const idProductToRemove = req.params.id
    const data = await userRemoveCartService(req.userId, idProductToRemove)
    res.send({ data })
  } catch (error) {
    handlerHttpError({ res, error: 'ERROR_Add_CART_ITEM', errorRaw: error })
  }
}

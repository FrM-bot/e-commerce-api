import type { Request, Response } from 'express'
import { handlerHttpError } from '../utils/error.handler.js'
import { loginUserService, registerUserService } from '../services/auth.service.js'

export const registerController = async (req: Request, res: Response) => {
  try {
    console.log(req.headers)
    const data = await registerUserService(req.body)
    res.send({ data })
  } catch (error) {
    handlerHttpError({ res, error: 'ERROR_GET_ITEM', errorRaw: error })
  }
}

export const loginController = async (req: Request, res: Response) => {
  try {
    console.log(req.headers)
    const data = await loginUserService(req.body)
    res.send({ data })
  } catch (error) {
    handlerHttpError({ res, error: 'ERROR_GET_ITEM', errorRaw: error })
  }
}

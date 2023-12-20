/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { type Request, type Response } from 'express'
import { handlerHttpError } from '../lib/utils/index.js'
import { ModelsRequired } from '../routes/auth.js'

export class AuthController {
  #Model
  constructor ({ Model }: { Model: ModelsRequired }) {
    this.#Model = Model
  }

  authUser = async ({ body }: Request, res: Response): Promise<void> => {
    const { email, password } = body
    console.log(password)
    if (!email) return handlerHttpError({ res, error: 'ERROR_LOGIN' })
    try {
      const user = await this.#Model.user.getBy({ email })

      if (!user) {
        return handlerHttpError({ res, error: 'ERROR_GET_STOCK', errorRaw: 'User does\'t exist' })
      }

      res.send({
        data: {
          token: user.email
        }
      })
    } catch (error) {
      handlerHttpError({ res, error: 'ERROR_AUTH_USER', errorRaw: error })
    }
  }
}

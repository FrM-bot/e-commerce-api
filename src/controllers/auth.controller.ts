/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { type Request, type Response } from 'express'
import { handlerHttpError } from '../lib/utils/index.js'
import { type ModelsRequired } from '../routes/auth.js'

export class AuthController {
  readonly #Model
  constructor ({ Model }: { Model: ModelsRequired }) {
    this.#Model = Model
  }

  authUser = async ({ body }: Request, res: Response): Promise<void> => {
    const { email, password } = body
    console.log(password)
    if (!email) { handlerHttpError({ res, error: 'ERROR_LOGIN' }); return }
    try {
      const user = await this.#Model.user.getBy({ email })

      if (!user) {
        handlerHttpError({ res, error: 'ERROR_GET_STOCK', errorRaw: 'User does\'t exist' }); return
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

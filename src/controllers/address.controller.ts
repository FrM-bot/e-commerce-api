/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { type Request, type Response } from 'express'
import { handlerHttpError } from '../lib/utils/index.js'
import type { ModelsRequired } from '../routes/address.js'
import { validateAddress } from '../lib/schemas/index.js'
import type { PayloadToken } from '../lib/interfaces/index.js'

export class AddressController {
  #Model
  constructor ({ Model }: { Model: ModelsRequired }) {
    this.#Model = Model
  }

  add = async ({ body, payload }: Request & PayloadToken, res: Response): Promise<void | Response<any, Record<string, any>>> => {
    if (!payload) return handlerHttpError({ res, error: 'TOKEN_ERROR' })

    const result = await validateAddress(body.data)

    if (!result.success) return handlerHttpError({ res, error: 'ERROR_VALIDATE_ADDRESS', errorRaw: result.error })
    const user = await this.#Model.user.getBy({ email: payload.email })
    if (!user?.id) return handlerHttpError({ res, error: 'USER_NOT_FOUND' })

    try {
      const address = await this.#Model.address.add({ data: { ...result.data, userId: user.id } })

      res.send({
        data: {
          ...address
        }
      })
    } catch (error) {
      handlerHttpError({ res, error: 'ERROR_AUTH_USER', errorRaw: error })
    }
  }
}

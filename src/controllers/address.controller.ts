/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { type Request, type Response } from 'express'
import { handlerHttpError } from '../lib/utils/index.js'
import type { ModelsRequired } from '../routes/address.js'
import { validateAddress } from '../lib/schemas/index.js'
import type { PayloadToken } from '../lib/interfaces/index.js'

export class AddressController {
  readonly #Model
  constructor ({ Model }: { Model: ModelsRequired }) {
    this.#Model = Model
  }

  add = async ({ body, payload }: Request & PayloadToken, res: Response): Promise<void | Response<void, Record<string, any>>> => {
    if (!payload) { handlerHttpError({ res, error: 'TOKEN_ERROR' }); return }

    const result = await validateAddress(body.data)

    if (!result.success) {
      handlerHttpError({ res, error: 'ERROR_VALIDATE_ADDRESS', errorRaw: result }); return
    }
    const user = await this.#Model.user.getBy({ email: payload.email })
    if (!user?.id) { handlerHttpError({ res, error: 'USER_NOT_FOUND' }); return }

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

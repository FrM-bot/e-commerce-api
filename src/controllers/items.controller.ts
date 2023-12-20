/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { type Request, type Response } from 'express'
import { handlerHttpError } from '../lib/utils/index.js'
import { validateItem, validatePartialItem } from '../lib/schemas/index.js'
import { type ModelsRequired } from '../routes/items.js'

export class ItemController {
  readonly #Model
  constructor ({ Model }: { Model: ModelsRequired }) {
    this.#Model = Model
  }

  getBy = async ({ params }: Request, res: Response): Promise<void> => {
    try {
      const { id } = params
      const data = await this.#Model.item.getBy({ where: { id } })

      res.send({
        data
      })
    } catch (error) {
      handlerHttpError({ res, error: 'ERROR_GET_ITEM', errorRaw: error })
    }
  }

  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.#Model.item.getAll()
      console.log(data)
      res.send({
        data
      })
    } catch (error) {
      handlerHttpError({ res, error: 'ERROR_GET_ITEMS', errorRaw: error })
    }
  }

  post = async ({ body }: Request, res: Response): Promise<void | Response<any, Record<string, any>>> => {
    try {
      const result = await validateItem(body)
      if (!result.success) {
        handlerHttpError({ res, error: 'ERROR_VALIDATE_ADDRESS', errorRaw: result }); return
      }
      const data = await this.#Model.item.create(result.data)
      res.json({
        data
      })
    } catch (error) {
      handlerHttpError({ res, error: 'ERROR_POST_ITEM', errorRaw: error })
    }
  }

  edit = async ({ params, body }: Request, res: Response): Promise<void | Response<any, Record<string, any>>> => {
    const { id } = params
    try {
      const result = await validatePartialItem(body)
      if (!result.success) {
        handlerHttpError({ res, error: 'ERROR_VALIDATE_ADDRESS', errorRaw: result }); return
      }

      const data = await this.#Model.item.edit({ id, input: result.data })

      res.json({
        data
      })
    } catch (error) {
      handlerHttpError({ res, error: 'ERROR_EDIT_ITEM', errorRaw: error })
    }
  }
}

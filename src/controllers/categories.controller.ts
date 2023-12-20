import { type Request, type Response } from 'express'
import { validateCategoryItem } from '../lib/schemas/index.js'
import type { ModelsRequired } from '../routes/categories.js'

export class CategoryController {
  readonly #Model
  constructor ({ Model }: { Model: ModelsRequired }) {
    this.#Model = Model
  }

  async getAll (_req: Request, res: Response): Promise<any> {
    const data = await this.#Model.category.getAll()
    res.send({
      data
    })
  }

  async patch ({ body, params }: Request, res: Response): Promise<Response<void, Record<string, any>> | undefined> {
    const id = params.id
    const result = await validateCategoryItem(body)

    if (!result.success) {
      return res.send({
        error: result.error
      })
    }

    const data = await this.#Model.category.edit({
      id,
      input: {
        name: result.data.category
      }
    })

    res.send({
      data
    })
  }

  async delete ({ params }: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined> {
    const id = params.id

    if (!id) {
      return res.send({
        error: 'ID is required'
      })
    }

    const data = await this.#Model.category.delete({
      id
    })

    res.send({
      data
    })
  }
}

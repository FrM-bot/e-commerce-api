import { db } from '../lib/config/index.js'
import type { Database } from '../lib/interfaces/index.js'

class CategoryModel {
  #db: Database
  constructor ({ db }: { db: Database }) {
    this.#db = db
  }

  getAll = async () => {
    const categories = await this.#db.category.findMany()
    return categories
  }

  edit = async ({
    id,
    input
  }: {
    id: string
    input: {
      name: string
    }
  }) => {
    const category = await this.#db.category.update({
      where: {
        id
      },
      data: input
    })
    return category
  }

  delete = async ({ id }: { id: string }) => {
    const category = await this.#db.category.delete({
      where: {
        id
      }
    })
    return category
  }
}

export const Category = new CategoryModel({ db })

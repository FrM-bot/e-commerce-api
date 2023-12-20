import { db } from '../lib/config/index.js'
import type { Database, NewItem } from '../lib/interfaces/index.js'

const defaultWhere = {
  Stock: {
    every: {
      quantity: {
        gt: 0
      }
    }
  }
}

interface Props {
  where?: any
}

class ItemModel {
  readonly #db

  constructor ({
    db
  }: {
    db: Database
  }) {
    this.#db = db
  }

  async getAll ({ where = defaultWhere }: Props = {}) {
    const items = await this.#db.product.findMany({
      where,
      include: {
        Stock: true,
        Category: true
      }
    })

    return items.map(
      ({ id, name, description, Stock, Category }) => ({
        id,
        name,
        description,
        category: Category,
        stocks: Stock?.map(({ images, id, price, color, quantity, size }) => ({ images, id, price, color, quantity, size }))
      })
    )
  }

  async getBy ({ where }: { where: { id: string } }) {
    const item = await this.#db.product.findUnique({
      where,
      include: {
        Category: true,
        Stock: true
      }
    })

    return {
      id: item?.id,
      name: item?.name,
      description: item?.description,
      category: item?.Category,
      stocks: item?.Stock?.map(({ images, id, price, color, size, quantity }) => ({
        images,
        id,
        price,
        color,
        size,
        quantity
      }))
    }
  }

  async create ({ name, description, category }: NewItem) {
    const newProduct = await this.#db.product.create({
      data: {
        name,
        description,
        Category: {
          connectOrCreate: {
            create: {
              name: category.toLowerCase()
            },
            where: {
              name: category.toLowerCase()
            }
          }
        }
      }
    })
    return newProduct
  }

  async edit ({
    id,
    input
  }: {
    id: string
    input: Partial<{ name: string, description: string }>
  }) {
    const item = await this.#db.product.update({
      where: {
        id
      },
      data: input,
      include: {
        Stock: true
      }
    })
    return {
      id: item?.id,
      name: item?.name,
      description: item?.description,
      stocks: item?.Stock.map(({ images, id, price, color, size, quantity }) => ({
        images,
        id,
        price,
        color,
        size,
        quantity
      }))
    }
  }
}

export const Item = new ItemModel({ db })

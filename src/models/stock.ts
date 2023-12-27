import { db } from '../lib/config/index.js'
import type { Database } from '../lib/interfaces/database.js'

class StockModel {
  readonly #db: Database
  constructor ({ db }: { db: Database }) {
    this.#db = db
  }

  getMany = async ({
    where,
    include
  }: {
    where?: object
    include?: any
  }) => {
    const items = await this.#db.stock.findMany({
      where,
      include
    })
    return items
  }

  getBy = async ({ id }: { id: string }) => {
    const stock = await this.#db.stock.findUnique({
      where: {
        id
      },
      include: {
        Product: {
          include: {
            Category: true
          }
        }
      }
    })

    return {
      id: stock?.id,
      price: stock?.price,
      color: stock?.color,
      quantity: stock?.quantity,
      images: stock?.images,
      product: {
        id: stock?.Product.id,
        name: stock?.Product.name,
        description: stock?.Product.description,
        category: stock?.Product.Category
      }
    }
  }

  add = async ({
    id,
    input
  }: {
    id: string
    input: {
      price: number
      color: string
      images: string[]
      size: string
      quantity: number
    }
  }) => {
    const { price, color, images, size, quantity } = input
    const newProduct = await this.#db.product.update({
      where: {
        id
      },
      data: {
        Stock: {
          create: {
            price,
            color,
            images,
            size,
            quantity
          }
        }
      },
      include: {
        Stock: true,
        Category: true
      }
    })
    return {
      id: newProduct.id,
      name: newProduct.name,
      description: newProduct.description,
      stocks: newProduct.Stock.map(
        ({ color, images, price, size, quantity, id }) => ({
          color,
          images,
          price,
          size,
          quantity,
          id
        })
      )
    }
  }

  update = async ({
    id,
    input
  }: {
    id: string
    input: Partial<{
      price: number
      color: string
      size: string
      stock: number
      images: string[]
    }>
  }) => {
    const stock = await this.#db.stock.update({
      where: {
        id
      },
      data: input,
      include: {
        Product: true
      }
    })
    return {
      id: stock.id,
      price: stock.price,
      color: stock.color,
      size: stock.size,
      quantity: stock.quantity,
      images: stock.images,
      product: {
        id: stock.Product.id,
        name: stock.Product.name,
        description: stock.Product.description
      }
    }
  }

  delete = async ({ id }: { id: string }) => {
    try {
      await this.#db.stock.delete({
        where: {
          id
        }
      })
      return {
        status: true
      }
    } catch (error) {
      console.error(error)
      return {
        status: false
      }
    }
  }

  updateQuantity = async ({
    where,
    quantity
  }: { where: { id: string }, quantity: { increment: number } | { decrement: number } }) => {
    const stock = await this.#db.stock.update({
      where,
      data: {
        quantity
      }
    })

    return stock
  }
}
export const Stock = new StockModel({ db })

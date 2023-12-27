import { db } from '../lib/config/index.js'
import type { Database } from '../lib/interfaces/index.js'

class CartModel {
  readonly #db: Database
  constructor ({ db }: { db: Database }) {
    this.#db = db
  }

  add = async ({
    data
  }: {
    data: {
      quantity: number
      stockId: string
      userId: string
    }
  }) => {
    const cart = await this.#db.cart.create({
      data
    })

    return {
      ...cart
    }
  }

  remove = async ({
    id
  }: {
    id: string
  }) => {
    const cart = await this.#db.cart.delete({
      where: {
        id
      }
    })

    return {
      ...cart
    }
  }

  update = async ({
    where,
    data
  }: {
    where: { id: string }
    data: { quantity: number }
  }) => {
    const cart = await this.#db.cart.update({
      where,
      data: {
        quantity: data.quantity
      }
    })

    return {
      ...cart
    }
  }
}
export const Cart = new CartModel({ db })

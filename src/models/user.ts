import { db } from '../lib/config/index.js'
import type { Database } from '../lib/interfaces/index.js'
import type { PROVIDER } from '../lib/const/index.js'

class UserModel {
  readonly #db: Database
  constructor ({ db }: { db: Database }) {
    this.#db = db
  }

  getBy = async (where: { email: string } | { id: string }) => {
    const user = await this.#db.user.findUnique({
      where,
      include: {
        Payment: {
          select: {
            quantity: true,
            amount: true,
            id: true,
            stockId: true
          }
        },
        Cart: {
          include: {
            Stock: {
              include: {
                Product: {
                  include: {
                    Category: true
                  }
                }
              }
            }
          }
        },
        Address: true
      }
    })

    return {
      id: user?.id,
      email: user?.email,
      name: user?.name,
      surname: user?.surname,
      favoritesIds: user?.favoritesIds,
      cart: user?.Cart.map(({ Stock, quantity, stockId, id }) => ({
        id,
        quantity,
        images: Stock.images,
        productId: Stock.Product.id,
        category: Stock.Product.Category.name,
        stockAvailable: Stock.quantity,
        size: Stock.size,
        color: Stock.color,
        price: Stock.price,
        name: Stock.Product.name,
        stockId
      })),
      addresses: user?.Address.map(({ id, addressType, city, code, description, floor, mainStreet, phone, state, streetNumber, streetOne, streetTwo }) => ({
        id,
        addressType,
        city,
        code,
        description,
        floor,
        mainStreet,
        phone,
        state,
        streetNumber,
        streetOne,
        streetTwo
      })),
      payments: user?.Payment.map(({ amount, id, quantity, stockId }) => ({ amount, id, quantity, stockId }))
    }
  }

  create = async (data: { email: string, password?: string, name?: string, surname?: string, provider: PROVIDER }) => {
    const user = await this.#db.user.create({
      data,
      select: {
        id: true,
        email: true
      }
    })

    return {
      id: user?.id,
      email: user?.email
    }
  }

  exist = async (where: { email: string } | { id: string }) => {
    const user = await this.#db.user.findUnique({
      where
    })

    return {
      exist: user != null
    }
  }

  update = async ({ where, data }: { where: { email: string }, data: { name?: string, surname?: string, favoritesIds?: string[] } }) => {
    const user = await this.#db.user.update({
      where,
      data,
      select: {
        name: true,
        surname: true
      }
    })

    return {
      name: user?.name,
      surname: user?.surname
    }
  }
}
export const User = new UserModel({ db })

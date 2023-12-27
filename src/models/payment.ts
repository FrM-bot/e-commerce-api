import { db } from '../lib/config/index.js'
import type { Database, NewPayment } from '../lib/interfaces/index.js'

class PaymentModel {
  readonly #db: Database
  constructor ({ db }: { db: Database }) {
    this.#db = db
  }

  findOne = async ({
    where
  }: {
    where: { id: string }
  }) => {
    const payment = await this.#db.payment.findUnique({
      where,
      include: {
        Stock: {
          select: {
            images: true,
            productId: true,
            Product: true
          },
          include: {
            Product: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })
    return {
      id: payment?.id,
      amount: payment?.amount,
      userId: payment?.userId,
      quantity: payment?.quantity,
      product: {
        id: payment?.Stock.productId,
        images: payment?.Stock?.images,
        name: payment?.Stock?.Product?.name
      }
    }
  }

  register = async ({ data }: { data: NewPayment }) => {
    const payment = await this.#db.payment.create({
      data
    })

    return payment
  }
}
export const Payment = new PaymentModel({ db })

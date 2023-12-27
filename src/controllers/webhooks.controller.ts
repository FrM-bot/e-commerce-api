import type { Request, Response } from 'express'
import type { ModelsRequired } from '../routes/webhooks.js'
import { mercadopagoEndpoints, handlerHttpError } from '../lib/utils/index.js'
import { mercadopago } from '../lib/env/index.js'
import axios from 'axios'

export class WebhooksController {
  readonly #Model
  constructor ({ Model }: { Model: ModelsRequired }) {
    this.#Model = Model
  }

  post = async ({ body }: Request, res: Response) => {
    const { data, type } = body

    if (type === 'test') {
      return res.send({
        data: {
          success: true
        }
      })
    }

    if (!data?.id) {
      handlerHttpError({
        res,
        error: 'NO_PAYMENT_DATA',
        errorRaw: 'No payment data'
      })
      return
    }

    let transactionData

    try {
      const options = {
        headers: {
          Authorization: `Bearer ${mercadopago.accessToken ?? ''}`
        }
      }
      const response = await axios.get(
        mercadopagoEndpoints.getPayment(data?.id as string),
        options
      )

      transactionData = await response.data
    } catch (errorRaw) {
      handlerHttpError({
        res,
        error: 'PAYMENT_ERROR',
        errorRaw
      }); return
    }

    const {
      transaction_details: transactionDetails,
      additional_info: additionalInfo,
      metadata,
      status
    } = transactionData

    console.log({
      transactionData,
      metadata,
      transactionDetails,
      additionalInfo,
      status
    })

    let user

    try {
      user = await this.#Model.user.getBy({ id: transactionData?.metadata?.userId })
      if (!user?.cart || !user.id) {
        handlerHttpError({
          res,
          error: 'USER_NOT_FOUND',
          errorRaw: 'User doesn\'t exist'
        }); return
      }

      for (const item of user.cart) {
        await this.#Model.stock.updateQuantity({ where: { id: item.stockId }, quantity: { decrement: item.quantity } })
        await this.#Model.cart.remove({ id: item.id })
        await this.#Model.payment.register({ data: { amount: item.price, receiptId: transactionData.id, userId: user.id, quantity: item.quantity, stockId: item.stockId } })
      }
    } catch (errorRaw) {
      handlerHttpError({
        res,
        error: 'PAYMENT_ERROR',
        errorRaw
      }); return
    }

    res.send({
      data: {
        status
      }
    })
  }
}

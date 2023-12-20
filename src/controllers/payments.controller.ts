/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { Request, Response } from 'express'
import { handlerHttpError } from '@lib/utils'
import { Payment } from '@services/payments.service.js'
import type { ModelsRequired } from '@routes/payments.js'
import type { PayloadToken } from '@lib/interfaces'
import { METHODS } from '@lib/const'

export class PaymentController {
  Model
  constructor ({ Model }: { Model: ModelsRequired }) {
    this.Model = Model
  }

  pay = async ({ params, query }: Request, res: Response): Promise<void | Response<any, Record<string, any>>> => {
    const { id, method } = params
    const paymentMethod = method.toLocaleLowerCase()
    const quantity = Number(query.quantity) ?? 1
    console.log(params, quantity)
    try {
      const data = await this.Model.stock.getBy({ id })

      if (!data.product.name || !data.images) {
        return res.send({
          error: 'Product stock not found'
        })
      }

      let url
      const unitAmount = Number(data?.price)
      if (METHODS.STRIPE === paymentMethod) {
        const session = await Payment.stripe.pay({ name: data.product.name, quantity, unitAmount, images: data.images })
        url = session.url
      }

      if (METHODS.MERCADOPAGO === paymentMethod) {
        const session = await Payment.mercadopago.pay({
          id: data.id ?? '',
          title: data.product.name,
          description: data.product.description ?? '',
          pictureUrl: data.images.at(0) ?? '',
          quantity,
          transactionAmount: data.price ?? 2,
          unitPrice: data.price ?? 0
        })
        url = session.init_point
      }
      res.send({
        data: {
          url
        }
      })
    } catch (error) {
      handlerHttpError({ res, error: 'ERROR_CREATE_PAYMENT', errorRaw: error })
    }
  }

  payItems = async ({ params, body, payload }: Request & PayloadToken, res: Response) => {
    const { method } = params
    const { addressId } = body as { addressId: string }

    const user = await this.Model.user.getBy({ email: payload?.email })

    if (!user) {
      return handlerHttpError({
        res,
        error: 'ERROR_GET_USER',
        errorRaw: "User doesn't exist"
      })
    }

    if (!user?.addresses) {
      return handlerHttpError({
        res,
        error: 'ERROR_GET_USER',
        errorRaw: "User address doesn't exist"
      })
    }

    if (!user?.cart) {
      return handlerHttpError({
        res,
        error: 'ERROR_GET_USER',
        errorRaw: "User address doesn't exist"
      })
    }

    const selectedAddress = user?.addresses.find(address => address.id === addressId)

    const cartItems = user?.cart.map(({ id, quantity, images, name, price, color, size }) => {
      return {
        id,
        images,
        name: `${name} ${size} ${color}`,
        quantity,
        price
      }
    })

    try {
      let url: string | undefined

      if (METHODS.MERCADOPAGO === method) {
        const items = cartItems.map(({ id, name: title, images, price, quantity }) => ({ id, title, description: title, picture_url: images.at(0) ?? '', quantity, unit_price: price }))

        const mercadopago = await Payment.mercadopago.payMany({ items, metadata: selectedAddress })

        url = mercadopago.init_point
      }

      if (METHODS.STRIPE === method) {
        const items = cartItems.map(({ quantity, id, name, price, images }) => ({ id, name, quantity, images, unitAmount: price }))

        const stripe = await Payment.stripe.payMany({ items, metadata: selectedAddress })

        url = stripe.url ?? ''
      }

      if (!url) {
        return handlerHttpError({ res, error: 'ERROR_PAY_PRODUCTS', status: 400 })
      }

      res.send({
        data: {
          url
        }
      })
    } catch (error) {
      handlerHttpError({ res, error: 'ERROR_PAY_PRODUCTS', errorRaw: error })
    }
  }
}

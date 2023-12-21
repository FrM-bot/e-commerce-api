import type { Request, Response } from 'express'
import type { ModelsRequired } from '../routes/auth.js'
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

    console.log({ body })

    if (type === 'test') {
      res.send({
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

      const transactionData = await response.data

      const {
        transaction_details: transactionDetails,
        additional_info: additionalInfo,
        metadata,
        status
      } = transactionData

      console.log(
        response,
        transactionData,
        metadata,
        transactionDetails,
        additionalInfo
      )

      res.send({
        data: {
          status
        }
      })
    } catch (error) {
      handlerHttpError({
        res,
        error: 'PAYMENT_ERROR',
        errorRaw: 'Error to pay product'
      })
    }
  }
}

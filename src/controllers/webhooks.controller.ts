import type { Request, Response } from 'express'
import { ModelsRequired } from '@routes/auth.js'
import { mercadopagoEndpoints, handlerHttpError } from '../lib/utils/index.js'
import { mercadopago } from '../lib/config/index.js'
import axios from 'axios'

export class WebhooksController {
  #Model
  constructor ({ Model }: { Model: ModelsRequired }) {
    this.#Model = Model
  }

  post = async ({ body }: Request, res: Response): Promise<void> => {
    const { data } = body
    if (!data?.id) {
      return handlerHttpError({
        res,
        error: 'ERROR_AUTH_USER',
        errorRaw: 'No payment data'
      })
    }
    const options = {
      headers: {
        Authorization: `Bearer ${mercadopago.accessToken ?? ''}`
      }
    }
    const response = await axios.get(
      mercadopagoEndpoints.getPayment(data.id),
      options
    )

    const transactionData = await response.data

    const { transaction_details: transactionDetails, additional_info: additionalInfo, metadata, status } = transactionData

    console.log(response, transactionData, metadata, transactionDetails, additionalInfo)

    res.send({
      data: {
        status
      }
    })
  }
}

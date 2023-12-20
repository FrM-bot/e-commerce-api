import axios from 'axios'
import { stripeApiKey, mercadopago, clientUrl } from '../lib/config/index.js'
import Stripe from 'stripe'

const stripe = new Stripe(stripeApiKey ?? '', {
  apiVersion: '2023-10-16'
})

class StripeService {
  // example: 20.99 = 20.99 * 100 = 2099
  readonly #base
  readonly #currency
  readonly #service
  constructor ({ service }: { service: typeof stripe }) {
    this.#base = 100
    this.#currency = 'usd'
    this.#service = service
  }

  async pay ({
    name,
    quantity,
    unitAmount,
    images
  }: {
    name: string
    quantity: number
    unitAmount: number
    images: string[]
  }) {
    const session = await this.#service.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: this.#currency,
            product_data: {
              name,
              images
            },
            unit_amount: unitAmount * this.#base
          },
          quantity
        }
      ],
      mode: 'payment',
      success_url: `${clientUrl}/success`,
      cancel_url: `${clientUrl}/cancel`
    })
    return session
  }

  async payMany ({
    items,
    metadata
  }: {
    items: Array<{
      name: string
      quantity: number
      unitAmount: number
      images: string[]
    }>
    metadata: any
  }) {
    const session = await this.#service.checkout.sessions.create({
      line_items: items.map(({ images, name, quantity, unitAmount }) => ({
        price_data: {
          currency: this.#currency,
          product_data: {
            name,
            images
          },
          unit_amount: unitAmount * this.#base
        },
        quantity
      })),
      mode: 'payment',
      success_url: `${clientUrl}/success`,
      cancel_url: `${clientUrl}/cancel`,
      metadata
    })
    return session
  }
}

// const StripeService = {
// }

interface MercadoPagoProduct {
  id: string
  title: string
  description: string
  pictureUrl: string
  quantity: number
  unitPrice: number
  transactionAmount: number
  email?: string
  metadata?: object
  applicationFee?: number
}

class MercadoPago {
  readonly #apiKey
  constructor ({ apiKey }: { apiKey: string }) {
    this.#apiKey = apiKey
  }

  pay = async ({
    id,
    title,
    description,
    pictureUrl,
    quantity,
    unitPrice,
    transactionAmount,
    email,
    metadata,
    applicationFee
  }: MercadoPagoProduct) => {
    const body = {
      items: [
        {
          id,
          title,
          description,
          picture_url: pictureUrl,
          quantity,
          unit_price: unitPrice,
          currency_id: 'USD'
        }
      ],
      notification_url: '',
      back_urls: {
        success: `${clientUrl}/cause/${id}`,
        failure: `${clientUrl}/cause/${id}`,
        pending: `${clientUrl}/cause/${id}`
      },
      payment_methods: {
        installments: 3
      },
      transaction_amount: transactionAmount,
      description,
      payer: {
        phone: {
          area_code: '',
          number: 0
        },
        address: {
          zip_code: '',
          street_name: '',
          street_number: null
        },
        email,
        identification: {
          number: '',
          type: ''
        },
        name: '',
        surname: '',
        date_created: null,
        last_purchase: null
      },
      metadata,
      application_fee: applicationFee
    }
    const response = await axios.post(mercadopago.urls.preferences, body, {
      headers: {
        Authorization: `Bearer ${this.#apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    const responseData = await response.data

    return responseData
  }

  payMany = async ({ items, email, metadata, applicationFee }: { items: Array<{ id: string, title: string, description: string, picture_url: string, quantity: number, unit_price: number }>, email?: string, metadata?: Record<string, string | number | null> | undefined, applicationFee?: number }) => {
    const transactionAmount = items.reduce((total, { unit_price: unitPrice }) => (total + unitPrice), 0)

    const body = {
      items,
      notification_url: '',
      back_urls: {
        success: `${clientUrl}/purchases`,
        failure: `${clientUrl}/purchases`,
        pending: `${clientUrl}/purchases`
      },
      payment_methods: {
        installments: 3
      },
      transaction_amount: transactionAmount,
      description: items.map((item) => item.title).join(' '),
      payer: {
        phone: {
          area_code: '',
          number: 0
        },
        address: {
          zip_code: '',
          street_name: '',
          street_number: null
        },
        email,
        identification: {
          number: '',
          type: ''
        },
        name: '',
        surname: '',
        date_created: null,
        last_purchase: null
      },
      metadata
      // application_fee: applicationFee
    }
    const response = await axios.post(mercadopago.urls.preferences, body, {
      headers: {
        Authorization: `Bearer ${this.#apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    const responseData = await response.data

    return responseData
  }
}

const stripeService = new StripeService({ service: stripe })

const mercadopagoService = new MercadoPago({
  apiKey: mercadopago.accessToken ?? ''
})

export const Payment = {
  stripe: stripeService,
  mercadopago: mercadopagoService
}

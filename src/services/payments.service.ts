import { db } from '../config/prisma.js'
import axios from 'axios'

// preferences: Genera una preferencia con la información de un producto o servicio y obtén la URL necesaria para iniciar el flujo de pago.

const URLS_MERCADOPAGO = {
  preferences: 'https://api.mercadopago.com/checkout/preferences'
}

export const payItemService = async ({ id, quantity }: { id: string, quantity: number }) => {
  console.log(id, quantity)
  try {
    const item = await db.stock.findUnique({
      where: {
        id
      },
      include: {
        product: {
          select: {
            name: true,
            description: true
          }
        }
      }
    })

    if (!item) {
      return {
        error: 'No existe este producto',
        status: 404
      }
    }

    if (item?.stock < Number(quantity)) {
      return {
        error: 'Stock Not avilable',
        status: 406
      }
    }

    const body = {
      items: [
        {
          id: item.id,
          title: `${item.product.name} ${item.size} ${item.color} x${quantity ?? 1}`,
          description: item.product.description,
          picture_url: item.images[0],
          quantity: Number(quantity),
          currency_id: 'ARS',
          unit_price: item.price
        }
      ],
      notification_url: 'https://e-commence-api.onrender.com/webhooks',
      back_urls: {
        success: `${process.env.CLIENT_URL ?? ''}/success`,
        failure: `${process.env.CLIENT_URL ?? ''}/failure`,
        pending: `${process.env.CLIENT_URL ?? ''}/pending`
      },
      payment_methods: {
        installments: 3
      },
      transaction_amount: Number(item.price),
      description: item.product.description
    }
    const response = await axios.post(URLS_MERCADOPAGO.preferences, body, {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN ?? ''}`,
        'Content-Type': 'application/json'
      }
    })
    const responseData = await response.data
    return responseData
  } catch (error: any) {
    return {
      error: error.message,
      status: 500
    }
  }
}

interface PayItems {
  id: string
  quantity: number
}

export const payItemsService = async (items: PayItems[]) => {
  try {
    console.log(items)
  } catch (error: any) {
    return {
      error: error.message,
      status: 500
    }
  }
}

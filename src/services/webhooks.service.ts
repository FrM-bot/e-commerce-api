import axios from 'axios'
import { db } from '../config/prisma.js'

interface IWebhooksData {
  action: string
  api_version: string
  data: { id: string }
  date_created: Date
  id: number
  live_mode: boolean
  type: string
  user_id: string
}

export const webhooksNotificationsService = async (data: IWebhooksData) => {
  try {
    console.log(data, data.data.id)
    const paymentInfo: any = await axios.get(
      `https://api.mercadopago.com/v1/payments/${data?.data?.id ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN ?? ''}`
        }
      }
    )
    paymentInfo?.data.additional_info?.items?.forEach(async (product: any) => {
      console.log(product, product?.id)
      const stock = await db.stocks.findUnique({
        where: {
          id: product?.id
        }
      })
      if (!stock) {
        return {
          error: 'Stock Not avilable',
          status: 500
        }
      }
      console.log(stock)
      await db.stocks.update({
        where: {
          id: stock.id
        },
        data: {
          stock: stock.stock - Number(product.quantity)
        }
      })
    })
    console.log(paymentInfo)
    return data
  } catch (error: any) {
    console.error(error)
    return {
      error: error.message,
      status: 500
    }
  }
}

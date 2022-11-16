import { db } from '../config/prisma.js'

export const getItemsByIdService = async (ids: string[]) => {
  try {
    const idsToSearch = ids?.map((id) => ({ id }))
    const items = await db.product.findMany({
      where: {
        OR: idsToSearch
      }
    })
    return items
  } catch (error: any) {
    console.error(error.message)
    return {
      error: error.message,
      status: 500
    }
  }
}

export const getItemsService = async () => {
  try {
    const items = await db.product.findMany({
      include: {
        stocks: true
      }
    })
    return items
  } catch (error: any) {
    return {
      error: error.message,
      status: 500
    }
  }
}

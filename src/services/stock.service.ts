import { INewStock } from 'src/interfaces/item.interface'
import { removeFiles } from '../utils/removeFiles.js'
import { destFiles } from '../utils/pathFiles.js'
import { db } from '../config/prisma.js'
import { validateObject } from '../utils/item.validator.js'
import { upluadFiles, deleteFiles } from '../config/cloudinary.js'
import { IStockToUpdate } from 'src/interfaces/stock.interface'

export const addStockService = async (newStock: INewStock) => {
  let imagesUploadIds: string[] = []
  try {
    if (!newStock.files) {
      return { error: 'ERROR_REQUIRED_FILES', status: 406 }
    }
    const { keyRequired } = validateObject(newStock, [
      'price',
      'color',
      'size',
      'stock',
      'files'
    ])
    if (keyRequired) {
      return {
        error: `Falta la propiedad: ${keyRequired}`,
        status: 406
      }
    }
    const { images, error, status } = await upluadFiles(
      newStock.files.map((file) => file.path)
    )
    if (error && status) {
      return { error, status }
    }
    images && (imagesUploadIds = [...images])
    const data = await db.product.update({
      where: {
        id: newStock.idProduct
      },
      data: {
        stocks: {
          create: {
            price: Number(newStock.price),
            stock: Number(newStock.stock),
            color: newStock.color,
            size: newStock.size,
            images
          }
        }
      },
      include: {
        stocks: true
      }
    })
    removeFiles(destFiles)
    return data
  } catch (error: any) {
    console.log(error)
    removeFiles(destFiles)
    void deleteFiles(imagesUploadIds)
    return {
      error: error.message,
      status: 500
    }
  }
}

export const updateStockService = async (stock: IStockToUpdate, id: string) => {
  try {
    console.log(stock)
    stock.price && (stock.price = Number(stock.price))
    stock.stock && (stock.stock = Number(stock.stock))
    const data = await db.stocks.update({
      where: {
        id
      },
      data: {
        ...stock
      }
    })
    return data
  } catch (error: any) {
    return {
      error: error.message,
      status: 500
    }
  }
}

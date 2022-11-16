import { validateObject } from '../utils/item.validator.js'
import { db } from '../config/prisma.js'
import { INewProduct } from '../interfaces/item.interface.js'
// import { deleteFiles } from '../config/cloudinary.js'

export const insertItemService = async (item: INewProduct): Promise<any | { error: string, status: number }> => {
  try {
    // if (!item?.files) {
    //   return { error: 'ERROR_REQUIRED_FILES', status: 406 }
    // }

    const { keyRequired } = validateObject(item, ['name', 'description', 'category'])
    if (keyRequired) {
      return {
        error: `Falta la propiedad: ${keyRequired}`,
        status: 406
      }
    }

    // const { images, error, status } = await upluadFiles(item.files.map(file => file.path))
    // if (error && status) {
    //   return { error, status }
    // }

    const newItem = await db.product.create({
      data: {
        name: item.name,
        category: item.category,
        description: item.description
      }
    })

    return newItem
  } catch (error: any) {
    console.error(error.message)
    return {
      error: error.message,
      status: 500
    }
  }
}

// const getIdFromImageURL = (url: string) => {
//   const id = url.split('/').at(-1)?.split('.').at(0)
//   return id ?? ''
// }

// export const deleteItemService = async ({ id }: { id: string }) => {
//   try {
//     const deletedItem = await db.product.delete({
//       where: {
//         id
//       }
//     })
//     const ids: string[] = deletedItem.images.map(getIdFromImageURL)
//     ids?.length > 0 && deleteFiles(ids)
//     return deletedItem
//   } catch (error: any) {
//     return {
//       error: error.message,
//       status: 500
//     }
//   }
// }

export const getItemService = async (id: string) => {
  try {
    const item = await db.product.findUnique({
      where: {
        id
      }
    })
    return item
  } catch (error: any) {
    return {
      error: error.message,
      status: 500
    }
  }
}

// export const getItemByNameService = async (name: string) => {
//   try {
//     const item = await db.product.findUnique({
//       where: {

//       }
//     })
//     return item
//   } catch (error: any) {
//     return {
//       error: error.message,
//       status: 500
//     }
//   }
// }

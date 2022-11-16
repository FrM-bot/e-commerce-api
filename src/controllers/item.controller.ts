import type { Request, Response } from 'express'
import {
  insertItemService,
  getItemService
  // deleteItemService
} from '../services/item.service.js'
import { handlerHttpError } from '../utils/error.handler.js'

const getItemController = async ({ params }: Request, res: Response): Promise<void> => {
  try {
    const { id } = params
    const data = await getItemService(id)
    res.send({ data })
  } catch (error) {
    handlerHttpError({ res, error: 'ERROR_GET_ITEM', errorRaw: error })
  }
}

// export const getItemByNameController = async ({ params }: Request, res: Response): Promise<void> => {
//   try {
//     const { id } = params
//     const data = await getItemByNameService(id)
//     res.send({ data })
//   } catch (error) {
//     handlerHttpError({ res, error: 'ERROR_GET_ITEM', errorRaw: error })
//   }
// }

// const upload_files = async (files: Express.Multer.File[]| { [fieldname: string]: Express.Multer.File[] } | undefined) => {
//   try {
//     files?.forEach(file => {
//       file.pathname
//     })
//     const { } = await upload_img()
//   } catch (error) {
//   }
// }

const postItemController = async (
  { body }: Request,
  res: Response
): Promise<void> => {
  try {
    console.log({ body })
    const data = await insertItemService(body)
    res.send({ data })
  } catch (error) {
    handlerHttpError({ res, error: 'ERROR_POST_ITEM', errorRaw: error })
  }
}

const updateItemController = async (req: Request, res: Response): Promise<void> => {
  try {
    res.send({ data: '' })
  } catch (error) {
    handlerHttpError({ res, error: 'ERROR_UPDATE_ITEM', errorRaw: error })
  }
}

// const deleteItemController = async ({ params }: Request, res: Response): Promise<void> => {
//   try {
//     const data = await deleteItemService({ id: params.id })
//     res.send({ data })
//   } catch (error) {
//     handlerHttpError({ res, error: 'ERROR_DELETE_ITEM', errorRaw: error })
//   }
// }

export { getItemController, postItemController, updateItemController }

/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { Request, Response, Express } from 'express'
import { handlerHttpError, Files } from '../lib/utils/index.js'
import { validatePartialStock, validateStock } from '../lib/schemas/index.js'
import { Uploader } from '../services/images.service.js'
// import { Files } from '@lib/utils'
import type { ModelsRequired } from '../routes/stocks.js'

export class StockController {
  Model
  constructor ({ Model }: { Model: ModelsRequired }) {
    this.Model = Model
  }

  getBy = async ({ params }: Request, res: Response): Promise<void> => {
    const { id } = params
    try {
      const data = await this.Model.stock.getBy({ id })
      res.send({
        data
      })
    } catch (error) {
      handlerHttpError({ res, error: 'ERROR_GET_STOCK', errorRaw: error })
    }
  }

  post = async (
    { body, params, files }: Request,
    res: Response
  ): Promise<void | Response<any, Record<string, any>>> => {
    const id = params.id
    if (!id || !files || !Array.isArray(files)) {
      return res
        .send({
          error: 'Product Id and Files are required'
        })
        .status(400)
    }
    let response: { images: string[] }
    const filePaths = files?.map((file: Express.Multer.File) => file.path)
    try {
      response = await Uploader.uploadMany({
        filePaths
      })
      await Files.deleteMany({ filePaths })
    } catch (errorRaw) {
      await Files.deleteMany({ filePaths })
      handlerHttpError({ res, error: 'ERROR_VALIDATE_ADDRESS', errorRaw }); return
    }

    try {
      const result = await validateStock({
        color: body.color,
        size: body.size,
        price: Number(body.price),
        quantity: Number(body.quantity),
        images: response?.images
      })

      if (!result.success) {
        response?.images && await Uploader.deleteMany({
          imagesUrls: response?.images
        })
        handlerHttpError({ res, error: 'ERROR_VALIDATE_ADDRESS', errorRaw: result }); return
      }
      const data = await this.Model.stock.add({ id, input: result.data })
      res.json({
        data
      })
    } catch (errorRaw) {
      await Files.deleteMany({ filePaths })

      response?.images && await Uploader.deleteMany({
        imagesUrls: response?.images
      })
      handlerHttpError({ res, error: 'ERROR_VALIDATE_ADDRESS', errorRaw })
    }
  }

  edit = async (
    { body, params }: Request,
    res: Response
  ): Promise<void | Response<any, Record<string, any>>> => {
    const { id } = params
    try {
      body?.price && (body.price = Number(body.price))
      body?.quantity && (body.quantity = Number(body.quantity))

      const result = await validatePartialStock(body)

      if (!result.success) {
        handlerHttpError({ res, error: 'ERROR_VALIDATE_ADDRESS', errorRaw: result }); return
      }

      const data = await this.Model.stock.update({ id, input: result.data })

      res.send({
        data
      })
    } catch (error) {
      handlerHttpError({ res, error: 'ERROR_EDIT_STOCK', errorRaw: error })
    }
  }

  removeImages = async (
    { body, params }: Request,
    res: Response
  ): Promise<void | Response<any, Record<string, any>>> => {
    const { id } = params
    const stock = await this.Model.stock.getBy({ id })

    if (!stock) {
      return res
        .send({
          error: 'Product Id incorrect'
        })
        .status(404)
    }
    const { imagesToRemove } = body as { imagesToRemove: string[] }
    try {
      await Uploader.deleteMany({ imagesUrls: imagesToRemove })
    } catch (errorRaw) {
      handlerHttpError({ res, error: 'ERROR_DELETE_IMAGES', errorRaw }); return
    }
    try {
      const imagesToSave = stock.images?.filter(
        (imageUrl: string) => !imagesToRemove?.includes(imageUrl)
      )
      await this.Model.stock.update({
        id,
        input: {
          images: imagesToSave
        }
      })
      res.json({
        status: 'success',
        deleted: imagesToRemove
      })
    } catch (errorRaw) {
      handlerHttpError({ res, error: 'ERROR_DELETE_IMAGES_FROM_STOCK', errorRaw })
    }
  }

  addImages = async (
    { params, files }: Request,
    res: Response
  ): Promise<void | Response<any, Record<string, any>>> => {
    const { id } = params

    const stock = await this.Model.stock.getBy({ id })

    if (!stock || !files || !Array.isArray(files)) {
      return res
        .send({
          error: 'Product Id and Files are required'
        })
        .status(400)
    }
    const filePaths = files?.map((file: Express.Multer.File) => file.path)
    try {
      const { images } = await Uploader.uploadMany({
        filePaths
      })
      await Files.deleteMany({ filePaths })

      const data = await this.Model.stock.update({
        id,
        input: {
          images: stock.images?.concat(images)
        }
      })
      res.json({
        data
      })
    } catch (errorRaw) {
      await Files.deleteMany({ filePaths })
      handlerHttpError({ res, error: 'ERROR_UPLOAD_IMAGES', errorRaw })
    }
  }

  delete = async (
    { params }: Request,
    res: Response
  ): Promise<void | Response<any, Record<string, any>>> => {
    const { id } = params
    const stock = await this.Model.stock.getBy({ id })

    if (!stock) {
      return res
        .send({
          error: 'Product Id incorrect'
        })
        .status(404)
    }
    try {
      stock?.images && await Uploader.deleteMany({ imagesUrls: stock.images })
    } catch (errorRaw) {
      handlerHttpError({ res, error: 'ERROR_DELETE_IMAGES', errorRaw }); return
    }
    try {
      const { status } = await this.Model.stock.delete({
        id
      })
      res.json({
        status: status ? 'success' : 'failed'
      })
    } catch (errorRaw) {
      handlerHttpError({ res, error: 'ERROR_DELETE_STOCK', errorRaw })
    }
  }
}

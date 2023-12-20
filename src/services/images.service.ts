import { parse } from 'node:path'
import { v2 as Cloudinary, type UploadApiResponse, type DeleteApiResponse } from 'cloudinary'

export class ImageService {
  readonly #service
  readonly #folder = 'items'
  constructor ({ service }: { service: typeof Cloudinary }) {
    this.#service = service
  }

  getFileFromUrl ({ url }: { url: string }) {
    const imgUrl = new URL(url)
    const { name } = parse(imgUrl.pathname)
    return `${this.#folder}/${name}`
  }

  async upload ({ filePath }: { filePath: string }): Promise<UploadApiResponse> {
    try {
      const response = await this.#service.uploader.upload(filePath, { folder: this.#folder })
      return response
    } catch (error) {
      throw new Error('ERROR_UPLOAD_IMAGES')
    }
  }

  async delete ({ id }: { id: string }): Promise<DeleteApiResponse> {
    try {
      const response = await this.#service.uploader.destroy(id)
      return response
    } catch (error) {
      throw new Error('ERROR_UPLOAD_IMAGES')
    }
  }

  async uploadMany ({ filePaths }: { filePaths: string[] }) {
    try {
      const promises = filePaths.map(async filePath => await this.upload({ filePath }))
      const responseImages = await Promise.all(promises)
      return {
        images: responseImages.map(image => image.secure_url)
      }
    } catch (error) {
      console.error(error)
      throw new Error('ERROR_UPLOAD_IMAGES')
    }
  }

  async deleteMany ({ imagesUrls }: { imagesUrls: string[] }) {
    try {
      const promises = imagesUrls.map(async url => await this.delete({ id: this.getFileFromUrl({ url }) }))
      const responseImages = await Promise.all(promises)
      return {
        response: responseImages.map(image => image.message)
      }
    } catch (error) {
      throw new Error('ERROR_UPLOAD_IMAGES')
    }
  }
}

Cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true
})

export const Uploader = new ImageService({ service: Cloudinary })

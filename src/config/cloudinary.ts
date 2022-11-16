import { v2 as cloudinary } from 'cloudinary'
import { destFiles } from '../utils/pathFiles.js'
import { removeFiles } from '../utils/removeFiles.js'

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

const uploadImg = async (filePath: string) => {
  try {
    const res = await cloudinary.uploader.upload(filePath, { folder: 'items' })
    return { img: res }
  } catch (error: any | undefined) {
    return { error: error.message }
  }
}

const removeImg = async (id: string) => {
  try {
    const res = await cloudinary.uploader.destroy(id)
    return { res }
  } catch (error: any) {
    console.error(error)
    return { error: error?.message }
  }
}

export async function upluadFiles (filesPath: string[]) {
  try {
    const images: string[] = []

    for (const filePath of filesPath) {
      console.log(filePath)
      const imageUploaded = await uploadImg(filePath)
      if (imageUploaded?.error) {
        removeFiles(destFiles)
        return { error: imageUploaded?.error, status: 406 }
      }
      console.log(imageUploaded)
      imageUploaded?.img?.secure_url &&
        images.push(imageUploaded?.img?.secure_url)
    }
    return { images }
  } catch (error: any) {
    return { error: error?.message, status: 500 }
  }
}

export async function deleteFiles (ids: string[]) {
  try {
    for (const id of ids) {
      await removeImg(id)
    }
    return { status: 'success' }
  } catch (error: any) {
    return { error: error?.message, status: 500 }
  }
}

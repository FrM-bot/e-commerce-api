import { v2 as Cloudinary } from 'cloudinary'
import { removeFile } from '@lib/utils'

Cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

const uploadImgToCloudinary = async (filePath: string) => {
  const response = await Cloudinary.uploader.upload(filePath, { folder: 'items' })
  await removeFile(filePath)
  return response
  // try {
  // } catch (error: any | undefined) {
  //   await removeFile(filePath)
  //   return { error: error.message }
  // }
}

export const deleteFileFromCloudinary = async ({ id }: { id: string }) => {
  try {
    const responseDestroyCloudinary = await Cloudinary.uploader.destroy(id)
    return { responseDestroyCloudinary }
  } catch (error: any) {
    console.error(error)
    return { error: error?.message }
  }
}

export async function uploadFilesToCloudinary ({ filesPath }: { filesPath: string[] }) {
  try {
    const promises = filesPath.map(async filePath => await uploadImgToCloudinary(filePath))
    const images = await Promise.allSettled(promises)

    return images
  } catch (error: any) {
    return { error: error?.message, status: 500 }
  }
}

export async function deleteFilesFromCloudinary (ids: string[]) {
  try {
    const promises = ids.map(async id => await deleteFileFromCloudinary({ id }))
    const images = await Promise.allSettled(promises)

    return images
  } catch (error: any) {
    return { error: error?.message, status: 500 }
  }
}

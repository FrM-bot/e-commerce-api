/* eslint-disable no-undef */
import { BlobServiceClient, BlobDeleteResponse } from '@azure/storage-blob'

interface IFileData {
  filename: string
  path: string
}

export const CONTAINERS_AZURE_BLOB_STORAGE = {
  images: 'imagenes'
}

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING ?? ''
)

export const upluadFileToAzure = async (
  container: string,
  { filename, path }: IFileData
) => {
  try {
    const containerClient = blobServiceClient.getContainerClient(container)
    const uploadBlobResponse = await containerClient
      .getBlockBlobClient(filename)
      .uploadFile(path)

    const url = containerClient.getBlockBlobClient(filename).url
    return { uploadBlobResponse, url }
  } catch (error: any | undefined) {
    console.error(error)
    return {
      error: error?.message
    }
  }
}

export const upluadFilesToAzure = async (
  container: string,
  files: IFileData[]
) => {
  try {
    let images: string[] = []

    for (const file of files) {
      const responseUpluadFile = await upluadFileToAzure(container, file)
      if (responseUpluadFile?.error) {
        return { error: responseUpluadFile?.error, status: 406 }
      }
      responseUpluadFile?.url && (images = images.concat(responseUpluadFile?.url))
    }

    return { images }
  } catch (error: any) {
    console.error(error)
    return {
      error: error.message,
      status: 500
    }
  }
}

export const deleteFileFromAzure = async (
  container: string,
  file: string
) => {
  try {
    const containerClient = blobServiceClient.getContainerClient(container)
    const deleteBlobResponse = await containerClient
      .getBlockBlobClient(file)
      .delete()

    console.log(file, deleteBlobResponse)
    return { deleteBlobResponse }
  } catch (error: any | undefined) {
    console.error(error)
    return {
      error: error?.message
    }
  }
}

export const deleteFilesFromAzure = async (
  container: string,
  filenames: string[]
) => {
  try {
    let responsesDeleteFile: BlobDeleteResponse[] = []
    for (const filename of filenames) {
      const responseDeleteFile = await deleteFileFromAzure(container, filename)
      if (responseDeleteFile?.error) {
        return { error: responseDeleteFile?.error, status: 500 }
      }
      // responseDeleteFile?.deleteBlobResponse && responsesDeleteFile.push(responseDeleteFile.deleteBlobResponse)
      responseDeleteFile?.deleteBlobResponse && (responsesDeleteFile = responsesDeleteFile.concat(responseDeleteFile.deleteBlobResponse))
    }

    return responsesDeleteFile
  } catch (error: any) {
    console.error(error)
    return {
      error: error.message,
      status: 500
    }
  }
}

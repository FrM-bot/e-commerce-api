import path from 'node:path'

import { randomUUID } from 'node:crypto'

import multer from 'multer'

import { destFiles } from '../lib/utils/index.js'

const storage = multer.diskStorage({
  destination: destFiles,
  filename: (_req, file, callback) => {
    callback(null, randomUUID().concat(path.extname(file.originalname)))
  }
})

const upload = multer({
  storage,
  dest: destFiles,
  limits: {
    fileSize: (1000 * 1000) * 3
  },
  fileFilter: (_req, file, callback) => {
    const imageTypes = /jpeg|jpg|png/

    const mineTypes = imageTypes.test(file.mimetype)

    const extType = imageTypes.test(path.extname(file.originalname))

    // console.log(path.extname(file.originalname), file.mimetype)
    console.log({ extType, mineTypes })

    if (mineTypes && extType) {
      callback(null, true); return
    }
    // new Error('Solo se admiten imagenes')
    callback(null, false)
  }
})

export { upload }

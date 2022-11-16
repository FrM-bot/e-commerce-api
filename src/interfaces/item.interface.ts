export interface INewStock {
  idProduct: string
  stock: number
  size: string
  color: string
  price: number
  // eslint-disable-next-line no-undef
  files: Express.Multer.File[]
}

export interface INewProduct {
  name: string
  description: string
  category: string
}

export interface newItem {
  name: string
  description: string
  price: number
  color: string
  size: string
  category: string
  stock: number
}

export interface newItemWithFiles extends newItem {
  // eslint-disable-next-line no-undef
  files: Express.Multer.File[]
}

export interface Item extends newItem {
  id: string
  updatedAt: Date
  timeStamp: Date
  images: string[]
  usersIds: string[]
  purchasesIds: string[]
  bookmarksIds: string[]
}

export interface IProduct {
  id: string
  name: string
  description: string
  timeStamp: Date
  category: string
  updatedAt: Date
  stocks: IStock[]
}

export interface IStock {
  id: string
  stock: number
  size: string
  color: string
  price: number
  images: string[]
  productId: string
}

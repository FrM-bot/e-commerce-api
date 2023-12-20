import { Auth } from './auth.interface'

export interface User extends Auth {
  name: string
  productsIds: string[]
  purchasesIds: string[]
  bookmarksIds: string[]
}

import { type Auth } from './auth.js'

export interface User extends Auth {
  name: string
  productsIds: string[]
  purchasesIds: string[]
  bookmarksIds: string[]
}

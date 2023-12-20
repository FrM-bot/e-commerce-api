import { db } from '../lib/config/index.js'
import type { Database, NewAddress } from '../lib/interfaces/index.js'

class AddressModel {
  readonly #db: Database
  constructor ({ db }: { db: Database }) {
    this.#db = db
  }

  findOne = async ({
    where
  }: {
    where: { id: string }
  }) => {
    const location = await this.#db.address.findUnique({
      where
    })
    return {
      ...location
    }
  }

  add = async ({ data }: { data: NewAddress & { userId: string } }) => {
    const user = await this.#db.address.create({
      data
    })

    return user
  }
}
export const Address = new AddressModel({ db })

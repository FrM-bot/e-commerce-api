import { db } from '../config/prisma.js'

export const userProfileService = async (id: string | undefined) => {
  try {
    console.log(id)
    const user = await db.user.findUnique({
      where: {
        id
      },
      include: {
        products: {
          select: {
            name: true
          }
        }
      }
    })
    return user
  } catch (error: any) {
    return {
      error: error.message,
      status: 500
    }
  }
}

export const userAddCartService = async (
  id: string | undefined,
  idProduct: string
) => {
  try {
    console.log(id)
    const userSearched = await db.user.findUnique({
      where: {
        id
      }
    })
    if (!userSearched) {
      return {
        error: 'User not found',
        status: 406
      }
    }

    if (userSearched.productsIds.includes(idProduct)) {
      const user = await db.user.update({
        where: {
          id
        },
        data: {
          cartIds: {
            push: idProduct
          }
        }
      })
      return user
    }

    const user = await db.user.update({
      where: {
        id
      },
      data: {
        cartIds: {
          push: idProduct
        },
        products: {
          connect: {
            id: idProduct
          }
        }
      }
    })
    return user
  } catch (error: any) {
    return {
      error: error.message,
      status: 500
    }
  }
}

export const userRemoveCartService = async (
  id: string | undefined,
  idProduct: string
) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id
      }
    })
    const indexProductToRemove = user?.cartIds?.findIndex(id => id === idProduct)

    const cartIds = user?.cartIds.filter((_id, index) => index !== indexProductToRemove)

    if (!user?.bookmarksIds.includes(idProduct) && !cartIds?.includes(idProduct)) {
      const updatedUser = await db.user.update({
        where: {
          id
        },
        data: {
          cartIds,
          products: {
            disconnect: {
              id: idProduct
            }
          }
        }
      })

      return updatedUser
    }

    const updatedUser = await db.user.update({
      where: {
        id
      },
      data: {
        cartIds
      }
    })

    return updatedUser
  } catch (error: any) {
    return {
      error: error.message,
      status: 500
    }
  }
}

/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { type Request, type Response } from 'express'
import { handlerHttpError } from '@lib/utils'
import { type ModelsRequired } from '@routes/favorites.js'

export interface PayloadToken {
  payload: {
    email: string
  }
}

export class FavoritesController {
  #Model
  constructor ({ Model }: { Model: ModelsRequired }) {
    this.#Model = Model
  }

  addFavorite = async (
    { params, payload }: Request & PayloadToken,
    res: Response
  ): Promise<void | Response<any, Record<string, any>>> => {
    const { itemId } = params as { itemId: string }
    const { email } = payload

    let user
    try {
      user = await this.#Model.user.getBy({ email })
    } catch (errorRaw) {
      console.error(errorRaw)
      return handlerHttpError({ res, error: 'ERROR_GET_USER_DATA', errorRaw })
    }

    if (!user?.favoritesIds) {
      return
    }

    if (user?.favoritesIds.includes(itemId)) {
      return res.json({
        data: user
      })
    }

    try {
      const updatedUser = await this.#Model.user.update({
        where: {
          email
        },
        data: {
          favoritesIds: user.favoritesIds.concat(itemId) ?? [itemId]
        }
      })

      res.json({
        data: updatedUser
      })
    } catch (error) {
      handlerHttpError({ res, error: 'ERROR_ADD_FAVORITES', errorRaw: error })
    }
  }

  removeFavorite = async (
    { params, payload }: Request & PayloadToken,
    res: Response
  ): Promise<void | Response<any, Record<string, any>>> => {
    const { itemId } = params as { itemId: string }
    const { email } = payload

    let user
    try {
      user = await this.#Model.user.getBy({ email })
    } catch (errorRaw) {
      console.error(errorRaw)
      return handlerHttpError({ res, error: 'ERROR_GET_USER_DATA', errorRaw })
    }

    if (!user?.favoritesIds) {
      return handlerHttpError({
        res,
        error: 'ERROR_REMOVE_FAVORITES',
        errorRaw: 'User not found'
      })
    }

    if (!user?.favoritesIds.includes(itemId)) {
      return res.json({
        data: user
      })
    }

    try {
      const updatedUser = await this.#Model.user.update({
        where: {
          email
        },
        data: {
          favoritesIds:
            user.favoritesIds.filter((listItemId) => listItemId !== itemId)
        }
      })

      res.json({
        data: updatedUser
      })
    } catch (errorRaw) {
      handlerHttpError({ res, error: 'ERROR_REMOVE_FAVORITES', errorRaw })
    }
  }
}

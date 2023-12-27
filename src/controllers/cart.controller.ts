/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { type Request, type Response } from 'express'
import { handlerHttpError } from '../lib/utils/index.js'
import type { PayloadToken } from '../lib/interfaces/index.js'
import type { ModelsRequired } from '../routes/cart.js'

interface ParamQuery { itemId: string }

export class CartController {
  readonly #Model
  constructor ({ Model }: { Model: ModelsRequired }) {
    this.#Model = Model
  }

  addCart = async (
    { params, payload, query }: Request & PayloadToken,
    res: Response
  ): Promise<void | Response<void, Record<string, any>>> => {
    const { itemId } = params as unknown as ParamQuery
    const { email } = payload
    const { quantity: quantityString } = query
    const quantity = Number(quantityString)

    if (isNaN(quantity) || quantity < 1) {
      handlerHttpError({
        res,
        error: 'ERROR_QUANTITY_IS_NAN',
        errorRaw: 'Error quantity is NaN'
      }); return
    }

    let user
    try {
      user = await this.#Model.user.getBy({ email })
    } catch (errorRaw) {
      console.error(errorRaw)
      handlerHttpError({ res, error: 'ERROR_GET_USER_DATA', errorRaw }); return
    }

    if (!user?.cart || !user.id) {
      return
    }

    const cartItem = user.cart.find(({ stockId }) => stockId === itemId)

    if (cartItem) {
      return res.json({
        data: user
      })
    }

    try {
      const updatedCart = await this.#Model.cart.add({
        data: {
          quantity,
          stockId: itemId,
          userId: user.id
        }
      })
      res.json({
        data: updatedCart
      })
    } catch (error) {
      handlerHttpError({
        res,
        error: 'ERROR_ADD_ITEM_FROM_CART',
        errorRaw: error
      })
    }
  }

  editCart = async (
    { params, payload, query }: Request & PayloadToken,
    res: Response
  ): Promise<void | Response<any, Record<string, any>>> => {
    const { itemId } = params as unknown as ParamQuery
    const { email } = payload
    const { quantity: quantityString } = query
    const quantity = Number(quantityString)

    if (isNaN(quantity)) {
      handlerHttpError({
        res,
        error: 'ERROR_QUANTITY_IS_NAN',
        errorRaw: 'Error quantity is NaN'
      }); return
    }

    let user
    try {
      user = await this.#Model.user.getBy({ email })
    } catch (errorRaw) {
      console.error(errorRaw)
      handlerHttpError({ res, error: 'ERROR_GET_USER_DATA', errorRaw }); return
    }

    if (!user.cart) {
      handlerHttpError({ res, error: 'ERROR_GET_USER_DATA', errorRaw: 'User doesn\'t exist' }); return
    }

    const cartItem = user.cart.find(({ id }) => itemId === id)

    if (cartItem === undefined) {
      return res.json({
        data: user
      })
    }

    try {
      const updatedCart = await this.#Model.cart.update({
        where: {
          id: cartItem.id
        },
        data: {
          quantity: quantity > cartItem.quantity ? cartItem.quantity : quantity
        }
      })

      res.json({
        data: updatedCart
      })
    } catch (error) {
      handlerHttpError({
        res,
        error: 'ERROR_EDIT_ITEM_FROM_CART',
        errorRaw: error
      })
    }
  }

  removeCart = async (
    { params, payload }: Request & PayloadToken,
    res: Response
  ): Promise<void | Response<any, Record<string, any>>> => {
    const { itemId } = params as unknown as ParamQuery
    const { email } = payload

    let user

    try {
      user = await this.#Model.user.getBy({ email })
    } catch (errorRaw) {
      console.error(errorRaw)
      handlerHttpError({ res, error: 'ERROR_GET_USER_DATA', errorRaw }); return
    }

    if (!user?.cart || !itemId) {
      handlerHttpError({
        res,
        error: 'ERROR_REMOVE_ITEM_FROM_CART',
        errorRaw: 'User not found'
      }); return
    }

    const cartItem = user.cart.find(({ stockId }) => stockId === itemId)

    if (!cartItem) {
      return res.json({
        data: user
      })
    }

    const { id } = cartItem
    try {
      await this.#Model.cart.remove({
        id
      })

      res.json({
        data: {
          message: 'Item removed from cart'
        }
      })
    } catch (error) {
      handlerHttpError({
        res,
        error: 'ERROR_REMOVE_ITEM_FROM_CART',
        errorRaw: error
      })
    }
  }
}

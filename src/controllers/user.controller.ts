/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { type Request, type Response } from 'express'
import { handlerHttpError, Token } from '../lib/utils/index.js'
import { Email } from '../services/email.service.js'
import { readFile } from 'node:fs/promises'
import { clientUrl } from '../lib/config/index.js'
import { type ModelsRequired } from '../routes/users.js'
import { PROVIDER } from '../lib/const/index.js'
import { PayloadToken } from '../lib/interfaces/index.js'

const createAccountButton = ({ href, text }: { href: string, text: string }) =>
  `<a class="button" href=${href}>${text}</a>`

export class UserController {
  #Model
  providers: string[]
  constructor ({ Model }: { Model: ModelsRequired }) {
    this.#Model = Model
    this.providers = [PROVIDER.GOOGLE, PROVIDER.PASSWORD]
  }

  sendRegisterMail = async (
    { body, params }: Request,
    res: Response
  ): Promise<void | Response<any, Record<string, any>>> => {
    const { method } = params
    const { email } = body
    try {
      let rawHtml = await readFile('./public/createPassword.html', {
        encoding: 'utf-8'
      })
      const token = Token.create({ payload: { method, email } })
      rawHtml = rawHtml.replaceAll(
        '{{button__create__account}}',
        createAccountButton({
          text: 'Create account',
          href: clientUrl + `/create?token=${token}`
        })
      )

      await Email.send({
        to: email,
        html: rawHtml,
        subject: 'Create Account',
        text: 'Hi there'
      })
      res.send({
        data: email
      })
    } catch (errorRaw) {
      handlerHttpError({ res, error: 'ERROR_SEND_EMAIL', errorRaw })
    }
  }

  register = async (
    { params, payload }: Request & PayloadToken,
    res: Response
  ): Promise<void | Response<any, Record<string, any>>> => {
    const { provider } = params as { provider: PROVIDER }

    if (provider === PROVIDER.GOOGLE) {
      const { email } = payload
      const responseData = {
        data: {
          redirect: '/'
        }
      }
      let existUser
      try {
        existUser = await this.#Model.user.exist({ email })
      } catch (errorRaw) {
        return handlerHttpError({ res, error: 'ERROR_VERIFY_USER', errorRaw })
      }
      if (!existUser.exist) {
        try {
          await this.#Model.user.create({
            email,
            provider
          })
        } catch (errorRaw) {
          return handlerHttpError({
            res,
            error: 'ERROR_REGISTER_USER',
            errorRaw
          })
        }
      }
      return res.send(responseData)
    }
  }

  get = async (
    { payload }: Request & PayloadToken,
    res: Response
  ): Promise<void | Response<any, Record<string, any>>> => {
    const { email } = payload
    const user = await this.#Model.user.getBy({ email })
    if (!user) return handlerHttpError({ res, error: 'ERROR_VERIFY_USER', errorRaw: '' })

    const { cart, favoritesIds, payments, addresses, ...userData } = user
    const favorites = await this.#Model.item.getAll({
      where: { id: { in: favoritesIds } }
    })

    res.send({
      data: {
        ...userData,
        favorites,
        cart,
        addresses
      }
    })
  }
}

import type { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { JWT_SECRET } from '@lib/config'
// const day = 60 * 60 * 24
// const expirationDays = 7
//   expiresIn: expiresIn || day * expirationDays
class TokenService {
  #lib
  #secret
  constructor ({ lib, secret }: { lib: typeof jwt, secret?: string }) {
    this.#lib = lib
    this.#secret = secret
  }

  // expressed in seconds --> default is 5 minutes
  create = ({ payload, options = { expiresIn: 60 * 5 } }: { payload: string | Object, options?: jwt.SignOptions }): string => {
    if (!this.#secret) throw Error('Not secret provided')
    const hashedPassword = this.#lib.sign(payload, this.#secret, options)
    return hashedPassword
  }

  verify = ({ token }: { token: string }): string | jwt.JwtPayload => {
    if (!this.#secret) throw Error('Not secret provided')

    const result = this.#lib.verify(token, this.#secret)
    return result
  }

  middleware = (
    req: Request & { payload?: string | JwtPayload },
    res: Response,
    next: NextFunction
  ) => {
    const auth = req.get('authorization')

    if (!auth) return res.status(401).json({ error: 'Token not exists' })

    const token = auth?.toLowerCase()?.startsWith('bearer') ? auth.split(' ')[1] : false

    if (!token) return res.status(401).json({ error: 'Token malformed' })

    try {
      const secret = this.#secret

      if (!secret) return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' })

      const payload = this.verify({ token })

      req.payload = payload

      next()
    } catch (error) {
      res.status(401).json({ error: 'Token expired or invalid' })
      next(error)
    }
  }
}

export const Token = new TokenService({ lib: jwt, secret: JWT_SECRET })

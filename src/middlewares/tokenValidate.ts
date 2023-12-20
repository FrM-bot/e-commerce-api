import type { NextFunction, Request, Response } from 'express'

import jwt, { JwtPayload } from 'jsonwebtoken'

export default (
  req: Request & { userId?: string | JwtPayload },
  res: Response,
  next: NextFunction
) => {
  const auth = req.get('authorization')

  if (!auth) {
    return res.status(401).json({ error: 'Token not exists' })
  }

  const token = auth?.toLowerCase()?.startsWith('bearer') ? auth.split(' ')[1] : false

  if (!token) {
    return res.status(401).json({ error: 'Token malformed' })
  }

  try {
    const secret = process.env.JWT

    if (!secret) {
      return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' })
    }

    const payload = jwt.verify(token, secret)
    console.log({ payload })
    const userId = typeof payload !== 'string' ? payload.userId : ''
    req.userId = userId
  } catch (error) {
    res.status(401).json({ error: 'Token expired or invalid' })
    next(error)
  }

  next()
}

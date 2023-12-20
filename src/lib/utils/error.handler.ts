import { type Response } from 'express'

export const handlerHttpError = ({ res, error, errorRaw, status }: { res: Response, error: string, errorRaw?: any, status?: number }): void => {
  console.error(errorRaw)
  res.status(status ?? 500).send({ error })
}

import cors from 'cors'
import { clientUrl, NODE_ENV } from '../lib/env/index.js'

const Origins = {
  development: ['http://localhost:4321'],
  production: [clientUrl]
}

type AcceptedOrigins = keyof typeof Origins

const whitelist = Origins[NODE_ENV as AcceptedOrigins]

export const corsMiddleware = ({ acceptedOrigins = whitelist } = {}) =>
  cors({
    origin: (requestOrigin: string | undefined, callback: any) => {
      console.log({ acceptedOrigins, requestOrigin })
      if (!requestOrigin) {
        return callback(null, true)
      }
      if (acceptedOrigins.includes(requestOrigin)) {
        return callback(null, true)
      }
      return callback(new Error('Not allowed by CORS'))
    }
  })

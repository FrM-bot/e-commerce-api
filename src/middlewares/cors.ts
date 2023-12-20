import cors from 'cors'

const ACCEPTED_ORIGINS = {
  development: ['http://localhost:4321'],
  production: ['http://localhost:4321']
}

const whitelist = ACCEPTED_ORIGINS.development

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

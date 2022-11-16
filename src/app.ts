import 'dotenv/config'
import cors from 'cors'
import Express from 'express'
import { router } from './routes/index.js'

const app = Express()

// const whitelist = ['http://localhost:3002']

// const origin = (requestOrigin: string | undefined, callback) => {
//   console.log(requestOrigin, whitelist.includes(requestOrigin ?? ''))
//   if (whitelist.includes(requestOrigin ?? '')) {
//     callback(null, true)
//   } else {
//     callback(new Error('Not allowed by CORS'))
//   }
// }

app.use(
  cors({
    // origin
  })
)

app.use(Express.static('public'))

app.use(Express.json())

app.use(router)

const port = process.env.PORT ?? 3001

app.listen(port, () => {
  console.log(process.env.PORT, 'Port')
  console.log(`App listen on: http://localhost:${port}`)
})

import { createApp } from '@src/app.js'
import { Models } from '@src/models'
import { NODE_ENV, PORT } from '@lib/config'

createApp({ Models, mode: NODE_ENV, port: Number(PORT) })

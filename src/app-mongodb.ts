import { createApp } from './app.js'
import { Models } from './models/index.js'
import { NODE_ENV, PORT } from './lib/env/index.js'

createApp({ Models, mode: NODE_ENV, port: Number(PORT) })

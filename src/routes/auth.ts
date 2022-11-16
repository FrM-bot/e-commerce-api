import { Router } from 'express'
import { loginController, registerController } from '../controllers/auth.controller.js'

const router = Router()

// http://localhost:3002/auth/login [post]
router.post('/login', loginController)

// http://localhost:3002/auth/register [post]
router.post('/register', registerController)

export { router }

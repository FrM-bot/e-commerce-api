import { Router } from 'express'
import { userProfileController, userAddCartProductController, userRemoveCartProductController } from '../controllers/user.controller.js'
import tokenValidate from '../middleware/tokenValidate.js'

const router = Router()

// http://localhost:3002/user/profile [get]
router.get('/profile', tokenValidate, userProfileController)

// http://localhost:3002/user/add_cart_item/:id [post]
router.put('/add_cart_item/:id', tokenValidate, userAddCartProductController)

router.delete('/remove_cart_item/:id', tokenValidate, userRemoveCartProductController)

export { router }

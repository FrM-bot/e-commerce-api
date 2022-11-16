import { Auth } from '../interfaces/auth.interface.js'
import { db } from '../config/prisma.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const registerUserService = async ({ email, password }: Auth) => {
  try {
    if (email?.length < 5 || password?.length < 8) {
      return {
        error: 'Password and email must be 8 length',
        status: 406
      }
    }
    const saltOrRounds = 10
    const hashPassword = await bcrypt.hash(password, saltOrRounds)
    const newUser = await db.user.create({
      data: {
        email,
        password: hashPassword
      }
    })
    return newUser
  } catch (error: any) {
    return {
      error: error.message,
      status: 500
    }
  }
}

export const loginUserService = async ({ email, password }: Auth) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email
      }
    })
    if (!user) {
      console.log('bad user')

      return {
        error: 'Password or email is ...',
        status: 406
      }
    }
    const passwordIs = user ? (await bcrypt.compare(password, user.password)) : (false)
    console.log(user)
    if (!(passwordIs && user)) {
      console.log('bad pass')
      return {
        error: 'Password or email is ...',
        status: 406
      }
    }

    const dataForToken = {
      userId: user.id
    }

    const minutes = 120

    const secret = process.env.JWT

    if (!secret) {
      return {
        error: 'Secrete JWT not found',
        status: 500
      }
    }

    const token = jwt.sign(dataForToken, secret, {
      expiresIn: 60 * minutes
    })

    return { token }
  } catch (error: any) {
    return {
      error: error.message,
      status: 500
    }
  }
}

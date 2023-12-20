import bcrypt from 'bcrypt'

class PasswordEncrypt {
  #encrypt
  #saltOrRounds
  constructor ({ encrypt }: { encrypt: typeof bcrypt }) {
    this.#encrypt = encrypt
    this.#saltOrRounds = 10
  }

  hash = async ({ password }: { password: string }): Promise<string> => {
    const hashedPassword = await this.#encrypt.hash(password, this.#saltOrRounds)

    return hashedPassword
  }

  compare = async ({ password, hashedPassword }: { password: string, hashedPassword: string }): Promise<boolean> => {
    const result = await this.#encrypt.compare(password, hashedPassword)
    return result
  }
}

export const Password = new PasswordEncrypt({ encrypt: bcrypt })

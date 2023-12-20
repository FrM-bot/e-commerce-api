import { APP_PASS, USER_EMAIL } from '../lib/config/index.js'
import nodemailer from 'nodemailer'

export class EmailService {
  #lib
  #remittentEmail
  constructor ({ lib, remittentEmail }: { lib: typeof nodemailer, remittentEmail?: string }) {
    this.#lib = lib
    this.#remittentEmail = remittentEmail
  }

  send = async ({ to, html = '', subject, text = 'Plaintext version of the message' }: { to: string, subject: string, html?: string | Buffer, text?: string }) => {
    const mailOptions = {
      to,
      from: this.#remittentEmail,
      subject,
      text,
      html
    }

    const transporter = this.#lib.createTransport({
      service: 'gmail',
      auth: {
        user: this.#remittentEmail,
        pass: APP_PASS
      }
    })

    const response = await transporter.sendMail(mailOptions)

    return response
  }
}

export const Email = new EmailService({ lib: nodemailer, remittentEmail: USER_EMAIL })

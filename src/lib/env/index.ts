export const {
  STRIPE_API_KEY: stripeApiKey,
  MERCADO_PAGO_ACCESS_TOKEN,
  CLIENT_URL: clientUrl = '',
  NODE_ENV = 'development',
  PORT,
  USER_EMAIL,
  APP_PASS,
  JWT_SECRET
} = process.env

export const mercadopago = {
  accessToken: MERCADO_PAGO_ACCESS_TOKEN,
  urls: {
    preferences: 'https://api.mercadopago.com/checkout/preferences'
  }
}

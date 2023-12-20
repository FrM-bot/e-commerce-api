export const mercadopagoEndpoints = {
  preferences: 'https://api.mercadopago.com/checkout/preferences',
  getPayment: (id: string) => `https://api.mercadopago.com/v1/payments/${id}`,
  getPreferences: (id: string) =>
    `https://api.mercadopago.com/checkout/preferences/${id}`
}

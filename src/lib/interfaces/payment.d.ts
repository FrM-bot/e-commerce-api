import type { Payment } from '@prisma/client'
export type { Payment } from '@prisma/client'

export type NewPayment = Omit<Payment, 'id' | 'createdAt'>

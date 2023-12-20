import { z } from 'zod'
import { addressSchema } from '@lib/schemas'

export type NewAddress = z.infer<typeof addressSchema>

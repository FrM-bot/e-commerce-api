import { type z } from 'zod'
import { type addressSchema } from '@lib/schemas'

export type NewAddress = z.infer<typeof addressSchema>

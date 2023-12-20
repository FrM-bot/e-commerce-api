import { z } from 'zod'

export const addressSchema = z.object({
  // name: z.string({ required_error: 'Name is required', invalid_type_error: 'Name must be a string' }).min(2, { message: 'Minimum name length is 1 character' }).max(150, { message: 'Maximum name length is 150 characters' }),
  // description: z.string({ required_error: 'Description is required', invalid_type_error: 'Description must be a string' }).min(1, { message: 'Minimum description length is 1 character' }),
  // category: z.string({ required_error: 'Category is required', invalid_type_error: 'Category must be a string' }).min(3, { message: 'Minimum category length is 3 characters' }).max(20, { message: 'Maximum category length is 20 characters' })
  state: z.string({ required_error: 'State is required', invalid_type_error: 'State must be a string' }).min(2, { message: 'Minimum state length is 2 characters' }).max(80, { message: 'Maximum name length is 80 characters' }),
  city: z.string({ required_error: 'State is required', invalid_type_error: 'State must be a string' }).min(2, { message: 'Minimum state length is 2 characters' }).max(80, { message: 'Maximum name length is 80 characters' }),
  code: z.string({ required_error: 'State is required', invalid_type_error: 'State must be a string' }).min(2, { message: 'Minimum state length is 2 characters' }).max(5, { message: 'Maximum length is 5 characters' }),
  mainStreet: z.string({ required_error: 'State is required', invalid_type_error: 'State must be a string' }).min(2, { message: 'Minimum state length is 2 characters' }).max(80, { message: 'Maximum name length is 80 characters' }),
  streetNumber: z.number().optional(),
  streetOne: z.string({ required_error: 'State is required', invalid_type_error: 'State must be a string' }).max(80, { message: 'Maximum name length is 80 characters' }).optional(),
  streetTwo: z.string({ required_error: 'State is required', invalid_type_error: 'State must be a string' }).max(80, { message: 'Maximum name length is 80 characters' }).optional(),
  floor: z.string().optional(),
  phone: z.string({ required_error: 'This field is required' }).min(2, { message: 'Minimum state length is 2 characters' }).max(14, { message: 'Maximum name length is 14 characters' }),
  addressType: z.string({ required_error: 'This field is required', invalid_type_error: 'State must be a string' }).min(1, { message: 'Select one option' }),
  description: z.string().optional()
})

export async function validateAddress (object: any) {
  return await addressSchema.safeParseAsync(object)
}

export async function validatePartialAddress (object: any) {
  return await addressSchema
    .partial()
    .omit({ streetNumber: true, floor: true, description: true })
    .safeParseAsync(object)
}

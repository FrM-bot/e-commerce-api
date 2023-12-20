import { z } from 'zod'

const itemSchema = z.object({
  name: z.string({ required_error: 'Name is required', invalid_type_error: 'Name must be a string' }).min(2, { message: 'Minimum name length is 1 character' }).max(150, { message: 'Maximum name length is 150 characters' }),
  description: z.string({ required_error: 'Description is required', invalid_type_error: 'Description must be a string' }).min(1, { message: 'Minimum description length is 1 character' }),
  category: z.string({ required_error: 'Category is required', invalid_type_error: 'Category must be a string' }).min(3, { message: 'Minimum category length is 3 characters' }).max(20, { message: 'Maximum category length is 20 characters' })
})

export async function validateItem (object: object) {
  return await itemSchema.safeParseAsync(object)
}

export async function validatePartialItem (object: object) {
  return await itemSchema.partial().omit({ category: true }).safeParseAsync(object)
}

export async function validateCategoryItem (object: object) {
  return await itemSchema.omit({ description: true, name: true }).safeParseAsync(object)
}

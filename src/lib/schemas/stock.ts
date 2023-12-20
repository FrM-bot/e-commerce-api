import { z } from 'zod'
// { price: number, color: string, images: string[], size: string, quantity: number }
const stockSchema = z.object({
  //   name: z.string({ required_error: 'Name is required', invalid_type_error: 'Name must be a string' }).min(2, { message: 'Minimum name length is 1 character' }).max(150, { message: 'Maximum name length is 150 characters' }),
  //   description: z.string({ required_error: 'Description is required', invalid_type_error: 'Description must be a string' }).min(1, { message: 'Minimum description length is 1 character' }),
  //   category: z.string({ required_error: 'Category is required', invalid_type_error: 'Category must be a string' }).min(3, { message: 'Minimum category length is 3 characters' }).max(20, { message: 'Maximum category length is 20 characters' })
  price: z.number().positive().min(1).max(1_000_000),
  color: z.string({ required_error: 'Color is required', invalid_type_error: 'Color must be a string' }),
  images: z.array(z.string().url({
    message: 'Image must be a valid URL'
  })).min(1),
  size: z.string(),
  quantity: z.number().positive().min(1).max(100_000)
})

export async function validateStock (object: any) {
  return await stockSchema.safeParseAsync(object)
}

export async function validatePartialStock (object: any) {
  return await stockSchema.partial().safeParseAsync(object)
}

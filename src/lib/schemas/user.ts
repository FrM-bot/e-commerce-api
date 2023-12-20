import { z } from 'zod'
// { price: number, color: string, images: string[], size: string, quantity: number }
const userSchema = z.object({
  //   name: z.string({ required_error: 'Name is required', invalid_type_error: 'Name must be a string' }).min(2, { message: 'Minimum name length is 1 character' }).max(150, { message: 'Maximum name length is 150 characters' }),
  //   description: z.string({ required_error: 'Description is required', invalid_type_error: 'Description must be a string' }).min(1, { message: 'Minimum description length is 1 character' }),
  //   category: z.string({ required_error: 'Category is required', invalid_type_error: 'Category must be a string' }).min(3, { message: 'Minimum category length is 3 characters' }).max(20, { message: 'Maximum category length is 20 characters' })
  name: z.string({ required_error: 'Name is required', invalid_type_error: 'Name must be a string' }).min(2).max(50),
  email: z.string().email().min(2).max(50),
  surname: z.string({ required_error: 'Surname is required', invalid_type_error: 'Surname must be a string' }).min(2).max(50),
  password: z.string({ required_error: 'Password is required', invalid_type_error: 'Password must be a string' }).min(2).max(50)
})

export async function validateUser (object: any) {
  return await userSchema.safeParseAsync(object)
}

export async function validatePartialUser (object: any) {
  return await userSchema.partial().safeParseAsync(object)
}

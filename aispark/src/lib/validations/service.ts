import { z } from "zod"

export const serviceSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  categoryId: z.string().min(1, { message: "Please select a category." }),
  price: z.number().positive({ message: "Price must be a positive number." }),
  duration: z.number().int().positive({ message: "Duration must be a positive integer." }),
  imageUrl: z.string().url({ message: "Please enter a valid image URL." }).optional(),
})

export const categorySchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().min(5, { message: "Description must be at least 5 characters." }),
})

export type ServiceFormValues = z.infer<typeof serviceSchema>
export type CategoryFormValues = z.infer<typeof categorySchema>

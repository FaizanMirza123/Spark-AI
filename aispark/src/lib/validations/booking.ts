import { z } from "zod"

export const bookingSchema = z.object({
  serviceId: z.string().min(1, { message: "Please select a service." }),
  scheduledDate: z.string().min(1, { message: "Please select a date." }),
  scheduledTime: z.string().min(1, { message: "Please select a time." }),
  address: z.string().min(5, { message: "Please enter a valid address." }),
  notes: z.string().optional(),
})

export type BookingFormValues = z.infer<typeof bookingSchema>

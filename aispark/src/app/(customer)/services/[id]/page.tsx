"use client"

import { use, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Star, Clock, MapPin, ChevronLeft, Shield, ThumbsUp, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { DateTimePicker } from "@/components/booking/date-time-picker"
import { bookingSchema, type BookingFormValues } from "@/lib/validations/booking"
import { useService } from "@/lib/api/use-services"

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [showBooking, setShowBooking] = useState(false)
  const [selectedDateTime, setSelectedDateTime] = useState<{ date: Date; time: string } | null>(null)

  const { data: service, isLoading } = useService(id)

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceId: id,
      scheduledDate: "",
      scheduledTime: "",
      address: "",
      notes: "",
    },
  })

  const handleDateTimeSelect = (date: Date, time: string) => {
    setSelectedDateTime({ date, time })
    form.setValue("scheduledDate", date.toISOString().split("T")[0])
    form.setValue("scheduledTime", time)
  }

  const onSubmit = (data: BookingFormValues) => {
    router.push(`/checkout?serviceId=${data.serviceId}&date=${data.scheduledDate}&time=${data.scheduledTime}`)
  }

  if (isLoading || !service) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const price = Number(service.price)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 -ml-2">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back
      </Button>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="relative h-64 overflow-hidden rounded-xl sm:h-80 lg:h-96">
              <Image src={service.imageUrl} alt={service.name} fill sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" priority />
              <div className="absolute left-4 top-4">
                <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">{service.categoryName}</Badge>
              </div>
            </div>

            <div className="mt-6">
              <h1 className="text-3xl font-bold">{service.name}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{Number(service.rating).toFixed(1)}</span>
                  <span className="text-muted-foreground">({service.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{service.duration} min</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold">About this service</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">{service.description}</p>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold">What&apos;s included</h2>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {["Professional service", "Insured & bonded", "Satisfaction guaranteed", "Quality materials"].map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="mt-8">
              <CardContent className="flex items-center gap-4 p-4">
                {service.providerAvatar && (
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <Image src={service.providerAvatar} alt={service.providerName ?? ""} fill sizes="48px" className="object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-semibold">{service.providerName ?? "Service Provider"}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <ThumbsUp className="h-3 w-3" />
                    <span>Verified Professional</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Book this service</span>
                  <span className="text-2xl font-bold text-primary">${price}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!showBooking ? (
                  <Button className="w-full" size="lg" onClick={() => setShowBooking(true)}>
                    Select Date & Time
                  </Button>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <DateTimePicker onSelect={handleDateTimeSelect} />

                      {selectedDateTime && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Service Address</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input placeholder="Enter your address" className="pl-9" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Special Instructions (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Any specific requirements..." rows={3} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="rounded-lg border p-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Service</span>
                              <span>${price.toFixed(2)}</span>
                            </div>
                            <div className="mt-1 flex justify-between">
                              <span className="text-muted-foreground">Platform fee</span>
                              <span>${(price * 0.05).toFixed(2)}</span>
                            </div>
                            <div className="mt-2 flex justify-between border-t pt-2 font-semibold">
                              <span>Total</span>
                              <span>${(price * 1.05).toFixed(2)}</span>
                            </div>
                          </div>

                          <Button type="submit" className="w-full" size="lg">
                            Proceed to Checkout
                          </Button>
                        </motion.div>
                      )}
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

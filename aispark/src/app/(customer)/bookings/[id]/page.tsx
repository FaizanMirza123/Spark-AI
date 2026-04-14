"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, MapPin, Clock, Calendar, Phone, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrackingTimeline } from "@/components/booking/tracking-timeline"
import type { BookingStatus, BookingStep } from "@/types"

const statusConfig: Record<BookingStatus, { label: string; variant: "default" | "secondary" | "destructive" | "success" | "warning" | "outline" }> = {
  pending: { label: "Pending", variant: "warning" },
  confirmed: { label: "Confirmed", variant: "default" },
  "in-progress": { label: "In Progress", variant: "secondary" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "destructive" },
}

const MOCK_BOOKING = {
  id: "b1",
  serviceName: "Deep Home Cleaning",
  serviceImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
  providerName: "CleanPro Services",
  providerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
  providerPhone: "+1 (555) 123-4567",
  date: "Dec 28, 2024",
  time: "10:00 AM",
  status: "confirmed" as BookingStatus,
  amount: 120,
  platformFee: 6,
  total: 126,
  address: "123 Main Street, Apt 4B, New York, NY 10001",
  notes: "Please bring eco-friendly cleaning products. I have a pet cat.",
  bookingRef: "BK-2024-001",
}

const MOCK_STEPS: BookingStep[] = [
  { id: 1, title: "Booking Placed", date: "Dec 26, 2024 - 3:45 PM", status: "completed" },
  { id: 2, title: "Booking Confirmed", date: "Dec 26, 2024 - 4:12 PM", status: "completed" },
  { id: 3, title: "Provider En Route", date: "Dec 28, 2024 - 9:45 AM", status: "in-progress" },
  { id: 4, title: "Service In Progress", date: "Estimated: 10:00 AM", status: "pending" },
  { id: 5, title: "Service Completed", date: "Estimated: 1:00 PM", status: "pending" },
]

export default function BookingDetailPage() {
  const router = useRouter()
  const booking = MOCK_BOOKING
  const config = statusConfig[booking.status]

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 -ml-2">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Bookings
      </Button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{booking.serviceName}</h1>
            <p className="text-sm text-muted-foreground">Ref: {booking.bookingRef}</p>
          </div>
          <Badge variant={config.variant} className="w-fit text-sm">{config.label}</Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Booking Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <TrackingTimeline items={MOCK_STEPS} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                    <Image src={booking.serviceImage} alt={booking.serviceName} fill sizes="80px" className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{booking.serviceName}</h3>
                    <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {booking.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {booking.time}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 rounded-lg border p-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Service Address</p>
                    <p className="text-sm text-muted-foreground">{booking.address}</p>
                  </div>
                </div>

                {booking.notes && (
                  <div className="flex items-start gap-2 rounded-lg border p-3">
                    <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Special Instructions</p>
                      <p className="text-sm text-muted-foreground">{booking.notes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Provider</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <Image src={booking.providerAvatar} alt={booking.providerName} fill sizes="48px" className="object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold">{booking.providerName}</p>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {booking.providerPhone}
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="mt-4 w-full">
                  Contact Provider
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service charge</span>
                  <span>${booking.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform fee</span>
                  <span>${booking.platformFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-semibold">
                  <span>Total</span>
                  <span>${booking.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {booking.status !== "completed" && booking.status !== "cancelled" && (
              <Button variant="destructive" className="w-full">
                Cancel Booking
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

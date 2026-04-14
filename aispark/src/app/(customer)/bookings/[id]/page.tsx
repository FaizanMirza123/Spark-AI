"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, MapPin, Clock, Calendar, Phone, MessageSquare, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrackingTimeline } from "@/components/booking/tracking-timeline"
import { useBooking, useUpdateBookingStatus } from "@/lib/api/use-bookings"
import type { BookingStatus, BookingStep } from "@/types"

const statusConfig: Record<BookingStatus, { label: string; variant: "default" | "secondary" | "destructive" | "success" | "warning" | "outline" }> = {
  pending: { label: "Pending", variant: "warning" },
  confirmed: { label: "Confirmed", variant: "default" },
  "in-progress": { label: "In Progress", variant: "secondary" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "destructive" },
}

function buildSteps(status: BookingStatus): BookingStep[] {
  const order: BookingStatus[] = ["pending", "confirmed", "in-progress", "completed"]
  const currentIdx = order.indexOf(status)
  if (status === "cancelled") {
    return [
      { id: 1, title: "Booking Placed", date: "", status: "completed" },
      { id: 2, title: "Cancelled", date: "", status: "completed" },
    ]
  }
  return [
    { id: 1, title: "Booking Placed", date: "", status: currentIdx >= 0 ? "completed" : "pending" },
    { id: 2, title: "Booking Confirmed", date: "", status: currentIdx >= 1 ? "completed" : currentIdx === 0 ? "in-progress" : "pending" },
    { id: 3, title: "Service In Progress", date: "", status: currentIdx >= 2 ? "completed" : currentIdx === 1 ? "in-progress" : "pending" },
    { id: 4, title: "Service Completed", date: "", status: currentIdx >= 3 ? "completed" : currentIdx === 2 ? "in-progress" : "pending" },
  ]
}

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: booking, isLoading } = useBooking(id)
  const updateStatus = useUpdateBookingStatus()

  if (isLoading || !booking) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const config = statusConfig[booking.status]
  const totalAmount = Number(booking.totalAmount)
  const servicePrice = Number(booking.service?.price ?? 0)
  const platformFee = totalAmount - servicePrice
  const steps = buildSteps(booking.status)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 -ml-2">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Bookings
      </Button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{booking.service?.name ?? "Booking"}</h1>
            <p className="text-sm text-muted-foreground">Ref: {booking.id.slice(0, 8).toUpperCase()}</p>
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
                <TrackingTimeline items={steps} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  {booking.service?.imageUrl && (
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                      <Image src={booking.service.imageUrl} alt={booking.service?.name ?? ""} fill sizes="80px" className="object-cover" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold">{booking.service?.name}</h3>
                    <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(booking.scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {booking.scheduledTime}
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
                  {booking.provider?.avatarUrl && (
                    <div className="relative h-12 w-12 overflow-hidden rounded-full">
                      <Image src={booking.provider.avatarUrl} alt={booking.provider?.name ?? ""} fill sizes="48px" className="object-cover" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{booking.provider?.name}</p>
                    {booking.provider?.phone && (
                      <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {booking.provider.phone}
                      </p>
                    )}
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
                  <span>${servicePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform fee</span>
                  <span>${platformFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-semibold">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {booking.status !== "completed" && booking.status !== "cancelled" && (
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => updateStatus.mutate({ id: booking.id, status: "cancelled" })}
                disabled={updateStatus.isPending}
              >
                {updateStatus.isPending ? "Cancelling..." : "Cancel Booking"}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

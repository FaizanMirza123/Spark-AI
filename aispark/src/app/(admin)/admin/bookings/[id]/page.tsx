"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Calendar, Clock, MapPin, MessageSquare, User, Wrench, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrackingTimeline } from "@/components/booking/tracking-timeline"
import { useBooking, useUpdateBookingStatus } from "@/lib/api/use-bookings"
import { useSettings } from "@/contexts/settings-context"
import type { BookingStatus, BookingStep } from "@/types"

const statusConfig: Record<BookingStatus, { label: string; variant: "default" | "secondary" | "destructive" | "success" | "warning" | "outline" }> = {
  pending: { label: "Pending", variant: "warning" },
  confirmed: { label: "Confirmed", variant: "default" },
  "in-progress": { label: "In Progress", variant: "secondary" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "destructive" },
}

function buildSteps(status: BookingStatus, createdAt: string, scheduledDate: string, scheduledTime: string): BookingStep[] {
  const ordered: BookingStatus[] = ["pending", "confirmed", "in-progress", "completed"]
  const idx = ordered.indexOf(status)
  const isCancelled = status === "cancelled"

  return [
    {
      id: 1,
      title: "Booking Placed",
      date: new Date(createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }),
      status: "completed",
    },
    {
      id: 2,
      title: "Booking Confirmed",
      date: isCancelled ? "Cancelled" : idx >= 1 ? "Confirmed" : "Awaiting confirmation",
      status: isCancelled ? "pending" : idx >= 1 ? "completed" : "pending",
    },
    {
      id: 3,
      title: "Provider En Route",
      date: isCancelled ? "—" : idx >= 2 ? "En route" : `Scheduled: ${scheduledDate} ${scheduledTime}`,
      status: isCancelled ? "pending" : idx >= 2 ? "completed" : "pending",
    },
    {
      id: 4,
      title: "Service In Progress",
      date: isCancelled ? "—" : idx === 2 ? "In progress" : idx > 2 ? "Completed" : "Pending",
      status: isCancelled ? "pending" : idx === 2 ? "in-progress" : idx > 2 ? "completed" : "pending",
    },
    {
      id: 5,
      title: "Service Completed",
      date: isCancelled ? "Cancelled" : idx >= 3 ? "Completed" : "Pending",
      status: isCancelled ? "pending" : idx >= 3 ? "completed" : "pending",
    },
  ]
}

export default function AdminBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: booking, isLoading } = useBooking(id)
  const updateStatus = useUpdateBookingStatus()
  const { settings, formatPrice } = useSettings()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!booking) {
    return <div className="py-20 text-center text-muted-foreground">Booking not found.</div>
  }

  const config = statusConfig[booking.status]
  const totalAmount = Number(booking.totalAmount)
  const feeRate = settings.platformFee / 100
  const serviceCharge = totalAmount / (1 + feeRate)
  const platformFee = totalAmount - serviceCharge
  const steps = buildSteps(booking.status, booking.createdAt, booking.scheduledDate, booking.scheduledTime)

  const handleConfirm = () => updateStatus.mutate({ id, status: "confirmed" })
  const handleCancel = () => {
    if (!confirm("Cancel this booking?")) return
    updateStatus.mutate({ id, status: "cancelled" })
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="-ml-2">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Bookings
      </Button>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Booking #{id.slice(0, 8).toUpperCase()}</h1>
          <p className="text-sm text-muted-foreground">
            Created {new Date(booking.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={config.variant} className="text-sm">{config.label}</Badge>
          {booking.status !== "completed" && booking.status !== "cancelled" && (
            <div className="flex gap-2">
              {booking.status === "pending" && (
                <Button size="sm" disabled={updateStatus.isPending} onClick={handleConfirm}>
                  {updateStatus.isPending && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                  Confirm
                </Button>
              )}
              <Button size="sm" variant="destructive" disabled={updateStatus.isPending} onClick={handleCancel}>
                {updateStatus.isPending && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                Cancel Booking
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <TrackingTimeline items={steps} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Wrench className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Service</p>
                    <p className="text-sm text-muted-foreground">{booking.service?.name ?? "—"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.scheduledDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Time &amp; Duration</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.scheduledTime}{booking.service?.duration ? ` (${booking.service.duration} min)` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">{booking.address}</p>
                  </div>
                </div>
              </div>
              {booking.notes && (
                <div className="flex items-start gap-3 rounded-lg border p-3">
                  <MessageSquare className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Notes from Customer</p>
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
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium">{booking.customer?.name ?? "—"}</p>
              <p className="text-muted-foreground">{booking.customer?.email ?? "—"}</p>
              {booking.customer?.phone && <p className="text-muted-foreground">{booking.customer.phone}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Provider
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium">{booking.provider?.name ?? "—"}</p>
              <p className="text-muted-foreground">{booking.provider?.email ?? "—"}</p>
              {booking.provider?.phone && <p className="text-muted-foreground">{booking.provider.phone}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service charge</span>
                <span>{formatPrice(serviceCharge)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform fee ({settings.platformFee}%)</span>
                <span>{formatPrice(platformFee)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-semibold">
                <span>Total</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft, Calendar, Clock, MapPin, MessageSquare, User, Wrench } from "lucide-react"
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
  id: "BK-001",
  customer: { name: "Sarah Wilson", email: "sarah@example.com", phone: "+1 555-0101" },
  provider: { name: "CleanPro Services", email: "info@cleanpro.com", phone: "+1 555-0201" },
  service: "Deep Home Cleaning",
  status: "confirmed" as BookingStatus,
  date: "Dec 28, 2024",
  time: "10:00 AM",
  duration: "3 hours",
  address: "123 Main Street, Apt 4B, New York, NY 10001",
  notes: "Please bring eco-friendly cleaning products. I have a pet cat.",
  amount: 120,
  platformFee: 6,
  total: 126,
  createdAt: "Dec 26, 2024 3:45 PM",
}

const MOCK_STEPS: BookingStep[] = [
  { id: 1, title: "Booking Placed", date: "Dec 26, 2024 - 3:45 PM", status: "completed" },
  { id: 2, title: "Booking Confirmed", date: "Dec 26, 2024 - 4:12 PM", status: "completed" },
  { id: 3, title: "Provider En Route", date: "Scheduled: Dec 28, 9:45 AM", status: "pending" },
  { id: 4, title: "Service In Progress", date: "Estimated: 10:00 AM", status: "pending" },
  { id: 5, title: "Service Completed", date: "Estimated: 1:00 PM", status: "pending" },
]

export default function AdminBookingDetailPage() {
  const router = useRouter()
  const booking = MOCK_BOOKING
  const config = statusConfig[booking.status]

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="-ml-2">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Bookings
      </Button>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Booking {booking.id}</h1>
          <p className="text-sm text-muted-foreground">Created {booking.createdAt}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={config.variant} className="text-sm">{config.label}</Badge>
          {booking.status !== "completed" && booking.status !== "cancelled" && (
            <div className="flex gap-2">
              {booking.status === "pending" && <Button size="sm">Confirm</Button>}
              <Button size="sm" variant="destructive">Cancel Booking</Button>
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
              <TrackingTimeline items={MOCK_STEPS} />
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
                    <p className="text-sm text-muted-foreground">{booking.service}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">{booking.date}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Time & Duration</p>
                    <p className="text-sm text-muted-foreground">{booking.time} ({booking.duration})</p>
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
                    <p className="text-sm font-medium">Notes</p>
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
              <p className="font-medium">{booking.customer.name}</p>
              <p className="text-muted-foreground">{booking.customer.email}</p>
              <p className="text-muted-foreground">{booking.customer.phone}</p>
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
              <p className="font-medium">{booking.provider.name}</p>
              <p className="text-muted-foreground">{booking.provider.email}</p>
              <p className="text-muted-foreground">{booking.provider.phone}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
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
        </div>
      </div>
    </div>
  )
}

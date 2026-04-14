"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Filter, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookingCard } from "@/components/booking/booking-card"
import { useBookings } from "@/lib/api/use-bookings"
import type { BookingStatus } from "@/types"

const TABS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
]

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const { data: bookings = [], isLoading } = useBookings(
    activeTab !== "all" ? { status: activeTab } : {},
  )

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
          <p className="mt-2 text-muted-foreground">Track and manage your service bookings</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-6 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : bookings.length > 0 ? (
            bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <BookingCard
                  id={booking.id}
                  serviceName={booking.service?.name ?? ""}
                  serviceImage={booking.service?.imageUrl ?? ""}
                  providerName={booking.provider?.name ?? ""}
                  date={new Date(booking.scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  time={booking.scheduledTime}
                  status={booking.status}
                  amount={Number(booking.totalAmount)}
                />
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Filter className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-lg font-medium">No bookings found</p>
              <p className="mt-1 text-sm text-muted-foreground">You don&apos;t have any {activeTab !== "all" ? activeTab : ""} bookings yet</p>
              <Button className="mt-4" asChild>
                <a href="/services">Browse Services</a>
              </Button>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  )
}

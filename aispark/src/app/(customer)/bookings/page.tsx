"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookingCard } from "@/components/booking/booking-card"
import type { BookingStatus } from "@/types"

const MOCK_BOOKINGS = [
  { id: "b1", serviceName: "Deep Home Cleaning", serviceImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80", providerName: "CleanPro Services", date: "Dec 28, 2024", time: "10:00 AM", status: "confirmed" as BookingStatus, amount: 126 },
  { id: "b2", serviceName: "Pipe Repair", serviceImage: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&q=80", providerName: "FixIt Plumbing", date: "Dec 22, 2024", time: "2:00 PM", status: "completed" as BookingStatus, amount: 89.25 },
  { id: "b3", serviceName: "Electrical Wiring", serviceImage: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80", providerName: "Spark Electric Co.", date: "Jan 3, 2025", time: "9:00 AM", status: "pending" as BookingStatus, amount: 99.75 },
  { id: "b4", serviceName: "Interior Painting", serviceImage: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&q=80", providerName: "ColorMaster Painters", date: "Dec 15, 2024", time: "8:00 AM", status: "completed" as BookingStatus, amount: 210 },
  { id: "b5", serviceName: "Lawn Maintenance", serviceImage: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=80", providerName: "GreenThumb Gardens", date: "Dec 10, 2024", time: "11:00 AM", status: "cancelled" as BookingStatus, amount: 78.75 },
  { id: "b6", serviceName: "Furniture Assembly", serviceImage: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&q=80", providerName: "WoodWorks Pro", date: "Jan 5, 2025", time: "3:00 PM", status: "pending" as BookingStatus, amount: 63 },
]

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

  const filteredBookings = activeTab === "all"
    ? MOCK_BOOKINGS
    : MOCK_BOOKINGS.filter((b) => b.status === activeTab)

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
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <BookingCard {...booking} />
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

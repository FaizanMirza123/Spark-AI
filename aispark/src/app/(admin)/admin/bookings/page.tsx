"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { BookingStatus } from "@/types"

const statusConfig: Record<BookingStatus, { label: string; variant: "default" | "secondary" | "destructive" | "success" | "warning" | "outline" }> = {
  pending: { label: "Pending", variant: "warning" },
  confirmed: { label: "Confirmed", variant: "default" },
  "in-progress": { label: "In Progress", variant: "secondary" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "destructive" },
}

const MOCK_BOOKINGS = [
  { id: "BK-001", customer: "Sarah Wilson", service: "Deep Home Cleaning", provider: "CleanPro Services", amount: 126, status: "confirmed" as BookingStatus, date: "Dec 28, 2024", time: "10:00 AM" },
  { id: "BK-002", customer: "Mike Chen", service: "Pipe Repair", provider: "FixIt Plumbing", amount: 89.25, status: "in-progress" as BookingStatus, date: "Dec 27, 2024", time: "2:00 PM" },
  { id: "BK-003", customer: "Emily Davis", service: "Electrical Wiring", provider: "Spark Electric", amount: 99.75, status: "pending" as BookingStatus, date: "Jan 3, 2025", time: "9:00 AM" },
  { id: "BK-004", customer: "James Brown", service: "Interior Painting", provider: "ColorMaster", amount: 210, status: "completed" as BookingStatus, date: "Dec 15, 2024", time: "8:00 AM" },
  { id: "BK-005", customer: "Lisa Taylor", service: "Lawn Maintenance", provider: "GreenThumb", amount: 78.75, status: "cancelled" as BookingStatus, date: "Dec 10, 2024", time: "11:00 AM" },
  { id: "BK-006", customer: "Robert Martinez", service: "Furniture Assembly", provider: "WoodWorks Pro", amount: 63, status: "pending" as BookingStatus, date: "Jan 5, 2025", time: "3:00 PM" },
  { id: "BK-007", customer: "Anna Lee", service: "Bathroom Cleaning", provider: "CleanPro Services", amount: 52.5, status: "completed" as BookingStatus, date: "Dec 8, 2024", time: "1:00 PM" },
]

const TABS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
]

export default function AdminBookingsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredBookings = MOCK_BOOKINGS.filter((b) => {
    const matchesSearch = searchQuery === "" || b.customer.toLowerCase().includes(searchQuery.toLowerCase()) || b.service.toLowerCase().includes(searchQuery.toLowerCase()) || b.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === "all" || b.status === activeTab
    return matchesSearch && matchesTab
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
        <p className="text-muted-foreground">Monitor and manage all bookings on the platform</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
                className="w-72 pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                {TABS.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => {
                const config = statusConfig[booking.status]
                return (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.id}</TableCell>
                    <TableCell>{booking.customer}</TableCell>
                    <TableCell>{booking.service}</TableCell>
                    <TableCell className="text-muted-foreground">{booking.provider}</TableCell>
                    <TableCell className="text-muted-foreground">{booking.date}</TableCell>
                    <TableCell className="font-medium">${booking.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={config.variant}>{config.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/bookings/${booking.id}`}>View Details</Link>
                          </DropdownMenuItem>
                          {booking.status === "pending" && <DropdownMenuItem>Confirm</DropdownMenuItem>}
                          {booking.status !== "completed" && booking.status !== "cancelled" && (
                            <DropdownMenuItem className="text-destructive">Cancel</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {filteredBookings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg font-medium">No bookings found</p>
              <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

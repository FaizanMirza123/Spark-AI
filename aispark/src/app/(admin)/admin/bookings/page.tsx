"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, MoreHorizontal, Loader2 } from "lucide-react"
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
import { useBookings, useUpdateBookingStatus } from "@/lib/api/use-bookings"
import type { BookingStatus } from "@/types"

const statusConfig: Record<BookingStatus, { label: string; variant: "default" | "secondary" | "destructive" | "success" | "warning" | "outline" }> = {
  pending: { label: "Pending", variant: "warning" },
  confirmed: { label: "Confirmed", variant: "default" },
  "in-progress": { label: "In Progress", variant: "secondary" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "destructive" },
}

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
  const { data: bookings = [], isLoading } = useBookings(
    activeTab !== "all" ? { status: activeTab } : {},
  )
  const updateStatus = useUpdateBookingStatus()

  const filteredBookings = bookings.filter((b) => {
    const customerName = (b.customer?.name ?? "").toLowerCase()
    const serviceName = (b.service?.name ?? "").toLowerCase()
    const q = searchQuery.toLowerCase()
    return searchQuery === "" || customerName.includes(q) || serviceName.includes(q) || b.id.toLowerCase().includes(q)
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
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
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
                        <TableCell className="font-medium">{booking.id.slice(0, 8).toUpperCase()}</TableCell>
                        <TableCell>{booking.customer?.name ?? "—"}</TableCell>
                        <TableCell>{booking.service?.name ?? "—"}</TableCell>
                        <TableCell className="text-muted-foreground">{booking.provider?.name ?? "—"}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(booking.scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </TableCell>
                        <TableCell className="font-medium">${Number(booking.totalAmount).toFixed(2)}</TableCell>
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
                              {booking.status === "pending" && (
                                <DropdownMenuItem onClick={() => updateStatus.mutate({ id: booking.id, status: "confirmed" })}>
                                  Confirm
                                </DropdownMenuItem>
                              )}
                              {booking.status !== "completed" && booking.status !== "cancelled" && (
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => updateStatus.mutate({ id: booking.id, status: "cancelled" })}
                                >
                                  Cancel
                                </DropdownMenuItem>
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

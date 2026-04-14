"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft, Mail, Phone, MapPin, Calendar, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const MOCK_USER = {
  id: "u1",
  name: "Sarah Wilson",
  email: "sarah@example.com",
  role: "customer" as const,
  phone: "+1 555-0101",
  address: "123 Main St, New York, NY 10001",
  isActive: true,
  createdAt: "Nov 15, 2024",
  avatarUrl: "",
  totalBookings: 12,
  totalSpent: "$1,512.00",
  completedBookings: 9,
  cancelledBookings: 1,
}

const RECENT_ACTIVITY = [
  { id: 1, action: "Booked Deep Home Cleaning", date: "Dec 28, 2024", amount: "$126.00" },
  { id: 2, action: "Completed Pipe Repair", date: "Dec 22, 2024", amount: "$89.25" },
  { id: 3, action: "Booked Electrical Wiring", date: "Dec 20, 2024", amount: "$99.75" },
  { id: 4, action: "Cancelled Lawn Maintenance", date: "Dec 10, 2024", amount: "$78.75" },
]

export default function AdminUserDetailPage() {
  const router = useRouter()
  const user = MOCK_USER

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="-ml-2">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Users
      </Button>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="space-y-6 lg:w-80">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback className="text-lg">{user.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">{user.role}</Badge>
                  <Badge variant={user.isActive ? "success" : "destructive"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{user.address}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {user.createdAt}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Button variant={user.isActive ? "destructive" : "default"} className="flex-1">
                  {user.isActive ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="mt-1 text-2xl font-bold">{user.totalBookings}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="mt-1 text-2xl font-bold">{user.totalSpent}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="mt-1 text-2xl font-bold">{user.completedBookings}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Cancelled</p>
                <p className="mt-1 text-2xl font-bold">{user.cancelledBookings}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {RECENT_ACTIVITY.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                    <span className="text-sm font-medium">{activity.amount}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

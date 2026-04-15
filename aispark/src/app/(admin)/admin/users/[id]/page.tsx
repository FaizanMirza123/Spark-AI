"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Mail, Phone, MapPin, Calendar, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser, useToggleUserStatus, useDeleteUser } from "@/lib/api/use-users"

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data, isLoading } = useUser(id)
  const toggleStatus = useToggleUserStatus()
  const deleteUser = useDeleteUser()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!data) {
    return <div className="py-20 text-center text-muted-foreground">User not found.</div>
  }

  const user = data as typeof data & {
    stats?: { totalBookings: number; completedBookings: number; cancelledBookings: number; totalSpent: number }
    recentActivity?: Array<{ id: string; action: string; date: string; amount: string }>
  }

  const handleDelete = () => {
    if (!confirm(`Delete ${user.name}? This cannot be undone.`)) return
    deleteUser.mutate(id, { onSuccess: () => router.push("/admin/users") })
  }

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
                {user.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.address && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{user.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <Button
                  variant={user.isActive ? "destructive" : "default"}
                  className="w-full"
                  disabled={toggleStatus.isPending}
                  onClick={() => toggleStatus.mutate({ id, isActive: !user.isActive })}
                >
                  {toggleStatus.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {user.isActive ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive"
                  disabled={deleteUser.isPending}
                  onClick={handleDelete}
                >
                  {deleteUser.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete User
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total Bookings</p><p className="mt-1 text-2xl font-bold">{user.stats?.totalBookings ?? 0}</p></CardContent></Card>
            <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total {user.role === "provider" ? "Earned" : "Spent"}</p><p className="mt-1 text-2xl font-bold">${Number(user.stats?.totalSpent ?? 0).toFixed(2)}</p></CardContent></Card>
            <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Completed</p><p className="mt-1 text-2xl font-bold">{user.stats?.completedBookings ?? 0}</p></CardContent></Card>
            <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Cancelled</p><p className="mt-1 text-2xl font-bold">{user.stats?.cancelledBookings ?? 0}</p></CardContent></Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
            <CardContent>
              {user.recentActivity?.length ? (
                <div className="space-y-4">
                  {user.recentActivity.map((a) => (
                    <div key={a.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{a.action}</p>
                        <p className="text-xs text-muted-foreground">{a.date}</p>
                      </div>
                      <span className="text-sm font-medium">{a.amount}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No recent activity.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, MoreHorizontal, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { UserRole } from "@/types"

const MOCK_USERS = [
  { id: "u1", name: "Sarah Wilson", email: "sarah@example.com", role: "customer" as UserRole, phone: "+1 555-0101", isActive: true, bookings: 12, createdAt: "Nov 15, 2024", avatarUrl: "" },
  { id: "u2", name: "Mike Chen", email: "mike@example.com", role: "provider" as UserRole, phone: "+1 555-0102", isActive: true, bookings: 0, createdAt: "Oct 22, 2024", avatarUrl: "" },
  { id: "u3", name: "Emily Davis", email: "emily@example.com", role: "customer" as UserRole, phone: "+1 555-0103", isActive: true, bookings: 8, createdAt: "Dec 1, 2024", avatarUrl: "" },
  { id: "u4", name: "James Brown", email: "james@example.com", role: "provider" as UserRole, phone: "+1 555-0104", isActive: false, bookings: 0, createdAt: "Sep 10, 2024", avatarUrl: "" },
  { id: "u5", name: "Lisa Taylor", email: "lisa@example.com", role: "customer" as UserRole, phone: "+1 555-0105", isActive: true, bookings: 3, createdAt: "Dec 10, 2024", avatarUrl: "" },
  { id: "u6", name: "Robert Martinez", email: "robert@example.com", role: "provider" as UserRole, phone: "+1 555-0106", isActive: true, bookings: 0, createdAt: "Nov 5, 2024", avatarUrl: "" },
  { id: "u7", name: "Anna Lee", email: "anna@example.com", role: "customer" as UserRole, phone: "+1 555-0107", isActive: false, bookings: 1, createdAt: "Aug 20, 2024", avatarUrl: "" },
]

function UserTable({ users }: { users: typeof MOCK_USERS }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback className="text-xs">{user.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="capitalize">{user.role}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant={user.isActive ? "success" : "destructive"}>
                {user.isActive ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">{user.createdAt}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/users/${user.id}`}>View Details</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>{user.isActive ? "Deactivate" : "Activate"}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">Delete User</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredUsers = MOCK_USERS.filter((user) => {
    const matchesSearch = searchQuery === "" || user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === "all" || user.role === activeTab
    return matchesSearch && matchesTab
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage platform users and their roles</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="w-72 pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="customer">Customers</TabsTrigger>
                <TabsTrigger value="provider">Providers</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {filteredUsers.length > 0 ? (
            <UserTable users={filteredUsers} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg font-medium">No users found</p>
              <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Plus, MoreHorizontal, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

const MOCK_SERVICES = [
  { id: "s1", name: "Deep Home Cleaning", category: "Home Cleaning", price: 120, duration: 180, rating: 4.8, reviewCount: 124, isActive: true, imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=100&q=80", provider: "CleanPro Services" },
  { id: "s2", name: "Pipe Repair", category: "Plumbing", price: 85, duration: 90, rating: 4.7, reviewCount: 89, isActive: true, imageUrl: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=100&q=80", provider: "FixIt Plumbing" },
  { id: "s3", name: "Electrical Wiring", category: "Electrical", price: 95, duration: 120, rating: 4.9, reviewCount: 67, isActive: true, imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=100&q=80", provider: "Spark Electric" },
  { id: "s4", name: "Interior Painting", category: "Painting", price: 200, duration: 480, rating: 4.6, reviewCount: 45, isActive: false, imageUrl: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=100&q=80", provider: "ColorMaster" },
  { id: "s5", name: "Furniture Assembly", category: "Carpentry", price: 60, duration: 60, rating: 4.5, reviewCount: 38, isActive: true, imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=100&q=80", provider: "WoodWorks Pro" },
  { id: "s6", name: "Lawn Maintenance", category: "Landscaping", price: 75, duration: 120, rating: 4.8, reviewCount: 95, isActive: true, imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=100&q=80", provider: "GreenThumb" },
]

export default function AdminServicesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredServices = MOCK_SERVICES.filter(
    (s) => searchQuery === "" || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">Manage all services on the platform</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search services or categories..."
              className="w-72 pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md">
                        <Image src={service.imageUrl} alt={service.name} fill sizes="40px" className="object-cover" />
                      </div>
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-xs text-muted-foreground">{service.duration} min</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{service.category}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{service.provider}</TableCell>
                  <TableCell className="font-medium">${service.price}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm">{service.rating}</span>
                      <span className="text-xs text-muted-foreground">({service.reviewCount})</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={service.isActive ? "success" : "destructive"}>
                      {service.isActive ? "Active" : "Inactive"}
                    </Badge>
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
                          <Link href={`/admin/services/${service.id}`}>Edit Service</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>{service.isActive ? "Deactivate" : "Activate"}</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredServices.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg font-medium">No services found</p>
              <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search query</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

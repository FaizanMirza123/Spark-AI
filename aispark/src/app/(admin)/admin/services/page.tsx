"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Plus, MoreHorizontal, Star, Loader2 } from "lucide-react"
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
import { useServices } from "@/lib/api/use-services"

export default function AdminServicesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { data: services = [], isLoading } = useServices()

  const filteredServices = services.filter(
    (s) =>
      searchQuery === "" ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.categoryName ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
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
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
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
                    <Badge variant="outline">{service.categoryName ?? ""}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{service.providerName ?? ""}</TableCell>
                  <TableCell className="font-medium">${Number(service.price).toFixed(0)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm">{Number(service.rating).toFixed(1)}</span>
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

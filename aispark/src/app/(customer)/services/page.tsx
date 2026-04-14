"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ServiceCard } from "@/components/service/service-card"
import { ServiceFilter } from "@/components/service/service-filter"

const MOCK_CATEGORIES = [
  { id: "1", name: "Home Cleaning" },
  { id: "2", name: "Plumbing" },
  { id: "3", name: "Electrical" },
  { id: "4", name: "Painting" },
  { id: "5", name: "Carpentry" },
  { id: "6", name: "Landscaping" },
]

const MOCK_SERVICES = [
  { id: "1", name: "Deep Home Cleaning", description: "Professional deep cleaning for your entire home including kitchen, bathrooms, and living areas.", price: 120, duration: 180, imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80", rating: 4.8, reviewCount: 124, categoryId: "1", categoryName: "Home Cleaning" },
  { id: "2", name: "Pipe Repair", description: "Expert pipe repair and replacement service for all types of plumbing emergencies.", price: 85, duration: 90, imageUrl: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&q=80", rating: 4.7, reviewCount: 89, categoryId: "2", categoryName: "Plumbing" },
  { id: "3", name: "Electrical Wiring", description: "Safe and certified electrical wiring installation and repair for homes and offices.", price: 95, duration: 120, imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80", rating: 4.9, reviewCount: 67, categoryId: "3", categoryName: "Electrical" },
  { id: "4", name: "Interior Painting", description: "Transform your space with professional interior painting services and premium paints.", price: 200, duration: 480, imageUrl: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&q=80", rating: 4.6, reviewCount: 45, categoryId: "4", categoryName: "Painting" },
  { id: "5", name: "Furniture Assembly", description: "Professional furniture assembly for all major brands and custom pieces.", price: 60, duration: 60, imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&q=80", rating: 4.5, reviewCount: 38, categoryId: "5", categoryName: "Carpentry" },
  { id: "6", name: "Lawn Maintenance", description: "Complete lawn care service including mowing, edging, and fertilization.", price: 75, duration: 120, imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=80", rating: 4.8, reviewCount: 95, categoryId: "6", categoryName: "Landscaping" },
  { id: "7", name: "Bathroom Cleaning", description: "Thorough bathroom cleaning and sanitization with eco-friendly products.", price: 50, duration: 60, imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80", rating: 4.7, reviewCount: 156, categoryId: "1", categoryName: "Home Cleaning" },
  { id: "8", name: "Drain Unclogging", description: "Fast and effective drain unclogging service for sinks, tubs and floor drains.", price: 70, duration: 45, imageUrl: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&q=80", rating: 4.6, reviewCount: 72, categoryId: "2", categoryName: "Plumbing" },
  { id: "9", name: "Light Installation", description: "Professional light fixture installation including chandeliers and recessed lighting.", price: 55, duration: 60, imageUrl: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&q=80", rating: 4.8, reviewCount: 54, categoryId: "3", categoryName: "Electrical" },
]

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredServices = MOCK_SERVICES.filter((service) => {
    const matchesCategory = selectedCategory === "" || service.categoryId === selectedCategory
    const matchesSearch = searchQuery === "" || service.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Services</h1>
        <p className="mt-2 text-muted-foreground">Browse and book professional services</p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-64">
          <div className="sticky top-24 space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <ServiceFilter
              categories={MOCK_CATEGORIES}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-4 text-sm text-muted-foreground">
            {filteredServices.length} service{filteredServices.length !== 1 ? "s" : ""} found
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
          {filteredServices.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-lg font-medium">No services found</p>
              <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

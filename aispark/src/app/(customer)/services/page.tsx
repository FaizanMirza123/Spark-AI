"use client"

import { useState } from "react"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ServiceCard } from "@/components/service/service-card"
import { ServiceFilter } from "@/components/service/service-filter"
import { useServices, useCategories } from "@/lib/api/use-services"

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const { data: categories = [] } = useCategories()
  const { data: services = [], isLoading } = useServices(
    selectedCategory ? { category: selectedCategory } : {},
  )

  const filteredServices = services.filter(
    (s) => searchQuery === "" || s.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
              categories={categories.map((c) => ({ id: c.slug, name: c.name }))}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </aside>

        <div className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}

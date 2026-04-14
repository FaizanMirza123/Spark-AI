"use client"

import { cn } from "@/lib/utils"

interface ServiceFilterProps {
  categories: { id: string; name: string }[]
  selectedCategory: string
  onCategoryChange: (id: string) => void
}

export function ServiceFilter({ categories, selectedCategory, onCategoryChange }: ServiceFilterProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Categories</h3>
      <div className="space-y-1">
        <button
          onClick={() => onCategoryChange("")}
          className={cn(
            "w-full rounded-md px-3 py-2 text-left text-sm transition-colors",
            selectedCategory === "" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
          )}
        >
          All Services
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "w-full rounded-md px-3 py-2 text-left text-sm transition-colors",
              selectedCategory === category.id ? "bg-primary text-primary-foreground" : "hover:bg-accent"
            )}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}

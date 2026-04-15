"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ServiceCardProps {
  id: string
  name: string
  description: string
  price: number
  duration: number
  imageUrl: string
  rating: number
  reviewCount: number
  categoryName: string
}

export function ServiceCard({
  id,
  name,
  description,
  price,
  duration,
  imageUrl,
  rating,
  reviewCount,
  categoryName,
}: ServiceCardProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      className="transform-gpu cursor-pointer"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 18,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * -18,
        })
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMousePos({ x: 0, y: 0 }) }}
      animate={{ rotateX: mousePos.y, rotateY: mousePos.x, y: hovered ? -4 : 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
    >
      <motion.div
        className="pointer-events-none absolute -inset-0.5 rounded-xl blur-sm"
        style={{ background: "linear-gradient(135deg, hsl(var(--primary)/0.4), hsl(var(--primary)/0.1))" }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      <Card
        className="overflow-hidden border shadow-sm"
        style={{ transform: hovered ? "translateZ(8px)" : "translateZ(0)", boxShadow: hovered ? "0 20px 40px -10px rgba(0,0,0,0.15)" : undefined, transition: "box-shadow 0.3s" }}
      >
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500"
            style={{ transform: hovered ? "scale(1.06)" : "scale(1)" }}
          />
          <div className="absolute left-3 top-3 rounded-full bg-background/90 px-2 py-1 text-xs font-medium backdrop-blur-sm">
            {categoryName}
          </div>
          <motion.div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 60%)" }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold">{name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{description}</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium">{Number(rating).toFixed(1)}</span>
            </div>
            <span className="text-sm text-muted-foreground">({reviewCount} reviews)</span>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t px-4 py-3">
          <div>
            <span className="text-lg font-bold">${Number(price).toFixed(0)}</span>
            <span className="text-sm text-muted-foreground"> / {duration}min</span>
          </div>
          <Button asChild size="sm">
            <Link href={`/services/${id}`}>Book Now</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

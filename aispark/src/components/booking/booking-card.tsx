"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { BookingStatus } from "@/types"

interface BookingCardProps {
  id: string
  serviceName: string
  serviceImage: string
  providerName: string
  date: string
  time: string
  status: BookingStatus
  amount: number
}

const statusConfig: Record<BookingStatus, { label: string; variant: "default" | "secondary" | "destructive" | "success" | "warning" | "outline" }> = {
  pending: { label: "Pending", variant: "warning" },
  confirmed: { label: "Confirmed", variant: "default" },
  "in-progress": { label: "In Progress", variant: "secondary" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "destructive" },
}

export function BookingCard({ id, serviceName, serviceImage, providerName, date, time, status, amount }: BookingCardProps) {
  const config = statusConfig[status]
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  return (
    <Link href={`/bookings/${id}`}>
      <motion.div
        className="transform-gpu"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          setMousePos({
            x: ((e.clientX - rect.left) / rect.width - 0.5) * 12,
            y: ((e.clientY - rect.top) / rect.height - 0.5) * -12,
          })
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setMousePos({ x: 0, y: 0 }) }}
        animate={{ rotateX: mousePos.y, rotateY: mousePos.x, y: hovered ? -3 : 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        style={{ transformStyle: "preserve-3d", perspective: "800px" }}
      >
        <Card
          className="overflow-hidden border"
          style={{ boxShadow: hovered ? "0 16px 32px -8px rgba(0,0,0,0.12)" : "0 1px 3px rgba(0,0,0,0.08)", transition: "box-shadow 0.3s" }}
        >
          <div className="flex">
            <div className="relative h-32 w-32 shrink-0 overflow-hidden">
              <Image
                src={serviceImage}
                alt={serviceName}
                fill
                sizes="128px"
                className="object-cover transition-transform duration-500"
                style={{ transform: hovered ? "scale(1.06)" : "scale(1)" }}
              />
            </div>
            <CardContent className="flex flex-1 flex-col justify-between p-4">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{serviceName}</h3>
                  <Badge variant={config.variant}>{config.label}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">by {providerName}</p>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{date} at {time}</span>
                <span className="font-semibold">${amount.toFixed(2)}</span>
              </div>
            </CardContent>
          </div>
        </Card>
      </motion.div>
    </Link>
  )
}

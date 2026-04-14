"use client"

import { motion } from "framer-motion"
import {
  DollarSign, Users, CalendarCheck, TrendingUp,
  Activity, Loader2
} from "lucide-react"
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { KpiCard } from "@/components/admin/kpi-card"
import { Badge } from "@/components/ui/badge"
import { useDashboard } from "@/lib/api/use-users"
import type { BookingStatus } from "@/types"

const MONTHLY_REVENUE = [
  { month: "Jul", revenue: 28400, bookings: 310 },
  { month: "Aug", revenue: 31200, bookings: 340 },
  { month: "Sep", revenue: 27800, bookings: 298 },
  { month: "Oct", revenue: 35600, bookings: 412 },
  { month: "Nov", revenue: 39100, bookings: 467 },
  { month: "Dec", revenue: 42800, bookings: 520 },
  { month: "Jan", revenue: 38900, bookings: 448 },
  { month: "Feb", revenue: 41200, bookings: 489 },
  { month: "Mar", revenue: 44500, bookings: 531 },
  { month: "Apr", revenue: 45231, bookings: 573 },
]

const CATEGORY_DATA = [
  { name: "Cleaning", value: 245, fill: "#6366f1" },
  { name: "Plumbing", value: 187, fill: "#8b5cf6" },
  { name: "Electrical", value: 156, fill: "#a78bfa" },
  { name: "Painting", value: 134, fill: "#c4b5fd" },
  { name: "Carpentry", value: 98, fill: "#ddd6fe" },
]

const WEEKLY_USERS = [
  { day: "Mon", new: 48, returning: 120 },
  { day: "Tue", new: 62, returning: 145 },
  { day: "Wed", new: 55, returning: 132 },
  { day: "Thu", new: 71, returning: 158 },
  { day: "Fri", new: 84, returning: 176 },
  { day: "Sat", new: 95, returning: 189 },
  { day: "Sun", new: 42, returning: 98 },
]

const statusConfig: Record<BookingStatus, { label: string; variant: "default" | "secondary" | "destructive" | "success" | "warning" | "outline" }> = {
  pending: { label: "Pending", variant: "warning" },
  confirmed: { label: "Confirmed", variant: "default" },
  "in-progress": { label: "In Progress", variant: "secondary" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "destructive" },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border bg-background p-3 shadow-lg text-sm">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-muted-foreground">
            {p.name}: <span className="font-medium text-foreground">{typeof p.value === "number" && p.name === "revenue" ? `$${p.value.toLocaleString()}` : p.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function AdminDashboardPage() {
  const { data: dashboard, isLoading } = useDashboard()
  const kpis = dashboard?.kpis
  const recentBookings = (dashboard?.recentBookings ?? []) as Array<{
    id: string; status: BookingStatus; scheduledDate: string; totalAmount: number;
    customer?: { name: string }; service?: { name: string }
  }>
  const topServices = (dashboard?.topServices ?? []) as Array<{
    id: string; name: string; bookingCount: number
  }>

  const KPI_DATA = [
    { title: "Total Revenue", value: kpis ? `$${Number(kpis.totalRevenue).toLocaleString()}` : "—", change: 0, changeLabel: "", icon: DollarSign },
    { title: "Total Users", value: kpis ? Number(kpis.totalUsers).toLocaleString() : "—", change: 0, changeLabel: "", icon: Users },
    { title: "Total Bookings", value: kpis ? Number(kpis.totalBookings).toLocaleString() : "—", change: 0, changeLabel: "", icon: CalendarCheck },
    { title: "Total Services", value: kpis ? Number(kpis.totalServices).toLocaleString() : "—", change: 0, changeLabel: "", icon: TrendingUp },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div variants={stagger} initial="hidden" animate="show">
        <motion.div variants={fadeUp}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Platform performance overview — April 2026</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm">
              <Activity className="h-4 w-4 text-emerald-500" />
              <span className="font-medium">Live</span>
            </div>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div variants={fadeUp} className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {KPI_DATA.map((kpi) => (
            <KpiCard key={kpi.title} {...kpi} />
          ))}
        </motion.div>

        {/* Revenue & Bookings Area Chart */}
        <motion.div variants={fadeUp} className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Revenue & Bookings Trend</CardTitle>
                  <CardDescription>10-month rolling overview</CardDescription>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" />Revenue</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary/30" />Bookings</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={MONTHLY_REVENUE} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="bookingsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} yAxisId="left" />
                  <YAxis orientation="right" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} yAxisId="right" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#revenueGrad)" yAxisId="left" name="revenue" />
                  <Area type="monotone" dataKey="bookings" stroke="hsl(var(--primary))" strokeWidth={1.5} strokeDasharray="4 2" fill="url(#bookingsGrad)" yAxisId="right" name="bookings" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Middle row: Pie + Bar */}
        <motion.div variants={fadeUp} className="mt-6 grid gap-6 lg:grid-cols-5">
          {/* Pie Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Bookings by Category</CardTitle>
              <CardDescription>Current month distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                    {CATEGORY_DATA.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v} bookings`, ""]} />
                  <Legend iconType="circle" iconSize={8} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bar Chart: weekly users */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Weekly User Activity</CardTitle>
              <CardDescription>New vs returning users this week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={WEEKLY_USERS} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="new" name="new" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={24} />
                  <Bar dataKey="returning" name="returning" fill="hsl(var(--primary) / 0.3)" radius={[4, 4, 0, 0]} maxBarSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bottom row: Bookings + Top Services */}
        <motion.div variants={fadeUp} className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => {
                  const config = statusConfig[booking.status]
                  const custName = booking.customer?.name ?? "Unknown"
                  return (
                    <div key={booking.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-medium">
                          {custName.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{custName}</p>
                          <p className="text-xs text-muted-foreground">
                            {booking.service?.name ?? "—"} · {new Date(booking.scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">${Number(booking.totalAmount).toFixed(2)}</span>
                        <Badge variant={config.variant} className="text-xs">{config.label}</Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topServices.map((service, index) => (
                  <div key={service.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{service.name}</p>
                        <p className="text-xs text-muted-foreground">{service.bookingCount} bookings</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}




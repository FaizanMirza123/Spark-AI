export type UserRole = "customer" | "provider" | "admin"

export type BookingStatus = "pending" | "confirmed" | "in-progress" | "completed" | "cancelled"

export type ServiceCategory = {
  id: string
  name: string
  slug: string
  description: string
  imageUrl: string
}

export type Service = {
  id: string
  name: string
  description: string
  categoryId: string
  category: ServiceCategory
  price: number
  duration: number
  imageUrl: string
  rating: number
  reviewCount: number
  providerId: string
  isActive: boolean
  createdAt: string
}

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  avatarUrl: string
  phone: string
  address: string
  isActive: boolean
  createdAt: string
}

export type Booking = {
  id: string
  customerId: string
  customer: User
  serviceId: string
  service: Service
  providerId: string
  provider: User
  status: BookingStatus
  scheduledDate: string
  scheduledTime: string
  address: string
  totalAmount: number
  notes: string
  createdAt: string
  updatedAt: string
}

export type BookingStep = {
  id: number
  title: string
  date: string
  status: "completed" | "in-progress" | "pending"
}

export type KpiData = {
  label: string
  value: string | number
  change: number
  changeLabel: string
}

export type AuthUser = {
  id: string
  name: string
  email: string
  role: UserRole
  avatarUrl: string
}

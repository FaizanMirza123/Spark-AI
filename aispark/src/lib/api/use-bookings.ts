import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "./client"
import { queryKeys } from "./query-keys"
import type { Booking } from "@/types"
import type { BookingFormValues } from "@/lib/validations/booking"

export function useBookings(filters: Record<string, string> = {}) {
  return useQuery({
    queryKey: queryKeys.bookings.list(filters),
    queryFn: () => {
      const params = new URLSearchParams(filters).toString()
      return apiClient.get<Booking[]>(`/bookings${params ? `?${params}` : ""}`)
    },
  })
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: queryKeys.bookings.detail(id),
    queryFn: () => apiClient.get<Booking>(`/bookings/${id}`),
    enabled: !!id,
  })
}

export function useCreateBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: BookingFormValues) => apiClient.post<Booking>("/bookings", data as unknown as Record<string, unknown>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all })
    },
  })
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiClient.patch<Booking>(`/bookings/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all })
    },
  })
}

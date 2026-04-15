import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "./client"
import { queryKeys } from "./query-keys"
import type { User } from "@/types"
import type { ProfileFormValues, ChangePasswordFormValues } from "@/lib/validations/profile"

export function useUsers(filters: Record<string, string> = {}) {
  return useQuery({
    queryKey: queryKeys.users.list(filters),
    queryFn: () => {
      const params = new URLSearchParams(filters).toString()
      return apiClient.get<User[]>(`/users${params ? `?${params}` : ""}`)
    },
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => apiClient.get<User>(`/users/${id}`),
    enabled: !!id,
  })
}

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<User>) => apiClient.put<User>(`/users/${id}`, data as unknown as Record<string, unknown>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
    },
  })
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiClient.patch<User>(`/users/${id}/status`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.delete<void>(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
    },
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; email: string; password: string; role: string }) =>
      apiClient.post<User>("/users", data as unknown as Record<string, unknown>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
    },
  })
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => apiClient.get<User>("/users/profile"),
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ProfileFormValues) =>
      apiClient.put<User>("/users/profile", data as unknown as Record<string, unknown>),
    onSuccess: (user) => {
      queryClient.setQueryData(["profile"], user)
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() })
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordFormValues) =>
      apiClient.post<{ message: string }>("/users/change-password", data as unknown as Record<string, unknown>),
  })
}

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.admin.dashboard(),
    queryFn: () =>
      apiClient.get<{
        kpis: { totalRevenue: number; totalUsers: number; totalBookings: number; totalServices: number }
        recentBookings: Array<Record<string, unknown>>
        topServices: Array<Record<string, unknown>>
      }>("/users/dashboard"),
  })
}

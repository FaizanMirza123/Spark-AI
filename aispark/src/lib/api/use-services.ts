import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "./client"
import { queryKeys } from "./query-keys"
import type { Service, ServiceCategory } from "@/types"
import type { ServiceFormValues } from "@/lib/validations/service"

export function useServices(filters: Record<string, string> = {}) {
  return useQuery({
    queryKey: queryKeys.services.list(filters),
    queryFn: () => {
      const params = new URLSearchParams(filters).toString()
      return apiClient.get<Service[]>(`/services${params ? `?${params}` : ""}`)
    },
  })
}

export function useService(id: string) {
  return useQuery({
    queryKey: queryKeys.services.detail(id),                                    
    queryFn: () => apiClient.get<Service>(`/services/${id}`),
    enabled: !!id,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: () => apiClient.get<ServiceCategory[]>("/categories"),
  })
}

export function useCreateService() {                                  
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ServiceFormValues) => apiClient.post<Service>("/services", data as unknown as Record<string, unknown>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all })
    },
  })
}

export function useUpdateService(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<ServiceFormValues>) => apiClient.put<Service>(`/services/${id}`, data as unknown as Record<string, unknown>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all })
    },
  })
}

export function useDeleteService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.delete<void>(`/services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all })
    },
  })
}

export function useToggleServiceStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiClient.put<void>(`/services/${id}`, { isActive } as unknown as Record<string, unknown>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all })
    },
  })
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "./client"
import { queryKeys } from "./query-keys"
import type { AuthUser } from "@/types"
import type { LoginFormValues, SignupFormValues, ForgotPasswordFormValues } from "@/lib/validations/auth"

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: () => apiClient.get<AuthUser>("/auth/me"),
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: LoginFormValues) => apiClient.post<AuthUser>("/auth/login", data as unknown as Record<string, unknown>),
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.auth.user(), user)
    },
  })
}

export function useSignup() {
  return useMutation({
    mutationFn: (data: SignupFormValues) => apiClient.post<{ message: string }>("/auth/signup", data as unknown as Record<string, unknown>),
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordFormValues) =>
      apiClient.post<{ message: string }>("/auth/forgot-password", data as unknown as Record<string, unknown>),
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => apiClient.post<{ message: string }>("/auth/logout", {}),
    onSuccess: () => {
      queryClient.clear()
    },
  })
}

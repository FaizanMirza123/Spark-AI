import { csrfHeaders } from "@/lib/utils/csrf"

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api"

type RequestOptions = {
  method?: string
  body?: Record<string, unknown>
  headers?: Record<string, string>
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {} } = options
  const isWrite = method !== "GET" && method !== "HEAD"

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(isWrite ? csrfHeaders() : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }))
    throw new Error(error.message ?? `HTTP ${res.status}`)
  }

  return res.json() as Promise<T>
}

export const apiClient = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body: Record<string, unknown>) => request<T>(endpoint, { method: "POST", body }),
  put: <T>(endpoint: string, body: Record<string, unknown>) => request<T>(endpoint, { method: "PUT", body }),
  patch: <T>(endpoint: string, body: Record<string, unknown>) => request<T>(endpoint, { method: "PATCH", body }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
}

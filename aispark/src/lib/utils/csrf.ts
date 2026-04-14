let token: string | null = null

export function getCsrfToken(): string {
  if (token) return token
  token = crypto.randomUUID()
  return token
}

export function csrfHeaders(): Record<string, string> {
  return { "x-csrf-token": getCsrfToken() }
}

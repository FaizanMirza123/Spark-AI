"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type PlatformSettings = {
  platformName: string
  supportEmail: string
  platformFee: number   // percentage, e.g. 5
  currency: string      // e.g. "USD"
  darkMode: boolean
  notifications: {
    email: boolean
    bookingAlerts: boolean
    weeklyReports: boolean
  }
}

const DEFAULTS: PlatformSettings = {
  platformName: "SparkAI",
  supportEmail: "support@sparkai.com",
  platformFee: 5,
  currency: "USD",
  darkMode: false,
  notifications: {
    email: true,
    bookingAlerts: true,
    weeklyReports: false,
  },
}

const STORAGE_KEY = "sparkai_settings"

function loadSettings(): PlatformSettings {
  if (typeof window === "undefined") return DEFAULTS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULTS
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return DEFAULTS
  }
}

function applyDarkMode(dark: boolean) {
  if (typeof document === "undefined") return
  if (dark) {
    document.documentElement.classList.add("dark")
  } else {
    document.documentElement.classList.remove("dark")
  }
}

type SettingsContextValue = {
  settings: PlatformSettings
  updateSettings: (patch: Partial<PlatformSettings>) => void
  formatPrice: (amount: number) => string
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULTS)

  // Hydrate from localStorage after mount
  useEffect(() => {
    const loaded = loadSettings()
    setSettings(loaded)
    applyDarkMode(loaded.darkMode)
  }, [])

  const updateSettings = (patch: Partial<PlatformSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      if (patch.darkMode !== undefined) applyDarkMode(patch.darkMode)
      return next
    })
  }

  const currencySymbols: Record<string, string> = {
    USD: "$", EUR: "€", GBP: "£", CAD: "CA$", AUD: "A$",
  }

  const formatPrice = (amount: number) => {
    const symbol = currencySymbols[settings.currency] ?? settings.currency
    return `${symbol}${amount.toFixed(2)}`
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, formatPrice }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider")
  return ctx
}

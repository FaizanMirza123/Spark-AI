"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield, Lock, CheckCircle2, ChevronLeft, CreditCard, Calendar, Clock,
  Sparkles, Star
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>}>
      <CheckoutContent />
    </Suspense>
  )
}

function detectCardType(number: string): "visa" | "mastercard" | "amex" | "generic" {
  const n = number.replace(/\s/g, "")
  if (/^4/.test(n)) return "visa"
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "mastercard"
  if (/^3[47]/.test(n)) return "amex"
  return "generic"
}

function formatCardNumber(value: string, cardType: string): string {
  const digits = value.replace(/\D/g, "")
  const maxLen = cardType === "amex" ? 15 : 16
  const trimmed = digits.slice(0, maxLen)
  if (cardType === "amex") {
    return trimmed.replace(/(\d{4})(\d{6})(\d{0,5})/, (_, a, b, c) =>
      c ? `${a} ${b} ${c}` : b ? `${a} ${b}` : a
    )
  }
  return trimmed.replace(/(\d{4})(?=\d)/g, "$1 ")
}

function CardBrandIcon({ type }: { type: "visa" | "mastercard" | "amex" | "generic" }) {
  if (type === "visa") {
    return (
      <svg width="38" height="24" viewBox="0 0 38 24" className="rounded">
        <rect width="38" height="24" rx="4" fill="#1A1F71" />
        <text x="3" y="17" fill="#fff" fontSize="13" fontWeight="bold" fontFamily="Arial">VISA</text>
      </svg>
    )
  }
  if (type === "mastercard") {
    return (
      <svg width="38" height="24" viewBox="0 0 38 24" className="rounded">
        <rect width="38" height="24" rx="4" fill="#252525" />
        <circle cx="14" cy="12" r="7" fill="#EB001B" />
        <circle cx="24" cy="12" r="7" fill="#F79E1B" />
        <path d="M19 6.8a7 7 0 0 1 0 10.4A7 7 0 0 1 19 6.8z" fill="#FF5F00" />
      </svg>
    )
  }
  if (type === "amex") {
    return (
      <svg width="38" height="24" viewBox="0 0 38 24" className="rounded">
        <rect width="38" height="24" rx="4" fill="#2557D6" />
        <text x="3" y="17" fill="#fff" fontSize="9" fontWeight="bold" fontFamily="Arial">AMEX</text>
      </svg>
    )
  }
  return (
    <div className="flex h-6 w-10 items-center justify-center rounded border bg-muted">
      <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
    </div>
  )
}

const Particle = ({ x, y, color }: { x: number; y: number; color: string }) => (
  <motion.div
    className="absolute h-2 w-2 rounded-full"
    style={{ background: color, top: y, left: x }}
    initial={{ opacity: 1, scale: 1, y: 0 }}
    animate={{ opacity: 0, scale: 0, y: -80 + Math.random() * 40, x: (Math.random() - 0.5) * 120 }}
    transition={{ duration: 0.9 + Math.random() * 0.5, ease: "easeOut" }}
  />
)

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: Math.random() * 360,
  y: Math.random() * 80,
  color: ["#6366f1", "#a78bfa", "#34d399", "#f59e0b", "#f472b6"][i % 5],
}))

const fieldVariants = {
  hidden: { opacity: 0, x: -16 },
  show: (i: number) => ({ opacity: 1, x: 0, transition: { delay: i * 0.07, duration: 0.35 } }),
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")

  const serviceId = searchParams.get("serviceId") ?? "1"
  const date = searchParams.get("date") ?? "2025-04-13"
  const time = searchParams.get("time") ?? "10:00"

  const cardType = detectCardType(cardNumber)

  const MOCK_SERVICE = {
    name: "Deep Home Cleaning",
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80",
    price: 120,
    platformFee: 6,
    total: 126,
    duration: "3 hours",
    providerName: "CleanPro Services",
    rating: 4.9,
    reviews: 148,
  }

  function handleCardNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const type = detectCardType(e.target.value)
    setCardNumber(formatCardNumber(e.target.value, type))
  }

  function handleExpiryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4)
    if (digits.length >= 3) {
      setExpiry(`${digits.slice(0, 2)}/${digits.slice(2)}`)
    } else {
      setExpiry(digits)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setIsComplete(true)
    }, 2200)
  }

  if (isComplete) {
    return (
      <div className="relative mx-auto flex max-w-lg flex-col items-center overflow-hidden px-4 py-16 text-center">
        {PARTICLES.map((p) => <Particle key={p.id} x={p.x} y={p.y} color={p.color} />)}
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 14 }}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30"
        >
          <CheckCircle2 className="h-14 w-14 text-emerald-500" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <h1 className="mt-6 text-3xl font-bold">Booking Confirmed!</h1>
          <p className="mt-3 text-muted-foreground">
            Your {MOCK_SERVICE.name} booking has been confirmed for{" "}
            {new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })} at {time}.
          </p>
          <div className="mt-6 rounded-xl border bg-muted/40 px-6 py-4 text-sm">
            <p className="font-semibold">Booking Reference</p>
            <p className="mt-1 font-mono text-lg tracking-widest text-primary">BK-{Math.random().toString(36).slice(2, 8).toUpperCase()}</p>
            <p className="mt-2 text-muted-foreground">A confirmation email has been sent to your inbox.</p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/bookings">View My Bookings</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/services">Browse More Services</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
        <Button variant="ghost" asChild className="mb-6 -ml-2">
          <Link href={`/services/${serviceId}`}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Service
          </Link>
        </Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <h1 className="mb-1 text-3xl font-bold">Secure Checkout</h1>
        <p className="mb-8 text-muted-foreground">Complete your booking in seconds</p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Payment Form — left */}
        <div className="lg:col-span-3">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="overflow-hidden">
              {/* Gradient header */}
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    <span className="font-semibold">Payment Details</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CardBrandIcon type="visa" />
                    <CardBrandIcon type="mastercard" />
                    <CardBrandIcon type="amex" />
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="show" className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input id="cardName" placeholder="Alex Johnson" required className="h-11" />
                  </motion.div>

                  {/* Card Number */}
                  <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="show" className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <div className="relative">
                      <Input
                        id="cardNumber"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4242 4242 4242 4242"
                        maxLength={cardType === "amex" ? 17 : 19}
                        required
                        className="h-11 pr-14 font-mono tracking-wider"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <CardBrandIcon type={cardType} />
                      </div>
                    </div>
                  </motion.div>

                  {/* Expiry + CVC */}
                  <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="show" className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <div className="relative">
                        <Input
                          id="expiry"
                          value={expiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                          className="h-11 pl-9 font-mono"
                        />
                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC / CVV</Label>
                      <div className="relative">
                        <Input
                          id="cvc"
                          placeholder={cardType === "amex" ? "4 digits" : "3 digits"}
                          maxLength={cardType === "amex" ? 4 : 3}
                          required
                          className="h-11 pl-9 font-mono"
                        />
                        <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Security note */}
                  <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="show">
                    <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm dark:border-emerald-900/50 dark:bg-emerald-950/30">
                      <Shield className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <div className="text-emerald-800 dark:text-emerald-300">
                        <span className="font-semibold">256-bit SSL encryption</span> — Your payment information is encrypted and secure. We never store your card details.
                      </div>
                    </div>
                  </motion.div>

                  {/* Submit */}
                  <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="show">
                    <Button
                      type="submit"
                      className="h-13 w-full text-base font-semibold"
                      size="lg"
                      disabled={isProcessing}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {isProcessing ? (
                          <motion.span
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                          >
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Processing payment…
                          </motion.span>
                        ) : (
                          <motion.span
                            key="pay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                          >
                            <Lock className="h-4 w-4" />
                            Pay ${MOCK_SERVICE.total.toFixed(2)} Securely
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Order Summary — right */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18 }}
            className="sticky top-24"
          >
            <Card className="overflow-hidden">
              {/* Service Image */}
              <div className="relative h-40 w-full">
                <Image
                  src={MOCK_SERVICE.imageUrl}
                  alt={MOCK_SERVICE.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-bold text-white">{MOCK_SERVICE.name}</h3>
                  <p className="text-sm text-white/80">by {MOCK_SERVICE.providerName}</p>
                </div>
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {MOCK_SERVICE.rating} ({MOCK_SERVICE.reviews})
                </div>
              </div>

              <CardContent className="space-y-4 p-4">
                {/* Booking details */}
                <div className="space-y-2 rounded-lg bg-muted/50 p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" /> Date
                    </span>
                    <span className="font-medium">
                      {new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> Time
                    </span>
                    <span className="font-medium">{time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Sparkles className="h-3.5 w-3.5" /> Duration
                    </span>
                    <span className="font-medium">{MOCK_SERVICE.duration}</span>
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service fee</span>
                    <span>${MOCK_SERVICE.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform fee</span>
                    <span>${MOCK_SERVICE.platformFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-3 text-base font-bold">
                    <span>Total due</span>
                    <span className="text-primary">${MOCK_SERVICE.total.toFixed(2)}</span>
                  </div>
                </div>

                <p className="text-center text-xs text-muted-foreground">
                  By completing this booking you agree to our{" "}
                  <Link href="/terms" className="underline underline-offset-2 hover:text-foreground">Terms of Service</Link>.
                  Free cancellation up to 24h before.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}




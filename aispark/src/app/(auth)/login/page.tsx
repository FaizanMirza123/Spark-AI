"use client"

import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Eye, EyeOff, Loader2, Shield, Sparkles, Check, Star, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import PasswordConfirmInput from "@/components/ui/password-confirm-input"
import PasswordStrengthInput from "@/components/ui/password-strength-input"
import { loginSchema, signupSchema, type LoginFormValues, type SignupFormValues } from "@/lib/validations/auth"
import { useLogin, useSignup } from "@/lib/api/use-auth"
import { useRouter } from "next/navigation"

// ─── Types ───────────────────────────────────────────────────────────────────

type AuthMode = "login" | "signup" | "admin"

// ─── EyeBall + Pupil components (from design) ────────────────────────────────

interface EyeBallProps {
  size?: number
  pupilSize?: number
  maxDistance?: number
  eyeColor?: string
  pupilColor?: string
  isBlinking?: boolean
  forceLookX?: number
  forceLookY?: number
}

function EyeBall({ size = 24, pupilSize = 10, maxDistance = 6, eyeColor = "white", pupilColor = "#2D2D2D", isBlinking = false, forceLookX, forceLookY }: EyeBallProps) {
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const eyeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const move = (e: MouseEvent) => { setMouseX(e.clientX); setMouseY(e.clientY) }
    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [])

  const getPupilPos = () => {
    if (!eyeRef.current) return { x: 0, y: 0 }
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY }
    const r = eyeRef.current.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    const dx = mouseX - cx
    const dy = mouseY - cy
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), maxDistance)
    const angle = Math.atan2(dy, dx)
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist }
  }

  const { x, y } = getPupilPos()

  return (
    <div
      ref={eyeRef}
      className="rounded-full flex items-center justify-center overflow-hidden"
      style={{ width: size, height: isBlinking ? 2 : size, backgroundColor: eyeColor, transition: "height 0.1s ease" }}
    >
      {!isBlinking && (
        <div
          className="rounded-full"
          style={{ width: pupilSize, height: pupilSize, backgroundColor: pupilColor, transform: `translate(${x}px, ${y}px)`, transition: "transform 0.1s ease-out" }}
        />
      )}
    </div>
  )
}

interface PupilProps {
  size?: number
  maxDistance?: number
  pupilColor?: string
  forceLookX?: number
  forceLookY?: number
}

function Pupil({ size = 12, maxDistance = 5, pupilColor = "#2D2D2D", forceLookX, forceLookY }: PupilProps) {
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const move = (e: MouseEvent) => { setMouseX(e.clientX); setMouseY(e.clientY) }
    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [])

  const getPos = () => {
    if (!ref.current) return { x: 0, y: 0 }
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY }
    const r = ref.current.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    const dx = mouseX - cx
    const dy = mouseY - cy
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), maxDistance)
    const angle = Math.atan2(dy, dx)
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist }
  }

  const { x, y } = getPos()

  return (
    <div
      ref={ref}
      className="rounded-full"
      style={{ width: size, height: size, backgroundColor: pupilColor, transform: `translate(${x}px, ${y}px)`, transition: "transform 0.1s ease-out" }}
    />
  )
}

// ─── Characters Panel ─────────────────────────────────────────────────────────

function useRandomBlink() {
  const [isBlinking, setIsBlinking] = useState(false)
  useEffect(() => {
    const schedule = () => {
      const t = setTimeout(() => {
        setIsBlinking(true)
        setTimeout(() => { setIsBlinking(false); schedule() }, 150)
      }, Math.random() * 4000 + 3000)
      return t
    }
    const t = schedule()
    return () => clearTimeout(t)
  }, [])
  return isBlinking
}

interface CharactersPanelProps {
  mode: AuthMode
  password: string
  showPassword: boolean
  isTypingEmail: boolean
}

function CharactersPanel({ mode, password, showPassword, isTypingEmail }: CharactersPanelProps) {
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false)
  const [isPurplePeeking, setIsPurplePeeking] = useState(false)
  const purpleRef = useRef<HTMLDivElement>(null)
  const blackRef = useRef<HTMLDivElement>(null)
  const yellowRef = useRef<HTMLDivElement>(null)
  const orangeRef = useRef<HTMLDivElement>(null)

  const isPurpleBlinking = useRandomBlink()
  const isBlackBlinking = useRandomBlink()

  useEffect(() => {
    const move = (e: MouseEvent) => { setMouseX(e.clientX); setMouseY(e.clientY) }
    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [])

  useEffect(() => {
    if (isTypingEmail) {
      setIsLookingAtEachOther(true)
      const t = setTimeout(() => setIsLookingAtEachOther(false), 800)
      return () => clearTimeout(t)
    }
  }, [isTypingEmail])

  useEffect(() => {
    if (password.length > 0 && showPassword) {
      const schedule = () => {
        const t = setTimeout(() => {
          setIsPurplePeeking(true)
          setTimeout(() => setIsPurplePeeking(false), 800)
        }, Math.random() * 3000 + 2000)
        return t
      }
      const t = schedule()
      return () => clearTimeout(t)
    } else {
      setIsPurplePeeking(false)
    }
  }, [password, showPassword, isPurplePeeking])

  const calcPos = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 }
    const r = ref.current.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 3
    const dx = mouseX - cx
    const dy = mouseY - cy
    return {
      faceX: Math.max(-15, Math.min(15, dx / 20)),
      faceY: Math.max(-10, Math.min(10, dy / 30)),
      bodySkew: Math.max(-6, Math.min(6, -dx / 120)),
    }
  }

  const purplePos = calcPos(purpleRef)
  const blackPos = calcPos(blackRef)
  const yellowPos = calcPos(yellowRef)
  const orangePos = calcPos(orangeRef)

  const passwordHidden = password.length > 0 && !showPassword
  const passwordShown = password.length > 0 && showPassword
  const bgClass = mode === "admin"
    ? "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800"
    : "bg-gradient-to-br from-primary/90 via-primary to-primary/80"

  return (
    <div className={`relative hidden h-full flex-col justify-between ${bgClass} p-12 text-primary-foreground lg:flex`}>
      <div className="relative z-20 flex items-center gap-2 text-lg font-semibold">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary-foreground/10 backdrop-blur-sm">
          <Sparkles className="size-4" />
        </div>
        <span>SparkAI</span>
        {mode === "admin" && <Badge variant="secondary" className="ml-2 text-xs">Admin</Badge>}
      </div>

      <div className="relative z-20 flex h-[420px] items-end justify-center">
        <div className="relative" style={{ width: 500, height: 400 }}>
          {/* Purple tall rectangle */}
          <div
            ref={purpleRef}
            className="absolute bottom-0 transition-all duration-700 ease-in-out"
            style={{
              left: 60,
              width: 160,
              height: isTypingEmail || passwordHidden ? 420 : 380,
              backgroundColor: mode === "admin" ? "#8B5CF6" : "#6C3FF5",
              borderRadius: "10px 10px 0 0",
              zIndex: 1,
              transform: passwordShown
                ? "skewX(0deg)"
                : isTypingEmail || passwordHidden
                  ? `skewX(${purplePos.bodySkew - 12}deg) translateX(36px)`
                  : `skewX(${purplePos.bodySkew}deg)`,
              transformOrigin: "bottom center",
            }}
          >
            <div
              className="absolute flex gap-7 transition-all duration-700 ease-in-out"
              style={{
                left: passwordShown ? 18 : isLookingAtEachOther ? 52 : 42 + purplePos.faceX,
                top: passwordShown ? 32 : isLookingAtEachOther ? 60 : 36 + purplePos.faceY,
              }}
            >
              <EyeBall size={18} pupilSize={7} maxDistance={5} isBlinking={isPurpleBlinking}
                forceLookX={passwordShown ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                forceLookY={passwordShown ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined}
              />
              <EyeBall size={18} pupilSize={7} maxDistance={5} isBlinking={isPurpleBlinking}
                forceLookX={passwordShown ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                forceLookY={passwordShown ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined}
              />
            </div>
          </div>

          {/* Black medium rectangle */}
          <div
            ref={blackRef}
            className="absolute bottom-0 transition-all duration-700 ease-in-out"
            style={{
              left: 215,
              width: 110,
              height: 290,
              backgroundColor: "#2D2D2D",
              borderRadius: "8px 8px 0 0",
              zIndex: 2,
              transform: passwordShown
                ? "skewX(0deg)"
                : isLookingAtEachOther
                  ? `skewX(${blackPos.bodySkew * 1.5 + 10}deg) translateX(18px)`
                  : isTypingEmail || passwordHidden
                    ? `skewX(${blackPos.bodySkew * 1.5}deg)`
                    : `skewX(${blackPos.bodySkew}deg)`,
              transformOrigin: "bottom center",
            }}
          >
            <div
              className="absolute flex gap-5 transition-all duration-700 ease-in-out"
              style={{
                left: passwordShown ? 8 : isLookingAtEachOther ? 28 : 22 + blackPos.faceX,
                top: passwordShown ? 24 : isLookingAtEachOther ? 10 : 28 + blackPos.faceY,
              }}
            >
              <EyeBall size={16} pupilSize={6} maxDistance={4} isBlinking={isBlackBlinking}
                forceLookX={passwordShown ? -4 : isLookingAtEachOther ? 0 : undefined}
                forceLookY={passwordShown ? -4 : isLookingAtEachOther ? -4 : undefined}
              />
              <EyeBall size={16} pupilSize={6} maxDistance={4} isBlinking={isBlackBlinking}
                forceLookX={passwordShown ? -4 : isLookingAtEachOther ? 0 : undefined}
                forceLookY={passwordShown ? -4 : isLookingAtEachOther ? -4 : undefined}
              />
            </div>
          </div>

          {/* Orange semi-circle */}
          <div
            ref={orangeRef}
            className="absolute bottom-0 transition-all duration-700 ease-in-out"
            style={{
              left: 0,
              width: 220,
              height: 180,
              backgroundColor: "#FF9B6B",
              borderRadius: "110px 110px 0 0",
              zIndex: 3,
              transform: `skewX(${passwordShown ? 0 : orangePos.bodySkew}deg)`,
              transformOrigin: "bottom center",
            }}
          >
            <div
              className="absolute flex gap-7 transition-all duration-200 ease-out"
              style={{
                left: passwordShown ? 44 : 76 + orangePos.faceX,
                top: passwordShown ? 78 : 82 + orangePos.faceY,
              }}
            >
              <Pupil size={12} maxDistance={5}
                forceLookX={passwordShown ? -5 : undefined}
                forceLookY={passwordShown ? -4 : undefined}
              />
              <Pupil size={12} maxDistance={5}
                forceLookX={passwordShown ? -5 : undefined}
                forceLookY={passwordShown ? -4 : undefined}
              />
            </div>
          </div>

          {/* Yellow rounded rectangle */}
          <div
            ref={yellowRef}
            className="absolute bottom-0 transition-all duration-700 ease-in-out"
            style={{
              left: 285,
              width: 135,
              height: 215,
              backgroundColor: "#E8D754",
              borderRadius: "68px 68px 0 0",
              zIndex: 4,
              transform: `skewX(${passwordShown ? 0 : yellowPos.bodySkew}deg)`,
              transformOrigin: "bottom center",
            }}
          >
            <div
              className="absolute flex gap-5 transition-all duration-200 ease-out"
              style={{
                left: passwordShown ? 18 : 48 + yellowPos.faceX,
                top: passwordShown ? 30 : 36 + yellowPos.faceY,
              }}
            >
              <Pupil size={12} maxDistance={5}
                forceLookX={passwordShown ? -5 : undefined}
                forceLookY={passwordShown ? -4 : undefined}
              />
              <Pupil size={12} maxDistance={5}
                forceLookX={passwordShown ? -5 : undefined}
                forceLookY={passwordShown ? -4 : undefined}
              />
            </div>
            <div
              className="absolute h-[4px] w-16 rounded-full bg-[#2D2D2D] transition-all duration-200 ease-out"
              style={{ left: passwordShown ? 9 : 36 + yellowPos.faceX, top: 80 + yellowPos.faceY }}
            />
          </div>
        </div>
      </div>

      <div className="relative z-20 flex items-center gap-8 text-sm text-primary-foreground/60">
        <Link href="#" className="hover:text-primary-foreground transition-colors">Privacy</Link>
        <Link href="#" className="hover:text-primary-foreground transition-colors">Terms</Link>
        <Link href="#" className="hover:text-primary-foreground transition-colors">Contact</Link>
      </div>

      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50" />
      <div className="absolute top-1/4 right-1/4 size-64 rounded-full bg-primary-foreground/10 blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 size-96 rounded-full bg-primary-foreground/5 blur-3xl" />
    </div>
  )
}

// ─── Welcome Panel (shown on right during signup mode) ────────────────────────

function WelcomePanel({ onSwitchMode }: { onSwitchMode: (mode: AuthMode) => void }) {
  return (
    <div className="relative hidden h-full flex-col justify-between bg-gradient-to-br from-primary/90 via-primary to-primary/80 p-12 text-primary-foreground lg:flex">
      <div className="relative z-20 flex items-center gap-2 text-lg font-semibold">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary-foreground/10 backdrop-blur-sm">
          <Sparkles className="size-4" />
        </div>
        <span>SparkAI</span>
      </div>

      <div className="relative z-20 space-y-8">
        <div>
          <h2 className="text-4xl font-bold leading-tight">Join thousands of happy customers</h2>
          <p className="mt-4 text-lg text-primary-foreground/80">Book trusted professionals for any home service.</p>
        </div>

        <ul className="space-y-4">
          {[
            { icon: Check, text: "Verified & background-checked providers" },
            { icon: Star, text: "4.9★ average customer rating" },
            { icon: Clock, text: "Same-day service available" },
            { icon: Shield, text: "Satisfaction guarantee on every booking" },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3">
              <div className="flex size-7 flex-shrink-0 items-center justify-center rounded-full bg-primary-foreground/20">
                <Icon className="size-4" />
              </div>
              <span className="text-primary-foreground/90">{text}</span>
            </li>
          ))}
        </ul>

        <Button
          variant="outline"
          className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
          onClick={() => onSwitchMode("login")}
        >
          Already have an account? Sign in
        </Button>
      </div>

      <div className="relative z-20 flex items-center gap-8 text-sm text-primary-foreground/60">
        <Link href="#" className="hover:text-primary-foreground transition-colors">Privacy</Link>
        <Link href="#" className="hover:text-primary-foreground transition-colors">Terms</Link>
      </div>

      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50" />
      <div className="absolute top-1/4 right-1/4 size-64 rounded-full bg-primary-foreground/10 blur-3xl" />
    </div>
  )
}

// ─── Slide animation variants ─────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
  exit: (dir: number) => ({ x: dir > 0 ? "-80%" : "80%", opacity: 0, transition: { duration: 0.25, ease: "easeIn" as const } }),
}

const formFadeVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}
const formItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

// ─── Login Form ───────────────────────────────────────────────────────────────

function LoginForm({ onSwitchMode, setPassword, setShowPassword, setIsTypingEmail }: {
  onSwitchMode: (mode: AuthMode) => void
  setPassword: (v: string) => void
  setShowPassword: (v: boolean) => void
  setIsTypingEmail: (v: boolean) => void
}) {
  const router = useRouter()
  const login = useLogin()
  const [isLoading, setIsLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  })

  const handleTogglePw = () => {
    const next = !showPw
    setShowPw(next)
    setShowPassword(next)
  }

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    try {
      await login.mutateAsync(data)
      router.push("/")
    } catch {
      form.setError("root", { message: "Invalid email or password" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[420px]">
      <div className="mb-2 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="size-4 text-primary" />
          </div>
          <span className="text-lg font-bold">SparkAI</span>
        </Link>
      </div>

      <motion.div variants={formFadeVariants} initial="hidden" animate="visible" className="flex flex-col gap-5">
        <motion.div variants={formItemVariants}>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
          <p className="text-sm text-muted-foreground">Sign in to your account</p>
        </motion.div>

        {form.formState.errors.root && (
          <motion.div variants={formItemVariants} className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {form.formState.errors.root.message}
          </motion.div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <motion.div variants={formItemVariants}>
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="anna@example.com" {...field}
                      disabled={isLoading}
                      onFocus={() => setIsTypingEmail(true)}
                      onBlur={() => setIsTypingEmail(false)}
                      onChange={(e) => { field.onChange(e); setIsTypingEmail(true) }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </motion.div>

            <motion.div variants={formItemVariants}>
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordStrengthInput
                      id="login-password"
                      value={field.value}
                      onChange={(v) => { field.onChange(v); setPassword(v) }}
                      onBlur={field.onBlur}
                      showRequirements={false}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </motion.div>

            <motion.div variants={formItemVariants} className="flex items-center justify-between">
              <FormField control={form.control} name="rememberMe" render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} /></FormControl>
                  <FormLabel className="font-normal">Remember me</FormLabel>
                </FormItem>
              )} />
              <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">Forgot password?</Link>
            </motion.div>

            <motion.div variants={formItemVariants}>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
                Sign In
              </Button>
            </motion.div>

            <motion.div variants={formItemVariants}>
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              <Button variant="outline" className="w-full" type="button" disabled={isLoading}>
                <svg className="mr-2 size-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </Button>
            </motion.div>
          </form>
        </Form>

        <motion.p variants={formItemVariants} className="text-center text-sm text-muted-foreground">
          {"Don't have an account? "}
          <button type="button" onClick={() => onSwitchMode("signup")} className="font-medium text-primary hover:underline">
            Create account
          </button>
        </motion.p>
        <motion.p variants={formItemVariants} className="text-center text-xs text-muted-foreground">
          <button type="button" onClick={() => onSwitchMode("admin")} className="opacity-60 hover:opacity-100 hover:underline">
            Admin login →
          </button>
        </motion.p>
      </motion.div>
    </div>
  )
}

// ─── Admin Form ───────────────────────────────────────────────────────────────

function AdminForm({ onSwitchMode, setPassword, setShowPassword, setIsTypingEmail }: {
  onSwitchMode: (mode: AuthMode) => void
  setPassword: (v: string) => void
  setShowPassword: (v: boolean) => void
  setIsTypingEmail: (v: boolean) => void
}) {
  const router = useRouter()
  const login = useLogin()
  const [isLoading, setIsLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  })

  const handleTogglePw = () => {
    const next = !showPw
    setShowPw(next)
    setShowPassword(next)
  }

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    try {
      await login.mutateAsync(data)
      router.push("/admin")
    } catch {
      form.setError("root", { message: "Invalid admin credentials" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[420px]">
      <motion.div variants={formFadeVariants} initial="hidden" animate="visible" className="flex flex-col gap-5">
        <motion.div variants={formItemVariants} className="flex items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-slate-800">
            <Shield className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Access</h1>
            <p className="text-sm text-muted-foreground">Sign in with your administrator credentials</p>
          </div>
        </motion.div>

        <motion.div variants={formItemVariants}>
          <Badge variant="outline" className="border-amber-500/50 bg-amber-500/10 text-amber-700">
            <Shield className="mr-1 size-3" /> Administrator Portal
          </Badge>
        </motion.div>

        {form.formState.errors.root && (
          <motion.div variants={formItemVariants} className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {form.formState.errors.root.message}
          </motion.div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <motion.div variants={formItemVariants}>
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Email</FormLabel>
                  <FormControl>
                    <Input placeholder="admin@sparkai.com" {...field} disabled={isLoading}
                      onFocus={() => setIsTypingEmail(true)}
                      onBlur={() => setIsTypingEmail(false)}
                      onChange={(e) => { field.onChange(e); setIsTypingEmail(true) }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </motion.div>

            <motion.div variants={formItemVariants}>
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Password</FormLabel>
                  <FormControl>
                    <PasswordStrengthInput
                      id="admin-password"
                      value={field.value}
                      onChange={(v) => { field.onChange(v); setPassword(v) }}
                      onBlur={field.onBlur}
                      showRequirements={false}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </motion.div>

            <motion.div variants={formItemVariants}>
              <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-700 text-white" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
                <Shield className="mr-2 size-4" />
                Sign In as Admin
              </Button>
            </motion.div>
          </form>
        </Form>

        <motion.p variants={formItemVariants} className="text-center text-sm text-muted-foreground">
          <button type="button" onClick={() => onSwitchMode("login")} className="font-medium text-primary hover:underline">
            ← Back to customer login
          </button>
        </motion.p>
      </motion.div>
    </div>
  )
}

// ─── Signup Form ──────────────────────────────────────────────────────────────

function SignupForm({ onSwitchMode }: { onSwitchMode: (mode: AuthMode) => void }) {
  const router = useRouter()
  const signup = useSignup()
  const [isLoading, setIsLoading] = useState(false)
  const [confirmValue, setConfirmValue] = useState("")

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  })

  const passwordValue = form.watch("password")

  useEffect(() => {
    form.setValue("confirmPassword", confirmValue, { shouldValidate: confirmValue.length > 0 })
  }, [confirmValue, form])

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true)
    try {
      await signup.mutateAsync(data)
      onSwitchMode("login")
    } catch {
      form.setError("root", { message: "Failed to create account. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[420px]">
      <div className="mb-2 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="size-4 text-primary" />
          </div>
          <span className="text-lg font-bold">SparkAI</span>
        </Link>
      </div>

      <motion.div variants={formFadeVariants} initial="hidden" animate="visible" className="flex flex-col gap-5">
        <motion.div variants={formItemVariants}>
          <h1 className="text-3xl font-bold tracking-tight">Create account</h1>
          <p className="text-sm text-muted-foreground">Enter your details to get started</p>
        </motion.div>

        {form.formState.errors.root && (
          <motion.div variants={formItemVariants} className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {form.formState.errors.root.message}
          </motion.div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <motion.div variants={formItemVariants}>
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input placeholder="John Doe" {...field} disabled={isLoading} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </motion.div>

            <motion.div variants={formItemVariants}>
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input placeholder="john@example.com" {...field} disabled={isLoading} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </motion.div>

            <motion.div variants={formItemVariants}>
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordStrengthInput
                      id="signup-password"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      showRequirements={true}
                      disabled={isLoading}
                      placeholder="Min. 8 characters"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </motion.div>

            <motion.div variants={formItemVariants}>
              <Label className="text-sm font-medium">Confirm Password</Label>
              <PasswordConfirmInput
                passwordToMatch={passwordValue || ""}
                value={confirmValue}
                onChange={setConfirmValue}
                className="mt-1.5"
              />
              {form.formState.errors.confirmPassword && (
                <p className="mt-1 text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
              )}
            </motion.div>

            <motion.div variants={formItemVariants}>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
                Create Account
              </Button>
            </motion.div>
          </form>
        </Form>

        <motion.p variants={formItemVariants} className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button type="button" onClick={() => onSwitchMode("login")} className="font-medium text-primary hover:underline">
            Sign in
          </button>
        </motion.p>
      </motion.div>
    </div>
  )
}

// ─── Main Auth Page ───────────────────────────────────────────────────────────

export default function AuthPage({ initialMode = "login" }: { initialMode?: AuthMode }) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [direction, setDirection] = useState(1)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isTypingEmail, setIsTypingEmail] = useState(false)

  const switchMode = (next: AuthMode) => {
    setDirection(next === "signup" ? 1 : -1)
    setPassword("")
    setShowPassword(false)
    setMode(next)
  }

  const isCharactersLeft = mode !== "signup"

  return (
    <div className="grid min-h-screen overflow-hidden lg:grid-cols-2">
      {/* LEFT panel */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {isCharactersLeft ? (
            <motion.div
              key={`chars-${mode}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              <CharactersPanel mode={mode} password={password} showPassword={showPassword} isTypingEmail={isTypingEmail} />
            </motion.div>
          ) : (
            <motion.div
              key="signup-form"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 flex items-center justify-center bg-background p-8"
            >
              <SignupForm onSwitchMode={switchMode} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RIGHT panel */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {isCharactersLeft ? (
            <motion.div
              key={`form-${mode}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 flex items-center justify-center bg-background p-8"
            >
              {mode === "login" && (
                <LoginForm
                  onSwitchMode={switchMode}
                  setPassword={setPassword}
                  setShowPassword={setShowPassword}
                  setIsTypingEmail={setIsTypingEmail}
                />
              )}
              {mode === "admin" && (
                <AdminForm
                  onSwitchMode={switchMode}
                  setPassword={setPassword}
                  setShowPassword={setShowPassword}
                  setIsTypingEmail={setIsTypingEmail}
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="welcome"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              <WelcomePanel onSwitchMode={switchMode} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}



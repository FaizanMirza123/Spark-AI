"use client"

import React, { useState, useMemo } from "react"
import { Check, Eye, EyeOff, X } from "lucide-react"
import { cn } from "@/lib/utils"

const PASSWORD_REQUIREMENTS = [
  { regex: /.{8,}/, text: "At least 8 characters" },
  { regex: /[0-9]/, text: "At least 1 number" },
  { regex: /[a-z]/, text: "At least 1 lowercase letter" },
  { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
  { regex: /[!-/:-@[-`{-~]/, text: "At least 1 special character" },
] as const

type StrengthScore = 0 | 1 | 2 | 3 | 4 | 5

const STRENGTH_TEXTS: Record<Exclude<StrengthScore, 5>, string> = {
  0: "Enter a password",
  1: "Weak password",
  2: "Medium password",
  3: "Strong password",
  4: "Very strong password",
}

const BAR_COLORS = ["bg-border", "bg-red-500", "bg-orange-400", "bg-amber-400", "bg-green-400", "bg-emerald-500"] as const

interface PasswordStrengthInputProps {
  id?: string
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  disabled?: boolean
  showRequirements?: boolean
  className?: string
  name?: string
}

export const PasswordStrengthInput = React.forwardRef<HTMLInputElement, PasswordStrengthInputProps>(
  ({ id, value = "", onChange, onBlur, placeholder = "Password", disabled, showRequirements = true, className, name }, ref) => {
    const [isVisible, setIsVisible] = useState(false)
    const [focused, setFocused] = useState(false)

    const strength = useMemo(() => {
      const requirements = PASSWORD_REQUIREMENTS.map((req) => ({
        met: req.regex.test(value),
        text: req.text,
      }))
      return {
        score: requirements.filter((r) => r.met).length as StrengthScore,
        requirements,
      }
    }, [value])

    const showStrength = focused && value.length > 0

    return (
      <div className={cn("space-y-2", className)}>
        <div className="relative">
          <input
            ref={ref}
            id={id}
            name={name}
            type={isVisible ? "text" : "password"}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => { setFocused(false); onBlur?.() }}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={strength.score > 0 && strength.score < 4}
            aria-describedby={id ? `${id}-strength` : undefined}
            className={cn(
              "flex h-10 w-full rounded-md border-2 bg-background px-3 py-2 pr-10 text-sm ring-offset-background transition-colors",
              "placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              showStrength && strength.score === 0 && "border-border",
              showStrength && strength.score >= 1 && strength.score < 3 && "border-red-400",
              showStrength && strength.score >= 3 && strength.score < 4 && "border-amber-400",
              showStrength && strength.score >= 4 && "border-emerald-500",
              !showStrength && "border-input focus-within:border-primary"
            )}
          />
          <button
            type="button"
            onClick={() => setIsVisible((v) => !v)}
            disabled={disabled}
            aria-label={isVisible ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-muted-foreground/80 hover:text-foreground outline-none"
          >
            {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {showStrength && (
          <>
            {/* Strength bars */}
            <div className="flex gap-1.5 w-full">
              {[1, 2, 3, 4, 5].map((bar) => (
                <span
                  key={bar}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-all duration-300",
                    strength.score >= bar ? BAR_COLORS[strength.score] : "bg-border"
                  )}
                />
              ))}
            </div>

            {/* Strength label */}
            <p id={id ? `${id}-strength` : undefined} className="flex justify-between text-xs font-medium">
              <span className="text-muted-foreground">Must contain:</span>
              <span className={cn(
                strength.score <= 1 && "text-red-500",
                strength.score === 2 && "text-orange-500",
                strength.score === 3 && "text-amber-600",
                strength.score >= 4 && "text-emerald-600",
              )}>
                {STRENGTH_TEXTS[Math.min(strength.score, 4) as Exclude<StrengthScore, 5>]}
              </span>
            </p>

            {/* Requirements list - only if showRequirements */}
            {showRequirements && (
              <ul className="space-y-1" aria-label="Password requirements">
                {strength.requirements.map((req, i) => (
                  <li key={i} className="flex items-center gap-2">
                    {req.met ? (
                      <Check size={13} className="shrink-0 text-emerald-500" />
                    ) : (
                      <X size={13} className="shrink-0 text-muted-foreground/60" />
                    )}
                    <span className={cn("text-xs", req.met ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground")}>
                      {req.text}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    )
  }
)
PasswordStrengthInput.displayName = "PasswordStrengthInput"

export default PasswordStrengthInput

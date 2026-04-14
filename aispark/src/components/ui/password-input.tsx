"use client"

import * as React from "react"
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

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  showStrength?: boolean
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showStrength = false, className, id, ...props }, ref) => {
  const [isVisible, setIsVisible] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState("")

  const displayValue = typeof props.value === "string" ? props.value : internalValue

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value)
    props.onChange?.(e)
  }

  const strength = React.useMemo(() => {
    const requirements = PASSWORD_REQUIREMENTS.map((req) => ({
      met: req.regex.test(displayValue),
      text: req.text,
    }))
    return {
      score: requirements.filter((r) => r.met).length as StrengthScore,
      requirements,
    }
  }, [displayValue])

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          ref={ref}
          id={id}
          type={isVisible ? "text" : "password"}
          aria-invalid={showStrength ? strength.score < 4 : undefined}
          aria-describedby={showStrength && id ? `${id}-strength` : undefined}
          className={cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)}
          {...props}
          onChange={handleChange}
        />
        <button
          type="button"
          onClick={() => setIsVisible((prev) => !prev)}
          aria-label={isVisible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-muted-foreground hover:text-foreground"
        >
          {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {showStrength && (
        <>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <span
                key={level}
                className={cn(
                  "h-1.5 rounded-full w-full transition-colors",
                  strength.score >= level ? `bg-green-${level}00` : "bg-border",
                  strength.score >= 1 && level === 1 && "bg-green-200",
                  strength.score >= 2 && level <= 2 && "bg-green-300",
                  strength.score >= 3 && level <= 3 && "bg-green-400",
                  strength.score >= 4 && level <= 4 && "bg-green-500",
                  strength.score >= 5 && "bg-green-600"
                )}
              />
            ))}
          </div>
          <p id={id ? `${id}-strength` : undefined} className="text-sm font-medium flex justify-between">
            <span>Must contain:</span>
            <span>{STRENGTH_TEXTS[Math.min(strength.score, 4) as keyof typeof STRENGTH_TEXTS]}</span>
          </p>
          <ul className="space-y-1.5" aria-label="Password requirements">
            {strength.requirements.map((req, index) => (
              <li key={index} className="flex items-center space-x-2">
                {req.met ? (
                  <Check size={16} className="text-emerald-500" />
                ) : (
                  <X size={16} className="text-muted-foreground/80" />
                )}
                <span className={cn("text-xs", req.met ? "text-emerald-600" : "text-muted-foreground")}>
                  {req.text}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
})
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }

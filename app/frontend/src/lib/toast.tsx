import { toast as sonner } from "sonner"
import { cn } from "@/lib/utils"
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  Circle,
  X,
} from "lucide-react"
import React from "react"

type Variant = "solid" | "outline"
type Tone = "default" | "primary" | "secondary" | "success" | "warning" | "error"

interface ToastOptions {
  variant?: Variant
  tone?: Tone
  children?: React.ReactNode
}

const baseStyles =
  "w-full max-w-sm p-4 rounded-md border text-sm shadow-md flex justify-between items-start gap-3"

const toneStyles: Record<Variant, Record<Tone, string>> = {
  solid: {
    default: "bg-muted text-foreground border-border",
    primary: "bg-brand-500 text-white border-brand-500",
    secondary:
      "bg-gray-200 text-gray-900 border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700",
    success: "bg-success-500 text-white border-success-500",
    warning: "bg-warning-500 text-white border-warning-500",
    error: "bg-error-500 text-white border-error-500",
  },
  outline: {
    default:
      "bg-background text-foreground border border-border dark:bg-gray-800 dark:text-white backdrop-blur-md",
    primary:
      "bg-brand-100 text-brand-700 border border-brand-500 dark:bg-brand-400/50 dark:text-white backdrop-blur-md",
    secondary:
      "bg-gray-100 text-gray-700 border border-gray-400 dark:bg-gray-500/50 dark:text-white backdrop-blur-md",
    success:
      "bg-success-100 text-success-700 border border-success-500 dark:bg-success-400/50 dark:text-white backdrop-blur-md",
    warning:
      "bg-warning-100 text-warning-700 border border-warning-500 dark:bg-warning-400/50 dark:text-white backdrop-blur-md",
    error:
      "bg-error-100 text-error-700 border border-error-500 dark:bg-error-400/50 dark:text-white backdrop-blur-md",
  },
}

const closeButtonStyles: Record<Tone, string> = {
  default: "bg-muted text-foreground",
  primary: "bg-brand-700 text-white",
  secondary: "bg-gray-700 text-white",
  success: "bg-success-700 text-white",
  warning: "bg-warning-600 text-white",
  error: "bg-error-600 text-white",
}

const icons: Record<Tone, React.ReactNode> = {
  default: <Circle className="w-5 h-5" />,
  primary: <Info className="w-5 h-5" />,
  secondary: <Info className="w-5 h-5" />,
  success: <CheckCircle className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  error: <XCircle className="w-5 h-5" />,
}

export function showToast({
  variant = "solid",
  tone = "default",
  children,
}: ToastOptions) {
  const classes = cn(baseStyles, toneStyles[variant][tone])
  const closeButtonClass = cn(
    "rounded-full p-1 transition",
    closeButtonStyles[tone]
  )

  sonner.custom((t) => (
    <div className={classes}>
      <div className="flex items-start gap-3 flex-1">
        <div className="pt-0.5">{icons[tone]}</div>
        <div className="space-y-0.5">
          {children ?? (
            <>
              <div className="font-medium">Notification</div>
              <div className="text-xs opacity-80">This is a default message.</div>
            </>
          )}
        </div>
      </div>
      <button onClick={() => sonner.dismiss(t)} className={closeButtonClass}>
        <X className="w-4 h-4" />
      </button>
    </div>
  ))
}

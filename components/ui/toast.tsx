"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts, dismissToast } = useToast()

  // Auto-dismiss toasts on route change
  useEffect(() => {
    return () => {
      toasts.forEach((toast) => dismissToast(toast.id))
    }
  }, [toasts, dismissToast])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-0 right-0 z-50 m-4 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`animate-in slide-in-from-right-full rounded-md border p-4 shadow-md ${
            toast.variant === "destructive"
              ? "border-red-500 bg-red-500/10 text-red-500"
              : toast.variant === "success"
                ? "border-green-500 bg-green-500/10 text-green-500"
                : "border-muted bg-background text-foreground"
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-medium">{toast.title}</h3>
              {toast.description && <p className="text-sm">{toast.description}</p>}
            </div>
            <button onClick={() => dismissToast(toast.id)} className="rounded-md p-1 hover:bg-muted">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}


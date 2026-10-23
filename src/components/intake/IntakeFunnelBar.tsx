"use client"

import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

// Conflict check comes before any details, signature or payment (ML1 2026-10-22).
const steps = [
  { id: 1, label: "Choose Service" },
  { id: 2, label: "Conflict check" },
  { id: 3, label: "Confirm and agree" },
  { id: 4, label: "Lawyer handles everything" },
]

function getActiveStep(pathname: string): number {
  if (pathname.startsWith("/intake/engagement")) return 3
  if (pathname.startsWith("/intake/questionnaire")) return 3
  if (pathname.startsWith("/intake/start")) return 2
  return 1
}

export function IntakeFunnelBar({ className, currentStep }: { className?: string; currentStep?: number }) {
  const pathname = usePathname()
  const activeStep = currentStep ?? getActiveStep(pathname)

  return (
    <div className="border-b border-stone-200 bg-white px-6 py-3">
      <ol className={cn("mx-auto flex max-w-3xl items-center gap-0", className)}>
        {steps.map((step, index) => {
          const isDone = step.id < activeStep
          const isActive = step.id === activeStep
          const isLast = index === steps.length - 1

          return (
            <li key={step.id} className="flex flex-1 items-center last:flex-none">
              <div className="flex items-center gap-2" aria-current={isActive ? "step" : undefined}>
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    isDone || isActive ? "bg-brand-navy text-white" : "bg-stone-100 text-stone-400"
                  )}
                >
                  {isDone ? "✓" : step.id}
                </span>
                <span
                  className={cn(
                    "hidden text-sm font-medium whitespace-nowrap sm:block",
                    isActive ? "text-stone-950" : isDone ? "text-stone-600" : "text-stone-400"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && <div className={cn("mx-3 h-px flex-1", isDone ? "bg-brand-navy/40" : "bg-stone-200")} />}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

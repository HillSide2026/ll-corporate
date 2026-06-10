"use client"

import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const steps = [
  { id: 1, label: "Browse" },
  { id: 2, label: "Pay" },
  { id: 3, label: "Questionnaire" },
  { id: 4, label: "Engage" },
]

function getActiveStep(pathname: string): number {
  if (pathname.startsWith("/intake/engagement")) return 4
  if (pathname.startsWith("/intake/questionnaire")) return 3
  return 1
}

export function IntakeFunnelBar() {
  const pathname = usePathname()
  const activeStep = getActiveStep(pathname)

  return (
    <div className="border-b bg-background px-6 py-3">
      <ol className="mx-auto flex max-w-3xl items-center gap-0">
        {steps.map((step, index) => {
          const isDone = step.id < activeStep
          const isActive = step.id === activeStep
          const isLast = index === steps.length - 1

          return (
            <li key={step.id} className="flex flex-1 items-center">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                    isDone
                      ? "bg-primary text-primary-foreground"
                      : isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {isDone ? "✓" : step.id}
                </span>
                <span
                  className={cn(
                    "hidden whitespace-nowrap text-xs font-medium sm:block",
                    isActive ? "text-foreground" : isDone ? "text-muted-foreground" : "text-muted-foreground/50"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn("mx-3 h-px flex-1", isDone ? "bg-primary/40" : "bg-border")}
                />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

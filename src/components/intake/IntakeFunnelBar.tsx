"use client"

import { usePathname } from "next/navigation"

import { cx } from "src/components/portal/PortalDesignSystem"

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
    <div className="border-b border-stone-200 bg-white px-6 py-4">
      <ol className="mx-auto flex max-w-3xl items-center">
        {steps.map((step, index) => {
          const isDone = step.id < activeStep
          const isActive = step.id === activeStep
          const isLast = index === steps.length - 1

          return (
            <li key={step.id} className="flex flex-1 items-center">
              <div className="flex items-center gap-2">
                <span
                  className={cx(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    isDone || isActive ? "bg-brand-navy text-white" : "bg-stone-100 text-stone-400"
                  )}
                >
                  {isDone ? "✓" : step.id}
                </span>
                <span
                  className={cx(
                    "hidden whitespace-nowrap text-sm font-medium sm:block",
                    isActive ? "text-stone-900" : isDone ? "text-stone-500" : "text-stone-400"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div className={cx("mx-3 h-px flex-1", isDone ? "bg-brand-navy" : "bg-stone-200")} />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

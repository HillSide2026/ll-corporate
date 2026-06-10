import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: {
    template: "%s — Levine Law",
    default: "Levine Law Client Intake",
  },
}

export default function IntakeLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}

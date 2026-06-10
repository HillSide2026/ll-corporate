import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { cookies } from "next/headers"

import { switchToHubMode } from "src/lib/intake/modeActions"
import { IntakeFunnelBar } from "./IntakeFunnelBar"
import { IntakeHubLayout } from "./IntakeHubLayout"

export type IntakeSection = "browse" | "questionnaire" | "engagement"

export async function IntakeShell({
  active = "browse",
  children,
}: {
  active?: IntakeSection
  children: ReactNode
}) {
  const cookieStore = await cookies()
  const mode = cookieStore.get("intake_mode")?.value === "hub" ? "hub" : "funnel"

  if (mode === "hub") {
    return <IntakeHubLayout active={active}>{children}</IntakeHubLayout>
  }

  return (
    <main className="min-h-dvh bg-muted/30">
      <header className="border-b bg-background px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/">
            <Image
              src="/logos/levine-law-wordmark-navy-transparent-2.png"
              alt="Levine Law"
              width={1080}
              height={600}
              className="h-8 w-auto"
            />
          </Link>
          <form action={switchToHubMode}>
            <button
              type="submit"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Explore freely
            </button>
          </form>
        </div>
      </header>

      <IntakeFunnelBar />

      <div className="mx-auto w-full max-w-3xl px-6 py-10">{children}</div>
    </main>
  )
}

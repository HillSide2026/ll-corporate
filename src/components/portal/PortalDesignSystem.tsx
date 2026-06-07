import type { ReactNode } from "react"

type PortalCardProps = {
  children: ReactNode
  className?: string
}

export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ")
}

export function PortalCard({ children, className }: PortalCardProps) {
  return (
    <section className={cx("rounded-lg border border-stone-200 bg-white shadow-sm", className)}>{children}</section>
  )
}

export function PortalCardHeader({
  action,
  children,
  className,
}: PortalCardProps & {
  action?: ReactNode
}) {
  return (
    <div className={cx("flex items-start justify-between gap-4 border-b border-stone-100 px-5 py-4", className)}>
      <div className="min-w-0">{children}</div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

export function PortalCardTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-sm font-semibold text-stone-950">{children}</h2>
}

export function PortalCardDescription({ children }: { children: ReactNode }) {
  return <p className="mt-1 text-sm leading-6 text-stone-500">{children}</p>
}

export function PortalCardContent({ children, className }: PortalCardProps) {
  return <div className={cx("px-5 py-5", className)}>{children}</div>
}

export function PortalPageHeader({
  action,
  eyebrow,
  title,
  description,
}: {
  action?: ReactNode
  eyebrow?: string
  title: string
  description?: string
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-brand-navy text-xs font-semibold tracking-[0.18em] uppercase">{eyebrow}</p>
        ) : null}
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 md:text-3xl">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

export function PortalBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode
  tone?: "navy" | "gold" | "green" | "red" | "neutral"
}) {
  const toneClass = {
    navy: "border-brand-navy/20 bg-brand-navy/10 text-brand-navy",
    gold: "border-amber-200 bg-amber-50 text-amber-800",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    red: "border-red-200 bg-red-50 text-red-700",
    neutral: "border-stone-200 bg-stone-100 text-stone-600",
  }[tone]

  return (
    <span className={cx("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", toneClass)}>
      {children}
    </span>
  )
}

export function PortalEmptyState({
  action,
  description,
  title,
}: {
  action?: ReactNode
  description: string
  title: string
}) {
  return (
    <div className="rounded-lg border border-dashed border-stone-200 bg-stone-50 px-6 py-10 text-center">
      <div className="text-brand-navy mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-sm font-semibold">
        LL
      </div>
      <h3 className="mt-4 text-sm font-semibold text-stone-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}

export function PortalButton({
  children,
  href,
  tone = "primary",
}: {
  children: ReactNode
  href: string
  tone?: "primary" | "secondary"
}) {
  return (
    <a
      href={href}
      className={cx(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors",
        tone === "primary"
          ? "bg-brand-navy hover:bg-brand-navy-dark text-white"
          : "border border-stone-300 bg-white text-stone-700 hover:border-stone-400 hover:bg-stone-50"
      )}
    >
      {children}
    </a>
  )
}

export function PortalStatCard({
  label,
  value,
  detail,
  tone = "neutral",
}: {
  detail: string
  label: string
  value: string | number
  tone?: "navy" | "gold" | "green" | "neutral"
}) {
  const accent = {
    navy: "bg-brand-navy",
    gold: "bg-amber-500",
    green: "bg-emerald-600",
    neutral: "bg-stone-400",
  }[tone]

  return (
    <PortalCard className="overflow-hidden">
      <div className={cx("h-1", accent)} />
      <div className="px-5 py-5">
        <p className="text-xs font-medium tracking-[0.14em] text-stone-400 uppercase">{label}</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">{value}</p>
        <p className="mt-2 text-sm leading-5 text-stone-500">{detail}</p>
      </div>
    </PortalCard>
  )
}

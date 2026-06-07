import Image from "next/image"
import Link from "next/link"

type PublicHeaderProps = {
  current?: "home" | "sign-in"
}

export function PublicHeader({ current }: PublicHeaderProps) {
  return (
    <header className="border-border-subtle border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5">
        <Link href="/" aria-label="Levine Law home" className="shrink-0">
          <Image
            src="/logos/levine-law-wordmark-navy-transparent-2.png"
            alt="Levine Law"
            width={1080}
            height={600}
            priority={current === "home"}
            className="h-10 w-auto"
          />
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link
            href="/sign-in"
            aria-current={current === "sign-in" ? "page" : undefined}
            className="border-brand-navy text-brand-navy hover:bg-brand-navy rounded-md border px-4 py-2 font-semibold transition-colors hover:text-white"
          >
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  )
}

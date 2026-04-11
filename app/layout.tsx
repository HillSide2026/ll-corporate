import "styles/tailwind.css"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default: "Levine LLP Corporate Portal",
    template: "%s | Levine LLP Corporate Portal",
  },
  description: "Bounded client portal for Levine LLP corporate clients.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

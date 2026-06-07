import "styles/tailwind.css"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default: "Levine Law",
    template: "%s | Levine Law",
  },
  description: "Levine Law corporate legal services and secure client portal access.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

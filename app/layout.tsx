import "styles/tailwind.css"

import type { Metadata } from "next"
import { Geist } from "next/font/google"

import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: {
    default: "Levine Law",
    template: "%s | Levine Law",
  },
  description: "Levine Law corporate legal services and secure client portal access.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  )
}

import "styles/tailwind.css"

import type { Metadata } from "next"
import { Geist, Source_Serif_4 } from "next/font/google"

import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import { PortalFooter } from "src/components/brand/PortalFooter"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })
const sourceSerif = Source_Serif_4({ subsets: ["latin"], variable: "--font-display-serif" })

export const metadata: Metadata = {
  title: {
    default: "Levine Law",
    template: "%s | Levine Law",
  },
  description: "Levine Law corporate legal services and secure client portal access.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable, sourceSerif.variable)}>
      <body>
        <TooltipProvider>{children}</TooltipProvider>
        <PortalFooter />
      </body>
    </html>
  )
}

import "styles/tailwind.css"

import type { Metadata } from "next"
import { Libre_Baskerville, Montserrat } from "next/font/google"

import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import { PortalFooter } from "src/components/brand/PortalFooter"

// Brand type, POL-050 4.2a: Montserrat for text, Libre Baskerville for display
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-sans" })
const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display-serif",
})

export const metadata: Metadata = {
  title: {
    default: "Levine Law",
    template: "%s | Levine Law",
  },
  description: "Levine Law corporate legal services and secure client portal access.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", montserrat.variable, libreBaskerville.variable)}>
      <body>
        <TooltipProvider>{children}</TooltipProvider>
        <PortalFooter />
      </body>
    </html>
  )
}

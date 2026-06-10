"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { ClipboardList, Compass, FileSignature, LayoutGrid, LogOut } from "lucide-react"

import { signOutFromPortal } from "src/lib/auth/actions"
import { switchToFunnelMode } from "src/lib/intake/modeActions"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import type { IntakeSection } from "./IntakeShell"

const navItems = [
  { key: "browse" as IntakeSection, label: "Browse", href: "/intake/catalog", icon: LayoutGrid },
  { key: "questionnaire" as IntakeSection, label: "My Intake", href: "/intake/questionnaire", icon: ClipboardList },
  { key: "engagement" as IntakeSection, label: "Engagement", href: "/intake/engagement", icon: FileSignature },
]

export function IntakeHubLayout({ active, children }: { active: IntakeSection; children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logos/levine-law-icon-navy.png"
              alt="Levine Law"
              width={500}
              height={500}
              className="h-8 w-8 rounded-md"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight">Levine Law</p>
              <p className="text-xs leading-tight text-muted-foreground">Client Intake</p>
            </div>
          </Link>
        </SidebarHeader>

        <SidebarContent className="pt-3">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton render={<Link href={item.href} />} isActive={active === item.key}>
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-2">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <form action={switchToFunnelMode}>
                    <SidebarMenuButton type="submit">
                      <Compass />
                      <span>Guided setup</span>
                    </SidebarMenuButton>
                  </form>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border p-3">
          <form action={signOutFromPortal}>
            <Button variant="outline" type="submit" size="sm" className="w-full">
              <LogOut />
              Sign out
            </Button>
          </form>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-3 h-4" />
          <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            Client Intake
          </p>
        </header>
        <div className="mx-auto w-full max-w-4xl px-5 py-8 md:px-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

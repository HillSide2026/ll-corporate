"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Mail } from "lucide-react"

import { getServicePriceDisplay, serviceCatalog } from "src/lib/services/catalog"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const products = [
  {
    slug: "founders-pack",
    title: "Founders Pack",
    description:
      "Core legal documents for new companies — structured to move quickly from idea to incorporated entity with the right foundation in place.",
    ghlUrl: "http://legal.levine-law.ca/ip1",
  },
  {
    slug: "founders-agreement",
    title: "Founders Agreement",
    description:
      "A founders-specific shareholders agreement establishing ownership, vesting, and decision-making from day one.",
    ghlUrl: "http://legal.levine-law.ca/ip2",
  },
  {
    slug: "corporate-health-check",
    title: "Corporate Health Check",
    description:
      "A senior-level diagnostic of your company's corporate records and governance posture. Identifies gaps before they become problems.",
    inquiry: true,
  },
] as const

export function CatalogClient() {
  const [tab, setTab] = useState<"products" | "services">("products")

  return (
    <div>
      <div className="mb-8">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-primary uppercase">Levine Law</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Products &amp; services</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Browse packaged products or select a service to begin intake.
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as "products" | "services")}>
        <TabsList className="mb-6">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.slug} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{product.title}</CardTitle>
                    {"inquiry" in product ? (
                      <Badge variant="secondary" className="shrink-0">By consultation</Badge>
                    ) : (
                      <Badge variant="secondary" className="shrink-0">Fixed fee</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground leading-6">{product.description}</p>
                </CardContent>
                <CardFooter>
                  {"inquiry" in product ? (
                    <a
                      href="mailto:matthew@levinelegal.ca?subject=Corporate Health Check inquiry"
                      className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                    >
                      <Mail />
                      Request a consultation
                    </a>
                  ) : (
                    <a
                      href={"ghlUrl" in product ? product.ghlUrl : "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(buttonVariants(), "w-full")}
                    >
                      Purchase
                      <ArrowUpRight />
                    </a>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="services">
          <div className="grid gap-4 sm:grid-cols-2">
            {serviceCatalog.map((service) => (
              <Card key={service.slug} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-base">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground leading-6">{service.description}</p>
                </CardContent>
                <CardFooter className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{getServicePriceDisplay(service)}</p>
                    <p className="text-xs text-muted-foreground">{service.turnaround}</p>
                  </div>
                  <Link
                    href={`/intake/questionnaire/${service.slug}`}
                    className={buttonVariants({ size: "sm" })}
                  >
                    Get started
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useState } from "react"

import { getServiceBySlug } from "src/lib/services/catalog"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export function EngagementClient({ serviceSlug }: { serviceSlug?: string }) {
  const [accepted, setAccepted] = useState(false)
  const [checked, setChecked] = useState(false)
  const [pending, setPending] = useState(false)

  const service = serviceSlug ? getServiceBySlug(serviceSlug) : undefined

  function handleAccept(e: React.FormEvent) {
    e.preventDefault()
    if (!checked) return
    setPending(true)
    // TODO: server action → record acceptance + set role=client → redirect /corporate/app
    setTimeout(() => {
      setPending(false)
      setAccepted(true)
    }, 800)
  }

  if (accepted) {
    return (
      <div className="mx-auto max-w-xl">
        <Card className="py-12 text-center">
          <CardContent>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <span className="text-xl">✓</span>
            </div>
            <h2 className="text-xl font-semibold">Engagement confirmed.</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Your service engagement with Levine Law has been recorded. Levine Law will follow up to confirm next steps.
            </p>
            <a href="/corporate/app" className={cn(buttonVariants(), "mt-6")}>
              Go to portal workspace
            </a>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-primary uppercase">Final step</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Service engagement</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Review the terms below and confirm your engagement with Levine Law.
        </p>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Levine Law — Service Engagement</CardTitle>
              {service && (
                <p className="mt-1 text-sm text-muted-foreground">Service: {service.title}</p>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6 text-sm leading-7 text-muted-foreground">
          <p>
            This service engagement confirms that you are engaging Levine Law to provide the legal services described
            below. By accepting, you agree to engage Levine Law on the terms set out in this document.
          </p>

          {service ? (
            <>
              <div>
                <p className="font-semibold text-foreground">Services to be provided</p>
                <ul className="mt-2 space-y-1">
                  {service.scope.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <span className="mt-1 shrink-0 text-primary" aria-hidden="true">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div>
                <p className="font-semibold text-foreground">Scope and assumptions</p>
                <ul className="mt-2 space-y-1">
                  {service.assumptions.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <span className="mt-1 shrink-0" aria-hidden="true">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div>
                <p className="font-semibold text-foreground">Fees</p>
                <p className="mt-1">
                  {service.price ?? "Fees will be quoted following receipt of the required intake information."}
                </p>
              </div>

              <Separator />
            </>
          ) : (
            <p className="italic">Service details will appear here once intake is complete.</p>
          )}

          <div>
            <p className="font-semibold text-foreground">Important notices</p>
            <p className="mt-1">
              This engagement does not create an ongoing lawyer-client relationship beyond the described services.
              Levine Law reserves the right to decline to act or withdraw from this engagement in accordance with its
              professional obligations. This engagement is subject to Levine Law&apos;s standard terms of engagement.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex-col items-stretch gap-4 border-t pt-6">
          <form onSubmit={handleAccept} className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg border bg-muted/30 px-4 py-4">
              <Checkbox
                id="accept"
                required
                checked={checked}
                onCheckedChange={(v) => setChecked(Boolean(v))}
                className="mt-0.5"
              />
              <Label htmlFor="accept" className="cursor-pointer text-sm leading-6 text-muted-foreground font-normal">
                I have read and agree to the terms of this service engagement. I understand this engagement does not
                create an ongoing lawyer-client relationship beyond the described scope.
              </Label>
            </div>

            <Button type="submit" disabled={pending || !checked} className="w-full h-10">
              {pending ? "Confirming..." : "Accept and confirm engagement"}
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground">
            Your acceptance is recorded with a timestamp. Levine Law will follow up to confirm receipt.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

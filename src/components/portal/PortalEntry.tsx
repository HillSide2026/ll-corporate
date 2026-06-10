import Image from "next/image"
import Link from "next/link"

import { previewPortalAccess, signInWithCredentials, signInWithKeycloak } from "src/lib/auth/actions"
import { isKeycloakConfigured } from "src/lib/auth/config"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { SignInButton } from "./SignInButton"

type PortalEntryProps = {
  authError?: string
  previewAccessEnabled?: boolean
}

function getAuthErrorMessage(authError?: string) {
  if (authError === "CredentialsSignIn") {
    return "Incorrect email or password. Please try again."
  }
  if (authError === "PreviewAccessDisabled") {
    return "Preview access is not enabled for this environment."
  }
  return authError
    ? "We could not complete sign-in. Please try again, or contact Levine Law if this keeps happening."
    : undefined
}

export function PortalEntry({ authError, previewAccessEnabled = false }: PortalEntryProps) {
  const authErrorMessage = getAuthErrorMessage(authError)
  const keycloakConfigured = isKeycloakConfigured()

  return (
    <main className="min-h-dvh bg-muted/30">
      <header className="border-b bg-background px-6 py-4">
        <div className="mx-auto max-w-6xl">
          <Link href="/">
            <Image
              src="/logos/levine-law-wordmark-navy-transparent-2.png"
              alt="Levine Law"
              width={1080}
              height={600}
              className="h-8 w-auto"
            />
          </Link>
        </div>
      </header>

      <div className="flex min-h-[calc(100dvh-57px)] items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-primary uppercase">Levine Law</p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight">Sign in to your account</h1>
          </div>

          <div className="rounded-xl bg-card ring-1 ring-foreground/10 px-6 py-7">
            {authErrorMessage ? (
              <div
                role="alert"
                className="mb-5 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm leading-6 text-destructive"
              >
                {authErrorMessage}
              </div>
            ) : null}

            <form action={signInWithCredentials} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" name="email" type="email" autoComplete="email" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" autoComplete="current-password" required />
              </div>
              <div className="pt-1">
                <SignInButton label="Sign in" pendingLabel="Signing in..." />
              </div>
            </form>

            {keycloakConfigured ? (
              <div className="mt-5">
                <Separator className="my-4" />
                <p className="mb-3 text-xs text-muted-foreground">Or sign in with your organisation account</p>
                <form action={signInWithKeycloak}>
                  <SignInButton label="Sign in with SSO" pendingLabel="Opening secure sign-in..." />
                </form>
              </div>
            ) : null}

            {previewAccessEnabled ? (
              <div className="mt-4">
                <Separator className="my-4" />
                <form action={previewPortalAccess}>
                  <button
                    type="submit"
                    className="w-full rounded-lg border bg-background px-5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
                  >
                    Preview portal
                  </button>
                </form>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">Preview mode uses a mock session for review only.</p>
              </div>
            ) : null}
          </div>

          <div className="mt-5 space-y-2 text-center text-sm text-muted-foreground">
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="font-semibold text-primary underline-offset-4 hover:underline">
                Create one
              </Link>
            </p>
            <p>
              Trouble signing in?{" "}
              <a
                href="mailto:matthew@levinelegal.ca"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                Email Levine Law
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

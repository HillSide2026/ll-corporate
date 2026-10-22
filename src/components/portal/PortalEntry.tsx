import Link from "next/link"

import { previewPortalAccess, signInWithCredentials, signInWithKeycloak } from "src/lib/auth/actions"
import { isKeycloakConfigured } from "src/lib/auth/config"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AuthSplit } from "./AuthSplit"
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
    <AuthSplit
      title="Welcome back."
      cardTitle="Sign in"
      footer={
        <>
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-brand-blue font-semibold underline-offset-4 hover:underline">
              Create one
            </Link>
          </p>
          <p>
            Trouble signing in?{" "}
            <a
              href="mailto:matthew@levinelegal.ca"
              className="text-brand-blue font-semibold underline-offset-4 hover:underline"
            >
              Email Levine Law
            </a>
          </p>
        </>
      }
    >
      {authErrorMessage ? (
        <div
          role="alert"
          className="border-destructive/20 bg-destructive/10 text-destructive mb-5 rounded-lg border px-4 py-3 text-sm leading-6"
        >
          {authErrorMessage}
        </div>
      ) : null}

      <form action={signInWithCredentials} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required className="h-11 rounded-lg" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="h-11 rounded-lg"
          />
        </div>
        <div className="pt-1">
          <SignInButton label="Sign in" pendingLabel="Signing in..." />
        </div>
      </form>

      {keycloakConfigured ? (
        <div className="mt-5">
          <Separator className="my-4" />
          <p className="text-muted-foreground mb-3 text-xs">Or sign in with your organisation account</p>
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
              className="bg-background text-muted-foreground hover:bg-muted w-full rounded-lg border px-5 py-2 text-sm font-medium transition-colors"
            >
              Preview portal
            </button>
          </form>
          <p className="text-muted-foreground mt-2 text-xs leading-5">
            Preview mode uses a mock session for review only.
          </p>
        </div>
      ) : null}
    </AuthSplit>
  )
}

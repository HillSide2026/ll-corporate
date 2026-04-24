import { PortalEntry } from "src/components/portal/PortalEntry"

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  const authError = typeof params?.error === "string" ? params.error : undefined

  return <PortalEntry authError={authError} />
}

import { expect, test } from "@playwright/test"

test("renders the public homepage with service menu access", async ({ page }) => {
  await page.goto("/")

  await expect(page).toHaveTitle("Levine LLP")
  await expect(
    page.getByRole("heading", { name: "Business counsel built for momentum, not bottlenecks." })
  ).toBeVisible()
  await expect(page.getByRole("link", { name: "Browse Services" })).toHaveAttribute("href", "/services")
})

test("renders the public corporate portal entry under the mounted path", async ({ page }) => {
  await page.goto("/corporate")

  await expect(page).toHaveTitle("Corporate Portal | Levine LLP")
  await expect(page.getByRole("heading", { name: "Client Portal" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Sign in securely" })).toBeVisible()
  await expect(page.getByText("Everything you need. All in one secure place.")).toBeVisible()
})

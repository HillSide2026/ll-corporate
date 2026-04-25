import { expect, test } from "@playwright/test"

test("renders the public corporate portal entry under the mounted path", async ({ page }) => {
  await page.goto("/corporate")

  await expect(page).toHaveTitle("Corporate Portal | Levine LLP")
  await expect(page.getByRole("heading", { name: "Client Portal" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Sign in securely" })).toBeVisible()
  await expect(page.getByText("Everything you need. All in one secure place.")).toBeVisible()
})

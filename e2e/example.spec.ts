import { expect, test } from "@playwright/test"

test("renders the public corporate portal entry under the mounted path", async ({ page }) => {
  await page.goto("/corporate")

  await expect(page).toHaveTitle("Levine LLP Corporate Portal")
  await expect(page.getByRole("heading", { name: "Corporate Portal" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible()
  await expect(page.getByText("Available after backend contract integration")).toBeVisible()
})

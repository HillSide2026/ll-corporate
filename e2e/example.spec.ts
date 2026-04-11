import { expect, test } from "@playwright/test"

test("renders the portal shell", async ({ page }) => {
  await page.goto("./")

  await expect(page).toHaveTitle("Levine LLP Corporate Portal")
  await expect(page.getByRole("heading", { name: "Corporate Portal" })).toBeVisible()
  await expect(page.getByText("ll-task-tracker remains the system of record.")).toBeVisible()
})

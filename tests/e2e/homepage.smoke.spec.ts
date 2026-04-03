import { expect, test } from "@playwright/test";

test("homepage loads and shows primary call to action", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/SparkCV|Resume|AI/i);
  await expect(
    page.getByRole("link", { name: /get started|sign in|start building/i }).first(),
  ).toBeVisible();
});

import { expect, test } from "@playwright/test";

test("editor route redirects unauthenticated users to auth", async ({ page }) => {
  await page.goto("/editor");

  await expect(page).toHaveURL(/sign-in|sign-up|clerk/i);
});

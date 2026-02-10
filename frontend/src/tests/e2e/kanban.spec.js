import { test, expect } from "@playwright/test";

test("open form via create button", async ({ page }) => {
  await page.goto("/");

  await page.locator('button:has-text("Create New Task")').click();
  await page.waitForTimeout(2000);

  const formInputs = await page.$$('input, textarea, select');
  console.log(`Found ${formInputs.length} form elements`);
  
  if (formInputs.length > 0) {
    console.log('✅ Form opened successfully');
  }
});

test("simple form fill", async ({ page }) => {
  await page.goto("/");

  await page.locator('button:has-text("Create New Task")').click();
  await page.waitForTimeout(2000);

  const taskName = "Simple Task " + Date.now();
  await page.locator('input').first().fill(taskName);
  await page.waitForTimeout(500);
  
  console.log('✅ Can fill form input');
});
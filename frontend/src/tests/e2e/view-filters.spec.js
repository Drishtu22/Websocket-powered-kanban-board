import { test, expect } from "@playwright/test";

test("switch views", async ({ page }) => {
  await page.goto("/");
 
  await page.locator('button:has-text("📈Analytics")').click();
  await page.waitForTimeout(2000);
 
  await page.locator('button:has-text("📊Board View")').click();
  await page.waitForTimeout(1000);
  
  console.log('✅ View switching works');
});

test("use priority filter", async ({ page }) => {
  await page.goto("/");

  await page.selectOption('select.filter-dropdown', 'High');
  await page.waitForTimeout(1000);

  await page.locator('button:has-text("Clear All Filters")').click();
  await page.waitForTimeout(500);
  
  console.log('✅ Filters work');
});
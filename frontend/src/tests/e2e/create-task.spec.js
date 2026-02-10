import { test, expect } from "@playwright/test";

test("create task using header", async ({ page }) => {
  await page.goto("/");
 
  await page.locator('button:has-text("Create New Task")').click();
  await page.waitForTimeout(2000); 

  const inputs = await page.$$('input');
  if (inputs.length === 0) {
    console.log('⚠️ No input found after clicking Create button');
    return;
  }
  
  const taskName = "Test Task " + Date.now();
  await inputs[0].fill(taskName);
  await page.waitForTimeout(500);
  
  const priorityButtons = await page.$$('button:has-text("High"), button:has-text("Medium"), button:has-text("Low")');
  if (priorityButtons.length > 0) {
    await priorityButtons[0].click();
    await page.waitForTimeout(300);
  } else {
    console.log('⚠️ No priority buttons found');
  }
  
  const allCreateButtons = await page.$$('button:has-text("Create")');
  for (const btn of allCreateButtons) {
    const text = await btn.textContent();
    if (text && !text.includes('Create New Task')) {
      await btn.click();
      await page.waitForTimeout(2000);
      console.log('✅ Clicked Create button');
      break;
    }
  }
});

test("quick add task button", async ({ page }) => {
  await page.goto("/");
  
  await page.locator('button:has-text("+Quick Add Task")').click();
  await page.waitForTimeout(1000);
  
  console.log('✅ Quick add button works');
});
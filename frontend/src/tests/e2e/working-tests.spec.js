import { test, expect } from "@playwright/test";

test("app loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Kanban Task Manager")).toBeVisible();
  console.log('✅ App loads');
});

test("columns exist", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("To Do").first()).toBeVisible();
  await expect(page.getByText("In Progress").first()).toBeVisible();
  await expect(page.getByText("Done").first()).toBeVisible();
  console.log('✅ Columns exist');
});

test("create new task button exists", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('button:has-text("Create New Task")')).toBeVisible();
  console.log('✅ Create new task button exists');
});

test("quick add button exists", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('button:has-text("+Quick Add Task")')).toBeVisible();
  console.log('✅ Quick add button exists');
});
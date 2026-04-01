import { test, expect } from '@playwright/test';

test.describe('Training Plan', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/plan');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('shows all 7 days', async ({ page }) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    for (const day of days) {
      await expect(page.getByText(day, { exact: true }).first()).toBeVisible();
    }
  });

  test('can assign muscle groups to a day', async ({ page }) => {
    // Click the first Edit button (Monday's)
    const editButtons = page.getByRole('button', { name: 'Edit' });
    await editButtons.first().click();

    // Select Chest and Triceps
    await page.getByRole('button', { name: 'Chest' }).click();
    await page.getByRole('button', { name: 'Triceps' }).click();
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify badges appear somewhere on the page
    // After saving, the Monday card should now show Chest and Triceps badges
    await expect(page.locator('span:has-text("Chest")').first()).toBeVisible();
    await expect(page.locator('span:has-text("Triceps")').first()).toBeVisible();
  });

  test('plan persists after reload', async ({ page }) => {
    // Click first Edit button (Monday's)
    await page.getByRole('button', { name: 'Edit' }).first().click();
    await page.getByRole('button', { name: 'Chest' }).click();
    await page.getByRole('button', { name: 'Save' }).click();

    await page.reload();

    // Verify Chest badge still shows
    await expect(page.locator('span:has-text("Chest")').first()).toBeVisible();
  });
});

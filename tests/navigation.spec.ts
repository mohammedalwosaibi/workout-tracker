import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('navbar links navigate to correct pages', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav').getByRole('link', { name: 'IronLog' })).toBeVisible();

    // Navigate to Exercises
    await page.locator('nav').getByRole('link', { name: 'Exercises' }).click();
    await expect(page).toHaveURL('/exercises');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Exercises');

    // Navigate to Today (day page)
    await page.locator('nav').getByRole('link', { name: 'Today' }).click();
    await expect(page).toHaveURL(/\/day\//);

    // Navigate to History
    await page.locator('nav').getByRole('link', { name: 'History' }).click();
    await expect(page).toHaveURL('/history');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Workout History');

    // Navigate back to Dashboard
    await page.locator('nav').getByRole('link', { name: 'Dashboard' }).click();
    await expect(page).toHaveURL('/');
  });
});

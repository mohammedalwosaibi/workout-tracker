import { test, expect } from '@playwright/test';

test.describe('Exercise Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/exercises');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('shows empty state when no exercises exist', async ({ page }) => {
    await expect(page.getByText('No exercises yet')).toBeVisible();
  });

  test('can add a new exercise with days', async ({ page }) => {
    await page.getByRole('button', { name: '+ Add Exercise' }).click();

    await page.locator('#exercise-name').fill('Barbell Bicep Curl');
    // Select Monday and Thursday
    await page.getByRole('button', { name: 'Mon' }).click();
    await page.getByRole('button', { name: 'Thu' }).click();
    await page.locator('#rep-min').fill('8');
    await page.locator('#rep-max').fill('12');
    await page.locator('#sets').fill('3');

    await page.locator('form').getByRole('button', { name: 'Add Exercise' }).click();

    await expect(page.getByText('Barbell Bicep Curl')).toBeVisible();
    await expect(page.getByText('1 exercise')).toBeVisible();
    // Days should be visible
    await expect(page.getByText('Mon, Thu')).toBeVisible();
  });

  test('exercise persists after reload', async ({ page }) => {
    await page.getByRole('button', { name: '+ Add Exercise' }).click();
    await page.locator('#exercise-name').fill('Bench Press');
    await page.getByRole('button', { name: 'Mon' }).click();
    await page.locator('form').getByRole('button', { name: 'Add Exercise' }).click();

    await page.reload();
    await expect(page.getByText('Bench Press')).toBeVisible();
  });

  test('can delete an exercise', async ({ page }) => {
    await page.getByRole('button', { name: '+ Add Exercise' }).click();
    await page.locator('#exercise-name').fill('Lat Pulldown');
    await page.getByRole('button', { name: 'Tue' }).click();
    await page.locator('form').getByRole('button', { name: 'Add Exercise' }).click();

    await expect(page.getByText('Lat Pulldown')).toBeVisible();

    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByText('Lat Pulldown')).not.toBeVisible();
  });
});

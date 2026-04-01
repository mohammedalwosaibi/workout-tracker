import { test, expect } from '@playwright/test';

test.describe('Progressive Overload', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/exercises');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Add exercise assigned to Monday
    await page.getByRole('button', { name: '+ Add Exercise' }).click();
    await page.locator('#exercise-name').fill('Bench Press');
    await page.getByRole('button', { name: 'Mon' }).click();
    await page.locator('#rep-min').fill('8');
    await page.locator('#rep-max').fill('12');
    await page.locator('#sets').fill('3');
    await page.locator('form').getByRole('button', { name: 'Add Exercise' }).click();
  });

  test('shows first-time message for new exercises', async ({ page }) => {
    await page.goto('/day/monday');
    await expect(page.getByText('First time')).toBeVisible();
  });

  test('shows suggestions after first workout', async ({ page }) => {
    await page.goto('/day/monday');

    // Log first workout: 40lbs x 10 reps x 3 sets
    const inputs = await page.locator('input[type="number"]').all();
    for (let i = 0; i < inputs.length; i++) {
      await inputs[i].fill(i % 2 === 0 ? '40' : '10');
    }

    await page.getByRole('button', { name: 'Finish Workout' }).click();
    await expect(page.getByText('Workout Complete')).toBeVisible();

    // Go back and visit day page again
    await page.goto('/day/monday');

    // Should show suggestion to increase reps (+1 rep on first set)
    await expect(page.getByText('+1 rep')).toBeVisible();
    // Should show "Last time" values
    await expect(page.getByText('40 × 10').first()).toBeVisible();
  });
});

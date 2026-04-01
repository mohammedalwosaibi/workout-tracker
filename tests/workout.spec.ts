import { test, expect } from '@playwright/test';

test.describe('Workout Logging via /day/[day]', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/exercises');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Add an exercise assigned to Monday
    await page.getByRole('button', { name: '+ Add Exercise' }).click();
    await page.locator('#exercise-name').fill('Dumbbell Curl');
    await page.getByRole('button', { name: 'Mon' }).click();
    await page.locator('#rep-min').fill('8');
    await page.locator('#rep-max').fill('12');
    await page.locator('#sets').fill('3');
    await page.locator('form').getByRole('button', { name: 'Add Exercise' }).click();
    await expect(page.getByText('Dumbbell Curl')).toBeVisible();
  });

  test('shows exercises for the day', async ({ page }) => {
    await page.goto('/day/monday');
    await expect(page.getByText('Dumbbell Curl')).toBeVisible();
  });

  test('shows empty state for day with no exercises', async ({ page }) => {
    await page.goto('/day/tuesday');
    await expect(page.getByText('No exercises for this day')).toBeVisible();
  });

  test('can log a workout and see completion screen', async ({ page }) => {
    await page.goto('/day/monday');

    // Fill in sets - 3 sets of weight + reps inputs
    const inputs = await page.locator('input[type="number"]').all();
    for (let i = 0; i < inputs.length; i++) {
      await inputs[i].fill(i % 2 === 0 ? '40' : '10');
    }

    // Finish workout
    await page.getByRole('button', { name: 'Finish Workout' }).click();
    await expect(page.getByText('Workout Complete')).toBeVisible();
  });

  test('shows invalid day error', async ({ page }) => {
    await page.goto('/day/notaday');
    await expect(page.getByText('Invalid day')).toBeVisible();
  });
});

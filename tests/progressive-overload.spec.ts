import { test, expect } from '@playwright/test';

test.describe('Progressive Overload', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/exercises');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Add exercise
    await page.click('text=Add Exercise');
    await page.fill('#exercise-name', 'Bench Press');
    await page.selectOption('#muscle-group', 'chest');
    await page.fill('#rep-min', '8');
    await page.fill('#rep-max', '12');
    await page.fill('#sets', '3');
    await page.click('button:has-text("Add Exercise"):not(:has-text("+"))');
  });

  test('shows first-time message for new exercises', async ({ page }) => {
    await page.goto('/workout');
    await page.click('text=Bench Press');
    await expect(page.locator('text=First time')).toBeVisible();
  });

  test('shows suggestions after first workout', async ({ page }) => {
    await page.goto('/workout');
    await page.click('text=Bench Press');

    // Log first workout: 40lbs x 10 reps x 3 sets
    const inputs = await page.locator('input[type="number"]').all();
    for (let i = 0; i < inputs.length; i++) {
      await inputs[i].fill(i % 2 === 0 ? '40' : '10');
    }

    await page.click('text=Add to Session');
    await page.click('button:has-text("Finish Workout")');

    // Start new workout
    await page.click('text=New Workout');
    await page.click('text=Bench Press');

    // Should show suggestion to increase reps
    await expect(page.locator('text=extra rep')).toBeVisible();
    // Should show "Last time" values
    await expect(page.locator('text=40 × 10').first()).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';

test.describe('Workout Logging', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/exercises');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Add an exercise first
    await page.click('text=Add Exercise');
    await page.fill('#exercise-name', 'Dumbbell Curl');
    await page.selectOption('#muscle-group', 'biceps');
    await page.fill('#rep-min', '8');
    await page.fill('#rep-max', '12');
    await page.fill('#sets', '3');
    await page.click('button:has-text("Add Exercise"):not(:has-text("+"))');
    await expect(page.locator('text=Dumbbell Curl')).toBeVisible();
  });

  test('shows exercises to pick from', async ({ page }) => {
    await page.goto('/workout');
    await expect(page.locator('text=Dumbbell Curl')).toBeVisible();
  });

  test('can log a workout and see completion screen', async ({ page }) => {
    await page.goto('/workout');

    // Select exercise
    await page.click('text=Dumbbell Curl');

    // Fill in sets
    const weightInputs = page.locator('input[type="number"]').filter({ has: page.locator('[placeholder="0"]') });
    const inputs = page.locator('input[type="number"]');

    // Fill weight and reps for 3 sets (6 inputs total)
    const allInputs = await inputs.all();
    // Weight inputs: index 0, 2, 4; Reps: 1, 3, 5
    for (let i = 0; i < allInputs.length; i++) {
      if (i % 2 === 0) {
        await allInputs[i].fill('40');
      } else {
        await allInputs[i].fill('10');
      }
    }

    // Add to session
    await page.click('text=Add to Session');
    await expect(page.locator('text=This Session')).toBeVisible();

    // Finish workout
    await page.click('button:has-text("Finish Workout")');
    await expect(page.locator('text=Workout Complete')).toBeVisible();
  });

  test('shows empty state when no exercises exist', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.goto('/workout');
    await expect(page.locator('text=No exercises added yet')).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';

test('exercises exist, all rest days, navigate from welcome', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  // Welcome screen
  await expect(page.getByText('Welcome to IronLog')).toBeVisible();

  // Click "Add Your Exercises"
  await page.getByRole('link', { name: 'Add Your Exercises' }).click();
  await expect(page).toHaveURL('/exercises');

  // Add an exercise
  await page.getByRole('button', { name: '+ Add Exercise' }).click();
  await page.locator('#exercise-name').fill('Bench Press');
  await page.locator('#muscle-group').selectOption('chest');
  await page.locator('form').getByRole('button', { name: 'Add Exercise' }).click();
  await expect(page.getByText('Bench Press')).toBeVisible();

  // Go back to dashboard
  await page.locator('nav').getByRole('link', { name: 'Dashboard' }).click();
  await expect(page).toHaveURL('/');

  // Should show dashboard h1 without crashing
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByText('No training plan set')).toBeVisible();

  // Check no error overlay
  const errorOverlay = page.locator('[id="__next-error"]');
  await expect(errorOverlay).not.toBeVisible();
});

test('plan set with all rest days, exercises exist', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  // Add exercise
  await page.goto('/exercises');
  await page.getByRole('button', { name: '+ Add Exercise' }).click();
  await page.locator('#exercise-name').fill('Squat');
  await page.locator('#muscle-group').selectOption('legs');
  await page.locator('form').getByRole('button', { name: 'Add Exercise' }).click();

  // Set up plan - only assign muscles to one day (Monday)
  await page.goto('/plan');
  await page.getByRole('button', { name: 'Edit' }).first().click();
  await page.getByRole('button', { name: 'Legs' }).click();
  await page.getByRole('button', { name: 'Save' }).click();

  // Go to dashboard
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  // Page rendered successfully
  const body = await page.textContent('body');
  expect(body).toBeTruthy();
  expect(body).not.toContain('Unhandled Runtime Error');
});

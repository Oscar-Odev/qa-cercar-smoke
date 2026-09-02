import { test, expect } from '@playwright/test';

test.describe('CerCar — legal pages smoke', () => {
  test('privacy page loads', async ({ page }) => {
    await page.goto('/legal/privacidad');
    await expect(page).toHaveTitle(/privacidad/i);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/privacidad/i);
    await expect(page.getByRole('navigation', { name: 'Documentos' })).toBeVisible();
  });

  test('terms page loads', async ({ page }) => {
    await page.goto('/legal/terminos');
    await expect(page).toHaveTitle(/Términos/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/términos/i);
  });

  test('cookies page loads', async ({ page }) => {
    await page.goto('/legal/cookies');
    await expect(page).toHaveTitle(/cookies/i);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/cookies/i);
  });
});

import { test, expect } from '@playwright/test';

test.describe('CerCar — login smoke', () => {
  test('login page renders core UI', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/Cercar · Acceso/);
    await expect(page.getByRole('heading', { name: 'Iniciar sesión' })).toBeVisible();
    await expect(page.getByLabel('Correo electrónico')).toBeVisible();
    await expect(page.getByLabel('Contraseña', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeEnabled();
    await expect(page.getByRole('link', { name: 'Crear cuenta gratis' })).toHaveAttribute('href', '/register');
    await expect(page.getByRole('link', { name: '¿Olvidaste tu contraseña?' })).toHaveAttribute(
      'href',
      '/forgot-password',
    );
  });

  test('invalid credentials show error without crashing', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Correo electrónico').fill('qa-invalid@example.com');
    await page.getByLabel('Contraseña', { exact: true }).fill('not-a-real-password');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page.getByRole('alert')).toContainText(/incorrectos|intento/i);
    await expect(page).toHaveURL(/\/login/);
  });

  test('clean URL /login works', async ({ page }) => {
    const res = await page.goto('/login');
    expect(res?.status()).toBe(200);
  });
});

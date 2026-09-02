import { test, expect } from '@playwright/test';

test.describe('CerCar — routing & public shell', () => {
  test('home redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
  });

  test('register page is reachable', async ({ page }) => {
    await page.goto('/register');
    await expect(page).toHaveTitle(/Cercar/);
    await expect(page.getByRole('link', { name: /Iniciar sesión|Entrar/i })).toBeVisible();
  });

  test('invalid share link shows friendly error', async ({ page }) => {
    await page.goto('/s/invalidtokenqa');
    await expect(page.getByRole('heading', { name: /No se pudo abrir la invitación/i })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ir a iniciar sesión' })).toHaveAttribute('href', '/login');
  });

  test('static brand asset is served', async ({ request }) => {
    const res = await request.get('/assets/brand/cercar-logo.png');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type'] ?? '').toMatch(/image\//);
  });
});

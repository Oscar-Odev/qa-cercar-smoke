import { test, expect } from '@playwright/test';
import { baseUrl, hasQaCredentials, qaCredentials } from '../helpers/env';

test.describe('CerCar API — authenticated (optional)', () => {
  test.skip(!hasQaCredentials(), 'Set CERCAR_QA_EMAIL and CERCAR_QA_PASSWORD');

  test.beforeEach(async ({ page }) => {
    const creds = qaCredentials()!;
    await page.goto('/login');
    await page.getByLabel('Correo electrónico').fill(creds.email);
    await page.getByLabel('Contraseña', { exact: true }).fill(creds.password);
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page).toHaveURL(/\/(\?.*)?$/);
  });

  test('authenticated health returns KPIs', async ({ request }) => {
    const res = await request.get(`${baseUrl()}/api.php?action=health`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.health).toBeDefined();
    expect(body.kpis).toBeDefined();
  });

  test('authenticated bootstrap is not guest', async ({ request }) => {
    const res = await request.get(`${baseUrl()}/api.php?action=bootstrap`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.guest).toBe(false);
    expect(body.readOnly).toBe(false);
  });
});

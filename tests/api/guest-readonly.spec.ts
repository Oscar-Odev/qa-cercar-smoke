import { test, expect } from '@playwright/test';
import { baseUrl, guestSharePath, hasGuestShare } from '../helpers/env';

test.describe('CerCar API — guest read-only (optional)', () => {
  test.skip(!hasGuestShare(), 'Set CERCAR_GUEST_SHARE_PATH to enable guest API smoke');

  test('guest can read health after share activation', async ({ page, request }) => {
    const sharePath = guestSharePath()!;
    const shareRes = await page.goto(sharePath);
    expect(shareRes?.status()).toBeLessThan(400);

    const api = `${baseUrl()}/api.php`;
    const health = await request.get(`${api}?action=health`);
    expect(health.status()).toBe(200);
    const body = await health.json();
    expect(body.ok).toBe(true);
    expect(body.health).toBeDefined();
    expect(body.kpis).toBeDefined();
  });

  test('guest cannot mutate data (read_only)', async ({ page, request }) => {
    const sharePath = guestSharePath()!;
    await page.goto(sharePath);

    const api = `${baseUrl()}/api.php`;
    const res = await request.post(`${api}?action=add_event`, {
      data: { operation: 'qa-guest-blocked', date: '2026-01-01' },
    });
    expect(res.status()).toBe(403);
    const body = await res.json();
    expect(body).toMatchObject({ ok: false, error: 'read_only' });
  });

  test('guest bootstrap payload marks readOnly', async ({ page, request }) => {
    const sharePath = guestSharePath()!;
    await page.goto(sharePath);

    const res = await request.get(`${baseUrl()}/api.php?action=bootstrap`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.readOnly).toBe(true);
    expect(body.guest).toBe(true);
  });
});

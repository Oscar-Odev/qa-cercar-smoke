import { test, expect } from '@playwright/test';
import { baseUrl } from '../helpers/env';

const api = `${baseUrl()}/api.php`;

test.describe('CerCar API — unauthenticated guard', () => {
  test('GET health requires session', async ({ request }) => {
    const res = await request.get(`${api}?action=health`);
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body).toMatchObject({ ok: false, error: 'auth' });
  });

  test('GET bootstrap requires session', async ({ request }) => {
    const res = await request.get(`${api}?action=bootstrap`);
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toBe('auth');
  });

  test('GET get requires session', async ({ request }) => {
    const res = await request.get(`${api}?action=get`);
    expect(res.status()).toBe(401);
  });

  test('POST add_event is rejected without session', async ({ request }) => {
    const res = await request.post(`${api}?action=add_event`, {
      data: { operation: 'qa-smoke-probe', date: '2026-01-01' },
    });
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body).toMatchObject({ ok: false, error: 'auth' });
  });

  test('POST add_intervention is rejected without session', async ({ request }) => {
    const res = await request.post(`${api}?action=add_intervention`, {
      data: { operation: 'qa-smoke-probe' },
    });
    expect(res.status()).toBe(401);
  });

  test('unknown action without session returns auth error', async ({ request }) => {
    const res = await request.get(`${api}?action=__qa_unknown__`);
    expect(res.status()).toBe(401);
  });
});

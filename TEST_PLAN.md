# TEST_PLAN — CerCar smoke (qa-cercar-smoke)

## 1. Objective

Provide **fast, repeatable smoke coverage** for CerCar public surfaces and API auth boundaries — suitable for CI and portfolio evidence in **QA Automation** roles.

**SUT:** https://cercar.odev.es (lab/production homelab)

## 2. Test strategy

```
        ┌─────────────────┐
        │  CI smoke (P0)  │  Always run — no secrets
        └────────┬────────┘
                 │
    ┌────────────┼────────────┐
    ▼            ▼            ▼
 API guard    E2E public   Static assets
 (401)        pages/routes
                 │
        ┌────────┴────────┐
        │ Optional (P1)   │  GitHub Secrets / local .env
        └────────┬────────┘
                 │
         Guest share API
         Authenticated API
```

| Priority | Suite | Count | Pass criteria |
|----------|-------|-------|---------------|
| **P0** | `auth-guard.spec.ts` | 6 | 401 on unauthenticated API |
| **P0** | `login.spec.ts` | 3 | Login UI + invalid creds |
| **P0** | `legal.spec.ts` | 3 | Legal docs render |
| **P0** | `routing.spec.ts` | 4 | Redirects, share error, logo |
| **P1** | `guest-readonly.spec.ts` | 3 | Needs `CERCAR_GUEST_SHARE_PATH` |
| **P1** | `authenticated.spec.ts` | 2 | Needs QA email/password |

**Total:** 21 tests (14 always active + 7 optional)

## 3. API test cases

### 3.1 Unauthenticated guard (P0)

| ID | Method | Action | Expected |
|----|--------|--------|----------|
| API-01 | GET | `health` | 401, `{ ok: false, error: "auth" }` |
| API-02 | GET | `bootstrap` | 401 |
| API-03 | GET | `get` | 401 |
| API-04 | POST | `add_event` | 401 |
| API-05 | POST | `add_intervention` | 401 |
| API-06 | GET | unknown action | 401 |

### 3.2 Guest read-only (P1, optional)

Precondition: valid share URL opens guest session.

| ID | Step | Expected |
|----|------|----------|
| API-G01 | GET `health` | 200, `ok: true`, `health` + `kpis` present |
| API-G02 | POST `add_event` | 403, `error: "read_only"` |
| API-G03 | GET `bootstrap` | 200, `readOnly: true`, `guest: true` |

### 3.3 Authenticated (P1, optional)

Precondition: email/password login via UI.

| ID | Step | Expected |
|----|------|----------|
| API-A01 | GET `health` | 200, KPIs present |
| API-A02 | GET `bootstrap` | 200, `guest: false`, `readOnly: false` |

## 4. E2E test cases

| ID | Flow | Expected |
|----|------|----------|
| E2E-01 | `/login` | Title, form, links |
| E2E-02 | Bad login | Alert, stay on login |
| E2E-03 | `/legal/privacidad` | H1 + nav |
| E2E-04 | `/legal/terminos` | H1 terms |
| E2E-05 | `/legal/cookies` | H1 cookies |
| E2E-06 | `/` unauthenticated | Redirect to `/login` |
| E2E-07 | `/register` | Page loads |
| E2E-08 | Invalid `/s/...` | Friendly error + link login |
| E2E-09 | Logo PNG | 200 image/* |

## 5. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Flaky network / homelab downtime | CI retries=2; monitor Uptime Kuma |
| Production data mutation | No happy-path write tests without QA tenant |
| Google OAuth in login | Not automated; email path optional via secrets |
| Rate limit on bad login | Single invalid-login test per run |
| UI copy changes | Prefer role/label selectors tied to Spanish copy |

## 6. Future work (P2)

- [ ] Dedicated `qa@` user on isolated db snapshot
- [ ] Visual regression on login/legal
- [ ] Contract tests for `bootstrap` JSON schema
- [ ] Scheduled cron workflow (nightly smoke)

## 7. Traceability

| Business rule | Test |
|---------------|------|
| API requires session | API-01…06 |
| Guest cannot write | API-G02 |
| Home is private | E2E-06 |
| Legal compliance pages exist | E2E-03…05 |

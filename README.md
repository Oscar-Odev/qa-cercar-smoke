# qa-cercar-smoke

Smoke and API regression suite for **[CerCar](https://cercar.odev.es)** — personal vehicle passport app in production on my homelab.

Built with **Playwright + TypeScript** as part of my QA automation portfolio ([portfolio.odev.es/testing](https://portfolio.odev.es/testing)).

## Scope

| Layer | What we verify |
|-------|----------------|
| **API guard** | Unauthenticated requests return `401` + `error: auth` |
| **API guest** *(optional)* | Read-only share session: `health`/`bootstrap` OK, mutations `403 read_only` |
| **API auth** *(optional)* | Email login session: bootstrap not guest |
| **E2E smoke** | Login, legal pages, routing, invalid share link, static assets |

**Out of scope (by design):** Google OAuth, Gemini uploads, Stripe, destructive mutations on production without a dedicated QA tenant.

## Quick start

```bash
git clone git@github.com:Oscar-Odev/qa-cercar-smoke.git
cd qa-cercar-smoke
npm ci
npx playwright install chromium
cp .env.example .env   # optional secrets
npm test
```

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `CERCAR_BASE_URL` | No | Default `https://cercar.odev.es` |
| `CERCAR_GUEST_SHARE_PATH` | No | e.g. `/s/Ab12Cd` — enables guest API tests |
| `CERCAR_QA_EMAIL` | No | QA account email |
| `CERCAR_QA_PASSWORD` | No | QA account password |

CI runs **public smoke only** (no secrets). Optional tests skip automatically when env vars are missing.

## Scripts

```bash
npm test          # full suite
npm run test:api  # API only
npm run test:e2e  # browser only
npm run report    # HTML report
```

## CI

GitHub Actions workflow `.github/workflows/playwright.yml` runs on push/PR to `main`.

## Decisions

- **Production target** — real HTTPS endpoint; tests are read-only or auth-guard only.
- **No Selenium/Cypress** — Playwright for modern API + E2E in one toolchain.
- **Conditional suites** — secrets via env; core smoke always green without credentials.
- **Spanish UI** — selectors use accessible roles/labels from CerCar UI copy.

## Author

**Oscar Carreras Yagüe** — [Portfolio](https://portfolio.odev.es) · [LinkedIn](https://www.linkedin.com/in/oscarcarrerasyague) · [CerCar](https://cercar.odev.es)

# SauceDemo E2E Tests

Automated end-to-end test suite for [saucedemo.com](https://www.saucedemo.com) built with [Playwright](https://playwright.dev/) and TypeScript, following the Page Object Model pattern.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

Verify your versions:

```bash
node --version
npm --version
```

---

## Local Setup

**1. Clone or download the project**

```bash
cd tema_Rasirom
```

**2. Install npm dependencies**

```bash
npm install
```

**3. Install Playwright browsers**

```bash
npx playwright install
```

This downloads Chromium, Firefox, and WebKit — required for running the tests.

---

## Running Tests

| Command                | Description                                                 |
| ---------------------- | ----------------------------------------------------------- |
| `npm test`             | Run all tests headless (Chromium + Firefox + WebKit)        |
| `npm run test:headed`  | Run all tests with a visible browser window                 |
| `npm run test:staging` | Run tests using the staging config (Chromium only, 1 retry) |
| `npm run test:report`  | Open the last HTML report in your browser                   |

### Examples

Run a single test by name:

```bash
npx playwright test -g "Login succesfully"
```

Run only on one browser:

```bash
npx playwright test --project=chromium
```

---

## HTML Report

After every test run an HTML report is generated automatically.  
Open it with:

```bash
npm run test:report
```

- Default config report → `playwright-report/`
- Staging config report → `playwright-report-staging/`

---

## Screenshots & Videos

Playwright is configured to capture evidence automatically on failure:

| Artifact       | When captured       |
| -------------- | ------------------- |
| **Screenshot** | Only on failure     |
| **Video**      | Retained on failure |
| **Trace**      | On first retry      |

Artifacts are saved inside `test-results/` and linked directly in the HTML report.  
To view a trace file interactively:

```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

---

## Environment Configuration

The base URL is controlled via the `BASE_URL` environment variable.

| File                           | Purpose                                                         |
| ------------------------------ | --------------------------------------------------------------- |
| `.env`                         | Local environment (`https://www.saucedemo.com`)                 |
| `.env.staging`                 | Staging environment — replace the URL with your staging server  |
| `playwright.config.ts`         | Default config — all browsers, 0 retries locally                |
| `playwright.config.staging.ts` | Staging config — Chromium only, 1 retry, separate report folder |

To run against a custom URL without editing any file:

```bash
# Windows PowerShell
$env:BASE_URL="https://your-env.example.com"; npm test

# Linux / macOS
BASE_URL=https://your-env.example.com npm test
```

---

## Project Structure

```
├── data/
│   ├── users.json               # Login credentials (valid & invalid)
│   ├── products.json            # Product IDs and display names
│   └── checkout.json            # Checkout form data (name, postal code)
├── pages/
│   ├── LoginPage.ts             # Login page object
│   ├── InventoryPage.ts         # Product listing page object
│   ├── CartPage.ts              # Cart page object
│   └── CheckoutPage.ts          # Checkout steps page object
├── tests-e2e/
│   └── saucedemo.spec.ts        # All test scenarios
├── test-results/                # Artifacts from failed tests (auto-generated)
├── playwright-report/           # HTML report — default (auto-generated)
├── playwright-report-staging/   # HTML report — staging (auto-generated)
├── playwright.config.ts         # Default Playwright config
├── playwright.config.staging.ts # Staging Playwright config
├── tsconfig.json                # TypeScript configuration
├── .env                         # Local base URL
└── .env.staging                 # Staging base URL
```

---

## Test Scenarios

| #   | Name                               | What it verifies                                                                    |
| --- | ---------------------------------- | ----------------------------------------------------------------------------------- |
| 1   | **Login successfully**             | Valid credentials → redirect to inventory page, product list visible                |
| 2   | **Login with invalid credentials** | Error message displayed, user stays on login page                                   |
| 3   | **Add product to cart**            | Basket counter updates to 1, product appears in cart page                           |
| 4   | **Complete checkout**              | Full order flow: add to cart → checkout → fill form → finish → confirmation message |

---

## Test Data

All test data lives in the `data/` folder — nothing is hardcoded in the tests.

**`data/users.json`** — credentials  
**`data/products.json`** — product id and display name used across tests  
**`data/checkout.json`** — first name, last name, postal code for the checkout form

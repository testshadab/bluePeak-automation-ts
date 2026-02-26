# BluePeak Automation Framework

End-to-End UI Automation Framework built using **Playwright + TypeScript + Allure Reporting**.

---

## Setup

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

---

## Running Tests

### Headed Mode
```bash
npx playwright test --headed
```

### Headless Mode
```bash
npx playwright test
```

### Run a Specific File
```bash
npx playwright test tests/example.spec.ts --headed
```

### Run by Test Name
```bash
npx playwright test -g "Test Name" --headed
```

### Run in a Specific Browser
```bash
npx playwright test --project=chromium --headed
```

---

# Reporting

## Playwright HTML Report

After execution:

```bash
npx playwright show-report
```

---

# Allure Reporting

Allure provides:
- Step-level reporting
- Screenshots
- Attachments
- Retry tracking
- Execution history
- Environment details

---

## Step 1: Run Tests

```bash
npx playwright test
```

This generates:

```
allure-results/
```

---

## Step 2: Generate Allure Report

```bash
npx allure generate allure-results --clean
```

This generates:

```
allure-report/
```

---

## Step 3: Open Allure Report

```bash
npx allure open allure-report
```

---

## Using NPM Scripts (Recommended)

If scripts are configured in `package.json`:

```bash
npm run test
npm run allure:generate
npm run allure:open
```

---

## 🧹 Clean Reports

```bash
npm run clean
```

This removes:
- allure-results
- allure-report
- test-results

---

# 📂 Project Structure

```
bluePeak-automation-ts/
├── tests/                  # Test specs
├── pages/                  # Page Object Model (POM)
├── utils/                  # Helpers/utilities
├── fixtures/               # Fixtures (if used)
├── test-data/              # Test data (if used)
├── playwright.config.ts    # Playwright configuration
├── package.json
└── README.md
```

---

# 🛠 Tech Stack

- Playwright
- TypeScript
- Allure Report
- Node.js

---

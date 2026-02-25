# BluePeak Automation Framework

End-to-End UI Automation Framework built using **Playwright + TypeScript**.

## Setup

```bash
npm install
npx playwright install

# Headed (current command)
npx playwright test --headed

# Headless
npx playwright test

# Run a specific file
npx playwright test tests/example.spec.ts --headed

# Run by test name
npx playwright test -g "Test Name" --headed

# Run in a specific browser
npx playwright test --project=chromium --headed

bluePeak-automation-ts/
├── tests/                  # Test specs
├── pages/                  # Page Object Model (POM)
├── utils/                  # Helpers/utilities
├── fixtures/               # Fixtures (if used)
├── test-data/              # Test data (if used)
├── playwright.config.ts    # Playwright config
├── package.json
└── README.md

# Report
npx playwright show-report
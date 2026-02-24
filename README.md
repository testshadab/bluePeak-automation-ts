# AI QA Tests

AI-driven end-to-end testing framework for the CarCloud chatbot using Cucumber BDD with Playwright.

## Overview

This package provides automated QA testing for the CarCloud AI chat widget, including:

- **Smoke Tests**: Quick post-deployment verification
- **Booking Tests**: Full end-to-end booking flow validation
- **No-Booking Tests**: Conversation exploration without completing bookings

## Quick Start

```bash
cd ai-qa-tests

# Install dependencies (standalone from main project)
npm install

# Install Playwright browsers
npx playwright install chromium

# Run smoke tests
npm run test:smoke

# Run full test suite
npm run test:full
```

## Project Structure

```
ai-qa-tests/                 # Standalone project (separate deps from main monorepo)
├── configs/                 # Environment and test profile configurations
├── features/                # Cucumber feature files
│   ├── booking/             # Booking process tests
│   ├── smoke/               # Post-deployment smoke tests
│   └── step-definitions/    # Step implementation files
├── pages/                   # Page Object Model
├── support/                 # Cucumber World and hooks
├── test-data/               # Test configuration and data
└── utils/                   # Utility functions
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run test` | Run all tests |
| `npm run test:smoke` | Run smoke tests only (quick verification) |
| `npm run test:full` | Run complete test suite |
| `npm run test:booking` | Run booking process tests |
| `npm run test:no-booking` | Run no-booking flow tests |
| `npm run test:dev` | Run tests against development environment |
| `npm run test:prod` | Run tests against production environment |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `TARGET_URL` | Chat widget URL to test | Auto-detected from `TARGET_ENV` |
| `TARGET_ENV` | Target environment (`development`, `production`, `local`) | `development` |
| `OPENAI_API_KEY` | OpenAI API key for AI prompt generation | Required |
| `HEADLESS` | Run browser in headless mode | `true` |
| `SLOW_MO` | Slow down browser actions (ms) | `0` |
| `SHARD_INDEX` | Shard index for parallel execution | `0` |
| `SHARD_TOTAL` | Total number of shards | `1` |

## CI/CD Integration

### Periodic Tests

Tests run automatically on schedule via `.github/workflows/ai-qa-periodic.yml`:
- **Schedule**: Twice daily at 6 AM and 6 PM UTC
- **Manual Trigger**: Available via workflow dispatch

### Post-Deployment Smoke Tests

Automatically runs after each deployment via `.github/workflows/deploy.yml`:
- Validates chat widget is functioning after deployment
- Sends email notification on failure

## Test Tags

Use Cucumber tags to run specific test subsets:

| Tag | Description |
|-----|-------------|
| `@smoke` | Post-deployment verification tests |
| `@booking` | Complete booking flow tests |
| `@no-booking` | Exploration tests without booking |
| `@shard0`, `@shard1` | Parallel execution shards |

## Reports

Test reports are generated in the `reports/` directory:
- `cucumber-report.html` - HTML report
- `cucumber-report.json` - JSON report for CI/CD
- Per-test directories with CSV logs and traces

## Adding New Tests

1. Create a feature file in `features/`:
   ```gherkin
   @my-tag
   Feature: My Test Feature

     Scenario: My test scenario
       Given I am on the chat widget page
       When I start a new conversation
       Then I should see the welcome message
   ```

2. Add step definitions in `features/step-definitions/` if needed

3. Add test data to `test-data/config.json` if needed

## Troubleshooting

### Browser not launching
```bash
npx playwright install chromium
```

### Tests timing out
Increase timeout in `cucumber.ts` or set `BROWSER_TIMEOUT` env var.

### OpenAI API errors
Ensure `OPENAI_API_KEY` is set correctly. The API is used for generating natural customer responses during tests.


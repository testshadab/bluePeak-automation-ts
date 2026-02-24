/**
 * Cucumber configuration for AI QA tests
 *
 * Note: Step timeouts are configured in configs/timeouts.ts and applied in support/hooks.ts
 */

const common = {
  requireModule: ['tsx'],
  require: ['features/step-definitions/**/*.ts', 'support/**/*.ts'],
  formatOptions: {
    snippetInterface: 'async-await',
  },
};

module.exports = {
  default: {
    ...common,
    paths: ['features/**/*.feature'],
    format: [
      'progress-bar',
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html',
    ],
  },
  smoke: {
    ...common,
    paths: ['features/smoke/**/*.feature'],
    format: [
      'progress-bar',
      'json:reports/smoke-report.json',
    ],
  },
  booking: {
    ...common,
    paths: ['features/**/*.feature'],
    format: [
      'progress-bar',
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html',
    ],
  },
  'no-booking': {
    ...common,
    paths: ['features/**/*.feature'],
    format: [
      'progress-bar',
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html',
    ],
  },
  'multi-Tab': {
    ...common,
    paths: ['features/**/*.feature'],
    format: [
      'progress-bar',
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html',
    ],
  },
};

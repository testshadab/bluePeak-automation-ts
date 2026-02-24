/**
 * Centralized timeout configuration for AI QA tests
 * All timeout values in milliseconds
 *
 * Note: Step timeouts are configured in cucumber.cjs profiles
 */

export const Timeouts = {
  // Step timeouts (Cucumber)
  step: {
    default: 600_000, // 10 min - default step timeout
    smoke: 600_000, // 10 min - smoke test step timeout
    booking: 3_600_000 // 1 hours - booking test step timeout
  },

  // Browser/Playwright timeouts
  browser: {
    default: 600_000, // 10 min - browser context timeout
    navigation: 600_000, // 10 min - page navigation timeout
  },

  // Chatbot interaction timeouts
  chatbot: {
    buttonVisible: 30_000, // 30 sec - wait for chatbot button
    screenVisible: 30_000, // 30 sec - wait for chat screen
    inputVisible: 30_000, // 30 sec - wait for input field
    responseLocator: 30_000, // 30 sec - wait for response element
    indicatorAppear: 8_000, // 20 sec - wait for "checking" indicator
    indicatorHidden: 120_000, // 3 min - wait for response to complete
    newSession: 50_000, // 50 sec - wait for new session
    widgetLoad: 10_000, // 10 sec - wait for widget to load after click
    promptDelay: 2_000, // 2 sec - delay after filling prompt
    betweenPrompts: 1_000, // 1 sec - delay between prompts
  },
} as const;

export type TimeoutConfig = typeof Timeouts;


import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { ChatbotPage } from '../pages/chatbot.page.js';
import { Timeouts } from '../configs/index.js';
import { TestCase } from '../utils/merge-prompts.js';
import { TestWriters } from '../utils/reporting.js';

/**
 * Execution configuration
 */
interface BrowserConfig {
  headless: boolean;
  slowMo: number;
  timeout: number;
}

const defaultConfig: BrowserConfig = {
  headless: process.env.HEADLESS !== 'false',
  slowMo: Number(process.env.SLOW_MO) || 0,
  timeout: Number(process.env.BROWSER_TIMEOUT) || Timeouts.browser.default,
};

/**
 * Custom World class for Cucumber with Playwright integration
 */
export class CustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page!: Page;
  chatbot!: ChatbotPage;

  originalPage?: Page;
  duplicatedPage?: Page;

  // Test case data
  testCase?: TestCase;
  reporters?: TestWriters;
  testStart?: number;

  // Sharding support
  shardIndex: number = 0;
  shardTotal: number = 1;

  // Conversation tracking
  conversationUrl?: string;

  babySeatPricePerDay?: number | null;

  totalCost?: number | null;

  constructor(options: IWorldOptions) {
    super(options);
  }

  /**
   * Initialize the browser and create a new page
   */
  async init(): Promise<void> {
    try {
      this.browser = await chromium.launch({
        headless: defaultConfig.headless,
        slowMo: defaultConfig.slowMo,
        args: ['--start-maximized'],
      });

      this.context = await this.browser.newContext({
        viewport: null, // Use full window
        timeout: defaultConfig.timeout,
      });

      this.page = await this.context.newPage();

      // Set default timeouts
      await this.page.setDefaultNavigationTimeout(defaultConfig.timeout);
      await this.page.setDefaultTimeout(defaultConfig.timeout);
    } catch (error) {
      console.error('Failed to initialize browser:', error);
      throw error;
    }
  }

  /**
   * Take a screenshot of the current page
   */
  async takeScreenshot(path: string): Promise<Buffer | null> {
    if (this.page) {
      try {
        return await this.page.screenshot({
          path: path,
          fullPage: true,
        });
      } catch (error) {
        console.error('Failed to take screenshot:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Clean up browser resources
   */
  async cleanup(): Promise<void> {
    try {
      if (this.page) {
        try {
          await this.page.close();
        } catch (error) {
          console.log('Ignoring page close error:', error);
        }
      }
      if (this.context) {
        try {
          await this.context.close();
        } catch (error) {
          console.log('Ignoring context close error:', error);
        }
      }
      if (this.browser) {
        try {
          await this.browser.close();
        } catch (error) {
          console.log('Ignoring browser close error:', error);
        }
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}

setWorldConstructor(CustomWorld);

export default CustomWorld;


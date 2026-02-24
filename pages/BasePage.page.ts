import { Page, Locator, expect } from '@playwright/test';
import { config } from '../configs/config.js';

/**
 * Base Page Object class
 * Contains common methods and utilities for all page objects
 */
export abstract class BasePage {
    protected readonly page: Page;
    protected readonly baseUrl: string;

    constructor(page: Page) {
        this.page = page;
        this.baseUrl = config.baseUrl;
    }

    /**
     * Navigate to a specific path
     */
    async navigate(path: string = ''): Promise<void> {
        const url = `${this.baseUrl}${path}`;
        await this.page.goto(url, { waitUntil: 'networkidle' });
    }

    /**
     * Get current page URL
     */
    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }

    /**
     * Get page title
     */
    async getTitle(): Promise<string> {
        return this.page.title();
    }

    /**
     * Wait for page to load completely
     */
    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Wait for element to be visible
     */
    async waitForElement(locator: Locator, timeout?: number): Promise<void> {
        await locator.waitFor({
            state: 'visible',
            timeout: timeout || config.elementTimeout,
        });
    }

    /**
     * Wait for element to be hidden
     */
    async waitForElementHidden(locator: Locator, timeout?: number): Promise<void> {
        await locator.waitFor({
            state: 'hidden',
            timeout: timeout || config.elementTimeout,
        });
    }

    /**
     * Click element with retry
     */
    async clickElement(locator: Locator, options?: { force?: boolean }): Promise<void> {
        await this.waitForElement(locator);
        await locator.click(options);
    }

    /**
     * Fill input field
     */
    async fillInput(locator: Locator, value: string): Promise<void> {
        await this.waitForElement(locator);
        await locator.clear();
        await locator.fill(value);
    }

    /**
     * Get text from element
     */
    async getText(locator: Locator): Promise<string> {
        await this.waitForElement(locator);
        return (await locator.textContent()) || '';
    }

    /**
     * Get input value
     */
    async getInputValue(locator: Locator): Promise<string> {
        await this.waitForElement(locator);
        return locator.inputValue();
    }

    /**
     * Check if element is visible
     */
    async isElementVisible(locator: Locator): Promise<boolean> {
        try {
            await locator.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Check if element is enabled
     */
    async isElementEnabled(locator: Locator): Promise<boolean> {
        await this.waitForElement(locator);
        return locator.isEnabled();
    }

    /**
     * Select dropdown option by value
     */
    async selectByValue(locator: Locator, value: string): Promise<void> {
        await this.waitForElement(locator);
        await locator.selectOption({ value });
    }

    /**
     * Select dropdown option by label
     */
    async selectByLabel(locator: Locator, label: string): Promise<void> {
        await this.waitForElement(locator);
        await locator.selectOption({ label });
    }

    /**
     * Check checkbox
     */
    async checkCheckbox(locator: Locator): Promise<void> {
        await this.waitForElement(locator);
        await locator.check();
    }

    /**
     * Uncheck checkbox
     */
    async uncheckCheckbox(locator: Locator): Promise<void> {
        await this.waitForElement(locator);
        await locator.uncheck();
    }

    /**
     * Hover over element
     */
    async hoverElement(locator: Locator): Promise<void> {
        await this.waitForElement(locator);
        await locator.hover();
    }

    /**
     * Double click element
     */
    async doubleClick(locator: Locator): Promise<void> {
        await this.waitForElement(locator);
        await locator.dblclick();
    }

    /**
     * Right click element
     */
    async rightClick(locator: Locator): Promise<void> {
        await this.waitForElement(locator);
        await locator.click({ button: 'right' });
    }

    /**
     * Press keyboard key
     */
    async pressKey(key: string): Promise<void> {
        await this.page.keyboard.press(key);
    }

    /**
     * Type text with delay
     */
    async typeText(locator: Locator, text: string, delay: number = 50): Promise<void> {
        await this.waitForElement(locator);
        await locator.click();
        await locator.type(text, { delay });
    }

    /**
     * Scroll to element
     */
    async scrollToElement(locator: Locator): Promise<void> {
        await locator.scrollIntoViewIfNeeded();
    }

    /**
     * Scroll page by pixels
     */
    async scrollBy(x: number, y: number): Promise<void> {
        await this.page.evaluate(
            ([scrollX, scrollY]) => (globalThis as typeof globalThis & { scrollBy: (x: number, y: number) => void }).scrollBy(scrollX, scrollY),
            [x, y]
        );
    }

    /**
     * Take screenshot
     */
    async takeScreenshot(name: string): Promise<Buffer> {
        return this.page.screenshot({
            path: `${config.screenshotsPath}/${name}.png`,
            fullPage: true,
        });
    }

    /**
     * Wait for network idle
     */
    async waitForNetworkIdle(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Wait for specific URL
     */
    async waitForUrl(urlPattern: string | RegExp): Promise<void> {
        await this.page.waitForURL(urlPattern);
    }

    /**
     * Accept dialog
     */
    async acceptDialog(): Promise<void> {
        this.page.once('dialog', async dialog => {
            await dialog.accept();
        });
    }

    /**
     * Dismiss dialog
     */
    async dismissDialog(): Promise<void> {
        this.page.once('dialog', async dialog => {
            await dialog.dismiss();
        });
    }

    /**
     * Get all elements count
     */
    async getElementCount(locator: Locator): Promise<number> {
        return locator.count();
    }

    /**
     * Assert element is visible
     */
    async assertVisible(locator: Locator): Promise<void> {
        await expect(locator).toBeVisible();
    }

    /**
     * Assert element has text
     */
    async assertHasText(locator: Locator, text: string): Promise<void> {
        await expect(locator).toHaveText(text);
    }

    /**
     * Assert element contains text
     */
    async assertContainsText(locator: Locator, text: string): Promise<void> {
        await expect(locator).toContainText(text);
    }

    /**
     * Assert URL contains
     */
    async assertUrlContains(text: string): Promise<void> {
        await expect(this.page).toHaveURL(new RegExp(text));
    }

    /**
     * Wait for API response
     */
    async waitForApiResponse(urlPattern: string | RegExp): Promise<void> {
        await this.page.waitForResponse(urlPattern);
    }
}
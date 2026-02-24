import { Page, Locator } from '@playwright/test';
import { BasePage } from '../pages/BasePage.page.js';

/**
 * Login Page Object
 * Handles all login page interactions for AtoZ Dispatch
 */
export class LoginPage extends BasePage {
    // Primary Locators (matching actual application)
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly dashboardMenu: Locator;

    // Secondary Locators
    private readonly forgotUsernameLink: Locator;
    private readonly registerLink: Locator;
    private readonly forgotPasswordLink: Locator;
    private readonly textMessage: Locator;



    constructor(page: Page) {
        super(page);

        this.textMessage = page.getByRole('heading', { name: 'Welcome, Please Login' });
        this.usernameInput = page.getByRole('textbox', { name: 'Username' })
        this.passwordInput = page.getByRole('textbox', { name: 'Password' })
        this.loginButton = page.getByRole('button', { name: 'Login' })
        this.dashboardMenu = page.locator("div[class='app-header-left'] a[href*='dashboard']");

        // Secondary locators
        this.forgotUsernameLink = page.locator('label').filter({ hasText: 'Forgot Username? Click Here' }).getByRole('link');
        this.registerLink = page.getByRole('link', { name: 'Click Here to Register' })
        this.forgotPasswordLink = page.locator('label').filter({ hasText: 'Forgot Password? Click Here' }).getByRole('link')

    }

    /**
     * Navigate to login page (application root)
     */
    async goto(): Promise<void> {
        await this.navigate('');
        await this.waitForPageLoad();
    }

    /**
     * Perform login with credentials
     */
    async login(username: string, password: string): Promise<void> {
        await this.textMessage.waitFor({ state: 'visible', timeout: 30000 });
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLogin();
        await this.page.waitForLoadState('networkidle');
    }





    /**
     * Enter username/email address
     */
    async enterUsername(username: string): Promise<void> {
        await this.usernameInput.fill(username);
    }



    /**
     * Enter password
     */
    async enterPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
    }

    /**
     * Click login button
     */
    async clickLogin(): Promise<void> {
        await this.loginButton.click();
        await this.page.waitForLoadState();
    }

    /**
     * Click login button (alias)
     */
    async clickLoginButton(): Promise<void> {
        await this.clickLogin();
    }

    /**
     * Verify login was successful by checking dashboard or any post-login menu is visible.
     * Uses multiple selectors so it works across app variants (e.g. customer15 may use different markup).
     */
    async verifyLoginSuccess(): Promise<void> {
        const postLoginIndicator = this.dashboardMenu
            .or(this.page.getByRole('link', { name: /dashboard/i }))
            .or(this.page.locator('a').filter({ hasText: /dashboard/i }).first())
            .or(this.page.getByRole('link', { name: /My Learnings/i }))
            .or(this.page.locator('a').filter({ hasText: /My Learnings/i }).first())
            .first();
        await postLoginIndicator.waitFor({ state: 'visible', timeout: 30000 });
    }

    /**
     * Check if dashboard menu is visible (indicates successful login)
     */
    async isDashboardVisible(): Promise<boolean> {
        const postLoginIndicator = this.dashboardMenu
            .or(this.page.getByRole('link', { name: /dashboard/i }))
            .or(this.page.locator('a').filter({ hasText: /dashboard/i }).first())
            .or(this.page.getByRole('link', { name: /My Learnings/i }))
            .or(this.page.locator('a').filter({ hasText: /My Learnings/i }).first())
            .first();
        try {
            await postLoginIndicator.waitFor({ state: 'visible', timeout: 10000 });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Click forgot password link
     */
    async clickForgotPassword(): Promise<void> {
        await this.clickElement(this.forgotPasswordLink);
    }



}
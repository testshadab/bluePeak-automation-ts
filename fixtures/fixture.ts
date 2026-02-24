import { test as base, expect } from '@playwright/test';
import { config } from '../configs/config.js';
import { LoginPage } from '../pages/LoginPage.page.js';



type Fixtures = {
    uiLogin: void;
};

export const test = base.extend<Fixtures>({
    uiLogin: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(config.testData.adminEmail, config.testData.adminPassword);
        await loginPage.verifyLoginSuccess();
        await use();
    },
});

export { expect } from '@playwright/test'; 
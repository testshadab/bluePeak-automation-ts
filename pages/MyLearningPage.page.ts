import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage.page.js';

export class MyLearningPage extends BasePage {

    private readonly notificationIcon: Locator;
    private readonly closeNotificationIcon: Locator;
    private readonly myLearningLink: Locator;
    private readonly filterTextbox: Locator;
    private readonly startCourseLink: Locator;
    private readonly finishTrainigButton: Locator;
    private readonly playArrowButtons: Locator;

    // ✅ Moved from method to constructor
    private readonly markCompletedButton: Locator;
    private readonly closeButton: Locator;
    private readonly successText: Locator;
    private readonly closeCursorIcon: Locator;
    private readonly yesButton: Locator;

    constructor(page: Page) {
        super(page);

        this.notificationIcon = this.page.locator('i.material-icons.notifications');
        this.closeNotificationIcon = this.page.locator('[class*="close-notify-alert"]').last();
        this.myLearningLink = this.page.getByRole('link', { name: 'verified_user My Learnings' });
        this.filterTextbox = this.page.getByRole('textbox', { name: 'Filter by CrsID, ClsID, or' });
        this.startCourseLink = this.page.getByRole('link', { name: 'Start Course' }).first();
        this.finishTrainigButton = this.page.getByRole('button', { name: 'Finish Training' });
        this.playArrowButtons = this.page.locator('span.material-icons', { hasText: 'play_arrow' });

        // ✅ New constructor locators
        this.markCompletedButton = this.page.getByRole('button', { name: 'Mark Completed' });
        this.closeButton = this.page.getByRole('button', { name: 'Close' });
        this.successText = this.page.locator('[class*="text-success ng"]');
        this.closeCursorIcon = this.page.locator("[class*='cursor-pointer']");
        this.yesButton = this.page.getByRole('button', { name: 'Yes' });
    }

    async validateNotificationIcon(): Promise<void> {
        await this.notificationIcon.waitFor({ state: 'visible', timeout: 20000 });

        if (await this.closeNotificationIcon.isVisible()) {
            await this.closeNotificationIcon.click({ force: true });
        }
    }

    async startCourseFromMyLearnings(courseId: string): Promise<void> {

        await this.waitForElement(this.myLearningLink);
        await this.clickElement(this.myLearningLink);

        await this.waitForElement(this.filterTextbox);
        await this.filterTextbox.fill('');
        await this.filterTextbox.type(courseId);

        await this.page.waitForTimeout(3000);

        await this.startCourseLink.waitFor({ state: 'visible', timeout: 10000 });
        await this.startCourseLink.click();

        await this.finishTrainigButton.waitFor({ state: 'visible', timeout: 10000 });
    }

    async completeSourceResources(): Promise<void> {

        await this.page.waitForTimeout(3000)
        const count = await this.playArrowButtons.count();

        if (count === 0) {
            throw new Error('No play_arrow buttons found');
        }

        for (let i = 0; i < count; i++) {

            await this.playArrowButtons.nth(i).click();

            await this.page.waitForTimeout(2000);

            if (await this.markCompletedButton.isVisible()) {

                await this.markCompletedButton.click();
                await this.closeButton.click();

            } else {

                await this.successText.waitFor({
                    state: 'visible',
                    timeout: 120000
                });

                await this.closeCursorIcon.click({ delay: 2000 })

            }
        }

        await this.finishTrainigButton.click({ delay: 2000 })

        await this.yesButton.click({ delay: 2000 })

        // Wait for success notification
        await this.waitForElement(this.notificationIcon);
        await expect(this.notificationIcon).toBeVisible();

        // Close toast
        await this.validateNotificationIcon();
    }
}
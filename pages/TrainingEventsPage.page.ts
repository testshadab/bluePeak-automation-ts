import { Page, Locator, expect, test } from '@playwright/test';
import { BasePage } from './BasePage.page.js';
import { courseData } from '../test-data/courseData.js';


export class TrainingEventsPage extends BasePage {
    private readonly notificationIcon: Locator;
    private readonly closeNotificationIcon: Locator;
    private readonly trainingEventsLink: Locator;
    private readonly selfPacedTraining: Locator;
    private readonly filterTextbox: Locator;
    private readonly registerLink: Locator;
    private readonly registerButton: Locator;



    constructor(page: Page) {
        super(page);
        this.notificationIcon = this.page.locator('i.material-icons.notifications').last();
        this.closeNotificationIcon = this.page.locator('[class*="close-notify-alert"]').last()
        this.trainingEventsLink = this.page.getByRole('link', { name: 'event_note Training Events' })
        this.selfPacedTraining = this.page.getByRole('link', { name: 'Self-Paced Trainings' })
        this.filterTextbox = this.page.getByRole('textbox', { name: 'Filter' })
        this.registerLink = this.page.getByRole('link', { name: 'Click Here to Register...' })
        this.registerButton = this.page.getByRole('button', { name: 'Register' })


    }

    async validateNotificationIcon(): Promise<void> {
        await this.notificationIcon.waitFor({ state: 'visible', timeout: 20000 })
        if (await this.closeNotificationIcon.isVisible()) {
            await this.closeNotificationIcon.click({ force: true });
        }
    }

    async performRegistration(courseId: string): Promise<void> {
        await test.step('Perform Course Registration', async () => {

            // Click Training Events
            await this.waitForElement(this.trainingEventsLink);
            await this.clickElement(this.trainingEventsLink);

            // Click Self-Paced Trainings
            await this.waitForElement(this.selfPacedTraining);
            await this.clickElement(this.selfPacedTraining);

            await this.filterTextbox.fill('');
            await this.filterTextbox.type(courseId);

            // Wait until the result updates
            await this.page.waitForTimeout(4000)

            await expect(this.registerLink.first()).toBeVisible();
            await this.registerLink.first().click({ delay:3000 });

            // Click Register Button
            await this.waitForElement(this.registerButton);
            await this.clickElement(this.registerButton);

            // Wait for Notification
            await this.waitForElement(this.notificationIcon);
            await expect(this.notificationIcon).toBeVisible();

            // Close Notification
            await this.waitForElement(this.closeNotificationIcon);
            await this.clickElement(this.closeNotificationIcon);
        });
    }




}
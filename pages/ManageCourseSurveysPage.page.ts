import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage.page.js';
import { courseData } from '../test-data/courseData.js';


export class ManageCourseSurveysPage extends BasePage {
    private readonly notificationIcon: Locator;
    private readonly closeNotificationIcon: Locator;
    private readonly surveysTab: Locator;
    private readonly addSurveysButton: Locator;
    private readonly createFromTemplateCheckbox: Locator;
    private readonly selectTemplateDropdown: Locator;
    private readonly surveysName: Locator;
    private readonly saveAndNextButton: Locator;



    constructor(page: Page) {
        super(page);
        this.notificationIcon = this.page.locator('i.material-icons.notifications');
        this.closeNotificationIcon = this.page.locator('[class*="close-notify-alert"]').last()
        this.surveysTab = this.page.locator("#survey-tab")
        this.addSurveysButton = this.page.getByRole('button', { name: 'Add Survey' });
        this.createFromTemplateCheckbox = this.page.locator(
            "//label[text()=' Create from existing survey template ']/../descendant::input[@type='checkbox']"
        );
        this.selectTemplateDropdown = this.page.locator("//span[text()='Select Template']/../descendant::mat-select")

        this.saveAndNextButton = this.page.getByRole('button', { name: 'Save and Next' });

        this.surveysName= this.page.locator('input[name="name"]')

    }

    async validateNotificationIcon(): Promise<void> {
        await this.notificationIcon.waitFor({ state: 'visible', timeout: 20000 })
        if (await this.closeNotificationIcon.isVisible()) {
            await this.closeNotificationIcon.click({ force: true });
        }
    }

    async addSurvey(): Promise<void> {

        await this.surveysTab.waitFor({ state: 'visible', timeout: 10000 });
        await this.surveysTab.click();

        await this.addSurveysButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.addSurveysButton.click();

        const selectTemplate = courseData.selectTemplate;
        const surveysName = courseData.surveysName;

        await this.createFromTemplateCheckbox.waitFor({ state: 'visible', timeout: 10000 });

        const isChecked = await this.createFromTemplateCheckbox.isChecked();
        if (!isChecked) {
            await this.createFromTemplateCheckbox.click();
        }

        await this.selectTemplateDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await this.selectTemplateDropdown.click({delay:2000});
        await this.page.getByRole('option', { name: selectTemplate }).click();

        await this.surveysName.waitFor({ state: 'visible', timeout: 10000 })
        await this.surveysName.fill(surveysName)

        await this.saveAndNextButton.click();
    }

}
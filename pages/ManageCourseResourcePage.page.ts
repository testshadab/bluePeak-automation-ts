import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage.page.js';
import { courseData } from '../test-data/courseData.js';


export class ManageCourseResourcePage extends BasePage {
    private readonly notificationIcon: Locator;
    private readonly resourcesTab: Locator;
    private readonly addSectionButton: Locator;
    private readonly sectionTitleInput: Locator;
    private readonly modalSaveButton: Locator;
    private readonly addResourceButton: Locator;
    private readonly audioResourceCard: Locator;
    private readonly videoResourceCard: Locator;
    private readonly documentResourceCard: Locator;
    private readonly contentResourceCard: Locator;
    private readonly webLinkResourceCard: Locator;
    private readonly pictureResourceCard: Locator;
    private readonly scormResourceCard: Locator;
    private readonly testResourceCard: Locator;
    readonly testNameInput: Locator;
    readonly durationHoursDropdown: Locator;
    readonly durationMinutesDropdown: Locator;
    readonly passingScoreInput: Locator;
    readonly maxAttemptsInput: Locator;
    readonly addImportTest: Locator;
    readonly selectTemplateInput: Locator;
    readonly NameInput: Locator;
    private readonly linkInputField: Locator;
    private readonly closeNotificationIcon: Locator;
    readonly htmlEditor: Locator;
    readonly titleInput: Locator;
    readonly descriptionInput: Locator;
    readonly parentSectionDropdown: Locator;
    readonly fileInput: Locator;
    readonly saveButton: Locator;

    constructor(page: Page) {
        super(page);
        this.notificationIcon = this.page.locator('i.material-icons.notifications');
        this.closeNotificationIcon = this.page.locator('[class*="close-notify-alert"]').last()
        this.resourcesTab = this.page.locator('#resources-tab');
        this.addSectionButton = this.page.getByRole('button', { name: 'ADD SECTION' });
        this.sectionTitleInput = this.page.getByPlaceholder('Title');
        this.modalSaveButton = this.page.getByRole('button', { name: 'SAVE' });
        this.addResourceButton = this.page.getByRole('button', { name: 'ADD RESOURCE' });
        // Based on your DOM: <h6 class="wp-title text-center">Test</h6>
        this.audioResourceCard = this.page.locator('h6.wp-title', { hasText: 'Audio' });
        this.titleInput = page.getByRole('textbox', { name: 'Title' });
        this.descriptionInput = page.getByRole('textbox', { name: 'Short Description' });
        this.parentSectionDropdown = page.locator("//*[contains(text(),'Select Parent Section')]/../descendant::mat-select");
        this.fileInput = page.locator('input[type="file"]');
        this.saveButton = page.getByRole('button', { name: 'Save' });

        this.videoResourceCard = this.page.locator('h6.wp-title', { hasText: 'Video' });
        this.documentResourceCard = this.page.locator('h6.wp-title', { hasText: 'Document' });
        this.contentResourceCard = this.page.locator('h6.wp-title', { hasText: 'Content' });
        this.htmlEditor = page.locator('kendo-editor [contenteditable="true"]');

        this.webLinkResourceCard = this.page.locator('h6.wp-title', { hasText: 'Web Link' });

        this.linkInputField = this.page.getByRole('textbox', { name: 'Enter Web Link' });

        this.pictureResourceCard = this.page.locator('h6.wp-title', { hasText: 'Picture' });

        this.scormResourceCard = this.page.locator('h6.wp-title', { hasText: 'SCORM' });

        this.testResourceCard = this.page.locator('h6.wp-title', { hasText: 'Test' });

        this.testNameInput = page.locator('input[name="name"]');

        this.durationHoursDropdown = page.locator(
            "//span[contains(text(),'Duration (Hours)')]/../descendant::mat-select"
        );

        this.durationMinutesDropdown = page.locator(
            "//span[contains(text(),'Duration (Minutes)')]/../descendant::mat-select"
        );

        this.passingScoreInput = page.locator('input[name="PassingScore"]')

        this.maxAttemptsInput = page.locator('input[name="MaxAttempts"]')

        this.selectTemplateInput = page.locator(
            "//span[text()='Select Template']/../descendant::input"
        );

        this.NameInput = page.locator('input[name="testName"]');

        this.addImportTest = page.getByRole('button', { name: 'get_app Import Test' })

    }

    async validateNotificationIcon(): Promise<void> {
        // await expect(this.notificationIcon).toBeVisible();
        await this.notificationIcon.waitFor({ state: 'visible', timeout: 20000 })
        if (await this.closeNotificationIcon.isVisible()) {
            await this.closeNotificationIcon.click({ force: true });
        }
    }

    async addSection(): Promise<void> {
        await this.resourcesTab.click();

        await this.addSectionButton.waitFor({
            state: 'visible',
            timeout: 10000
        });
        await this.addSectionButton.click();

        const sectionTitle = courseData.sectionTitle;

        await this.sectionTitleInput.waitFor({
            state: 'visible',
            timeout: 10000
        });
        await this.sectionTitleInput.fill(sectionTitle);

        await this.modalSaveButton.waitFor({
            state: 'visible',
            timeout: 10000
        });
        await this.modalSaveButton.click();
    }

    async addAudioResource(): Promise<void> {
        await expect(this.addResourceButton).toBeVisible();
        await this.addResourceButton.click();
        await this.audioResourceCard.waitFor({ state: 'visible', timeout: 10000 })
        await this.audioResourceCard.click();
        const audioTitle = courseData.audioTitle;
        const sectionTitle = courseData.sectionTitle;

        await this.titleInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.titleInput.fill(audioTitle);

        await this.parentSectionDropdown.click();
        await this.page.getByRole('option', { name: sectionTitle }).click();

        await this.fileInput.setInputFiles('test-data/Software_Testing_Audio.mp3');

        await this.modalSaveButton.click();
    }

    async addVideoResource(): Promise<void> {
        await expect(this.addResourceButton).toBeVisible();
        await this.addResourceButton.click();
        await this.videoResourceCard.waitFor({ state: 'visible', timeout: 10000 })
        await this.videoResourceCard.click();
        const videoTitle = courseData.videoTitle;
        const sectionTitle = courseData.sectionTitle;

        await this.titleInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.titleInput.fill(videoTitle);

        await this.parentSectionDropdown.click();
        await this.page.getByRole('option', { name: sectionTitle }).click();

        await this.fileInput.setInputFiles('test-data/Manage Courses- Prerequisites.mp4');

        await this.modalSaveButton.click();
    }

    async addDocumentResource(): Promise<void> {
        await expect(this.addResourceButton).toBeVisible();
        await this.addResourceButton.click();
        await this.documentResourceCard.waitFor({ state: 'visible', timeout: 10000 })
        await this.documentResourceCard.click();
        const documentTitle = courseData.documentTitle;
        const sectionTitle = courseData.sectionTitle;

        await this.titleInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.titleInput.fill(documentTitle);

        await this.parentSectionDropdown.click();
        await this.page.getByRole('option', { name: sectionTitle }).click();

        await this.fileInput.setInputFiles('test-data/Software_Testing_Overview.pdf');

        await this.modalSaveButton.click();
    }

    async addContentResource(): Promise<void> {
        await expect(this.addResourceButton).toBeVisible();
        await this.addResourceButton.click();
        await this.contentResourceCard.waitFor({ state: 'visible', timeout: 10000 })
        await this.contentResourceCard.click();
        const contentTitle = courseData.contentTitle;
        const sectionTitle = courseData.sectionTitle;
        const htmlContent = courseData.htmlContent;

        await this.titleInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.titleInput.fill(contentTitle);

        await this.parentSectionDropdown.click();
        await this.page.getByRole('option', { name: sectionTitle }).click();
        await this.htmlEditor.click();
        await this.htmlEditor.fill(htmlContent);
        await this.modalSaveButton.click();
    }

    async addWebLinkResource(): Promise<void> {
        await expect(this.addResourceButton).toBeVisible();
        await this.addResourceButton.click();
        await this.webLinkResourceCard.waitFor({ state: 'visible', timeout: 10000 })
        await this.webLinkResourceCard.click();
        const webTitle = courseData.webTitle;
        const sectionTitle = courseData.sectionTitle;
        const demoLink = courseData.demoLink;

        await this.titleInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.titleInput.fill(webTitle);

        await this.parentSectionDropdown.click();
        await this.page.getByRole('option', { name: sectionTitle }).click();
        await this.linkInputField.click();
        await this.linkInputField.fill(demoLink);
        await this.modalSaveButton.click();
    }

    async addPictureResource(): Promise<void> {
        await expect(this.addResourceButton).toBeVisible();
        await this.addResourceButton.click();
        await this.pictureResourceCard.waitFor({ state: 'visible', timeout: 10000 })
        await this.pictureResourceCard.click();
        const pictureTitle = courseData.pictureTitle;
        const sectionTitle = courseData.sectionTitle;

        await this.titleInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.titleInput.fill(pictureTitle);

        await this.parentSectionDropdown.click();
        await this.page.getByRole('option', { name: sectionTitle }).click();

        await this.fileInput.setInputFiles('test-data/Software Testing Image.png');

        await this.modalSaveButton.click();
    }

    async addScormResource(): Promise<void> {
        await expect(this.addResourceButton).toBeVisible();
        await this.addResourceButton.click();
        await this.scormResourceCard.waitFor({ state: 'visible', timeout: 10000 })
        await this.scormResourceCard.click();
        const scormTitle = courseData.scormTitle;
        const sectionTitle = courseData.sectionTitle;

        await this.titleInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.titleInput.fill(scormTitle);

        await this.parentSectionDropdown.click();
        await this.page.getByRole('option', { name: sectionTitle }).click();

        await this.fileInput.setInputFiles('test-data/SCORM_file.zip');

        await this.modalSaveButton.click();
    }

    async addTestResource(): Promise<void> {
        await expect(this.addResourceButton).toBeVisible();
        await this.addResourceButton.click();
        await this.testResourceCard.waitFor({ state: 'visible', timeout: 10000 })
        await this.testResourceCard.click();
        const testName = courseData.testName;
        const sectionTitle = courseData.sectionTitle;

        const durationHours = courseData.durationHours;
        const durationMinutes = courseData.durationMinutes;

        const passingMarks = courseData.passingMarks;
        const maxAttempt = courseData.maxAttempt;

        await this.parentSectionDropdown.click();
        await this.page.getByRole('option', { name: sectionTitle }).click();

        await this.testNameInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.testNameInput.fill(testName);

        await this.durationHoursDropdown.click();
        await this.page.getByRole('option', { name: durationHours }).first().click();

        await this.durationMinutesDropdown.click();
        await this.page.getByRole('option', { name: durationHours }).last().click();

        await this.passingScoreInput.fill(passingMarks)
        await this.maxAttemptsInput.fill(maxAttempt)

        await this.modalSaveButton.click();
    }

    async importTest(): Promise<void> {
        await this.addImportTest.waitFor({ state: 'visible', timeout: 10000 })
        await this.addImportTest.click();
        const name = courseData.name;
        const sectionTitle = courseData.sectionTitle;
        const templateName = courseData.templateName;

        await this.NameInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.NameInput.fill(name);

        await this.parentSectionDropdown.click();
        await this.page.getByRole('option', { name: sectionTitle }).click();

        await this.selectTemplateInput.click();
        await this.page.getByRole('option', { name: templateName }).click();

        await this.modalSaveButton.click();
    }
}
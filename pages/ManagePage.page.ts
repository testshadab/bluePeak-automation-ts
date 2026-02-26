import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../pages/BasePage.page.js';
import { courseData } from '../test-data/courseData.js';


export class ManagePage extends BasePage {
    private readonly manageMenuLink: Locator;
    private readonly coursesMenuLink: Locator;
    private readonly trainingMethodsOptions: Locator;
    private readonly selfPaced: Locator;
    private readonly addCourseButton: Locator;
    private readonly generateCourseIdButton: Locator;
    private readonly courseIdInput: Locator;
    public generatedCourseId: string | null = null;
    private readonly titleInput: Locator;
    private readonly durationInput: Locator;
    private readonly saveButton: Locator;
    private readonly notificationIcon: Locator;


    constructor(page: Page) {
        super(page);

        this.manageMenuLink = page.getByRole('link', { name: 'settings Manage ' });
        this.coursesMenuLink = page.getByRole('link', { name: 'library_books Courses' });
        this.trainingMethodsOptions = page.locator('[name="trainingmethod"]');
        this.selfPaced = page.getByRole('option', { name: 'Self-Paced' });
        this.durationInput = page.getByPlaceholder('Duration (Days)');
        this.addCourseButton = page.getByRole('button', { name: 'add Add Course' });
        this.generateCourseIdButton = page.getByTitle('Click to get next Course ID');
        this.courseIdInput = page.getByPlaceholder('Course ID');
        this.titleInput = page.getByPlaceholder('Title');
        this.saveButton = this.page.locator('button[type="submit"].btn-blue');
        this.notificationIcon = this.page.locator('i.material-icons.notifications').last();


    }

    async gotoManage(): Promise<void> {
        await this.clickElement(this.manageMenuLink);
    }
    async gotoCourses(): Promise<void> {
        await this.waitForElement(this.manageMenuLink);
        await this.clickElement(this.manageMenuLink);
        await this.waitForElement(this.coursesMenuLink);
        await this.clickElement(this.coursesMenuLink);
    }

    async clickAddCourse(): Promise<void> {
        await this.waitForElement(this.addCourseButton);
        await this.clickElement(this.addCourseButton);
    }

    async selectSelfPaced(): Promise<void> {
        await this.waitForElement(this.trainingMethodsOptions);
        await this.clickElement(this.trainingMethodsOptions);
        await this.waitForElement(this.selfPaced);
        await this.clickElement(this.selfPaced);
    }

    async enterDurationDays(days: number): Promise<void> {
        await this.waitForElement(this.durationInput);
        await this.durationInput.fill(days.toString());
    }

    async isSelfPacedSelected(): Promise<boolean> {
        return await this.selfPaced.isVisible();
    }

    async generateAndStoreCourseId(): Promise<void> {
        await this.waitForElement(this.courseIdInput);

        const initialValue = await this.courseIdInput.inputValue();

        await this.waitForElement(this.generateCourseIdButton);
        await this.clickElement(this.generateCourseIdButton);

        // ✅ Wait until value changes
        await expect
            .poll(async () => await this.courseIdInput.inputValue())
            .not.toBe(initialValue);

        this.generatedCourseId = await this.courseIdInput.inputValue();

        console.log('Generated Course ID:', this.generatedCourseId);
    }

    async enterCourseTitle(title: string): Promise<void> {
        await this.waitForElement(this.titleInput);
        await this.titleInput.fill(title);
    }

    async clickSave(): Promise<void> {
        await this.waitForElement(this.saveButton);
        await this.saveButton.click();
    }

    async validateNotificationIcon(): Promise<void> {
        await expect(this.notificationIcon).toBeVisible();
    }

    async enterCourseDetails(): Promise<void> {
        await this.selectSelfPaced();
        await this.isSelfPacedSelected()
        await this.enterDurationDays(courseData.durationDays);
        await this.generateAndStoreCourseId();
        expect(this.generatedCourseId).not.toBeNull();
        await this.enterCourseTitle(courseData.title);
        await this.clickSave()
        await this.validateNotificationIcon();
    }

    getGeneratedCourseId(): string {
        if (!this.generatedCourseId) {
            throw new Error('Course ID has not been generated yet.');
        }
        return this.generatedCourseId;
    }

}
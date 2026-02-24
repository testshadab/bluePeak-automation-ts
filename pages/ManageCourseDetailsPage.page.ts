import { Page, Locator, expect, test } from '@playwright/test';
import { BasePage } from './BasePage.page.js';

export class ManageCoursePage extends BasePage {
    private readonly courseDetails: Locator;
    private readonly registrationAlert: Locator;
    private readonly prerequisites: Locator;
    private readonly courseAccess: Locator;
    private readonly learningObjective: Locator;
    private readonly additionalInstruction: Locator;
    private readonly courseFee: Locator;
    private readonly registrationAlertMessage: Locator;
    private readonly popupMessage: Locator;
    private readonly saveButton: Locator;
    private readonly addRuleButton: Locator;
    private readonly message: Locator;
    private readonly courseIdOrTitle: Locator;
    private readonly selectCourse: Locator;
    private readonly PrerequisitesSaveButton: Locator;
    private readonly prerequisitesPopupMessage: Locator;
    private readonly roleInput: Locator;
    private readonly selectRole: Locator;
    private readonly courseAccessSaveButton: Locator;
    private readonly learningObjectiveButton: Locator;
    private readonly learningObjectiveMessage: Locator;
    private readonly learningObjectiveSaveButton: Locator;
    private readonly editAdditionalInstructionButton: Locator;
    private readonly addFeeButton: Locator;
    private readonly feeType: Locator;
    private readonly tuitionFee: Locator;
    private readonly description: Locator;
    private readonly optionalCheckbox: Locator;
    private readonly feeAmount: Locator;
    private readonly notificationIcon: Locator;
    private readonly notificationCloseButton: Locator;
    constructor(page: Page) {
        super(page);

        this.courseDetails = this.page.getByRole('button', { name: 'Course Details' });
        this.registrationAlert = this.page.getByText('Registration Alert').first();
        this.prerequisites = this.page.getByRole('button', { name: 'Prerequisites' });
        this.courseAccess = this.page.getByRole('button', { name: 'Course Access' })
        this.learningObjective = this.page.getByRole('button', { name: 'Learning Objectives' })
        this.additionalInstruction = this.page.getByRole('button', { name: 'Additional Instructions' })
        this.courseFee = this.page.getByRole('button', { name: 'Course Fees' })
        this.registrationAlertMessage = this.page.locator('#mat-input-11')
        this.saveButton = this.page.getByRole('button', { name: 'Save' })
        this.popupMessage = this.page.getByText('Registration Alert has been added successfully');
        this.addRuleButton = this.page.getByRole('button', { name: 'add Add Rule' })
        this.message = this.page.getByText('Need to Pass Or Complete')
        this.courseIdOrTitle = this.page.getByRole('combobox', { name: 'Type Course ID or Course Title' })
        this.selectCourse = this.page.getByRole('option', { name: '2026 QA Onboarding and' })
        this.PrerequisitesSaveButton = this.page.getByLabel('Prerequisites').getByRole('button', { name: 'Save' })
        this.prerequisitesPopupMessage = this.page.getByText('Course prerequisites have been added successfully');
        this.roleInput = this.page.getByRole('combobox', { name: 'Type Name' });
        this.selectRole = this.page.getByText('Role -[Misc] L1');
        this.courseAccessSaveButton = this.page.getByLabel('Course Access').getByRole('button', { name: 'Save' })
        this.learningObjectiveButton = this.page.getByRole('button', { name: 'add Add Learning Objective' })
        this.learningObjectiveMessage = this.page.getByRole('textbox', { name: 'Enter Learning Objective' })
        this.learningObjectiveSaveButton = this.page.getByLabel('Add Learning Objective').getByRole('button', { name: 'Save' })
        this.editAdditionalInstructionButton = this.page.getByRole('button', { name: 'edit Edit' })
        this.addFeeButton = this.page.getByRole('button', { name: 'add Add Fee' })
        this.feeType = this.page.getByText('Select Fee Type')
        this.tuitionFee = this.page.getByText('Tuition Fees')
        this.description = this.page.getByRole('textbox', { name: 'Enter description' })
        this.optionalCheckbox = this.page.getByRole('checkbox', { name: 'Is Optional?' })
        this.feeAmount = this.page.locator('input[name="amount"][type="number"]');
        this.notificationIcon = this.page.locator('i.material-icons.notifications').last();
        this.notificationCloseButton = this.page.locator('[role="alert"] button.close, [data-notify-position] button.close');

    }

    /** Close the visible notification toast by clicking its close (X) button. */
    async closeNotification(): Promise<void> {
        try {
            await this.waitForElement(this.notificationCloseButton, 3000);
            await this.clickElement(this.notificationCloseButton);
        } catch {
            // No notification visible or already closed
        }
    }

    async setRegistrationAlertMessage(): Promise<void> {
        await test.step('Set Registration Alert Message', async () => {
            await this.waitForElement(this.registrationAlert);
            await this.clickElement(this.registrationAlert);
            await this.typeText(this.registrationAlertMessage, 'Test Registration Alert');
            await this.clickElement(this.saveButton);
            await this.waitForElement(this.notificationIcon);
            await expect(this.notificationIcon).toBeVisible();
            await this.closeNotification();
            await this.clickElement(this.registrationAlert);
        });
    }

    async SetPrerequisites(): Promise<void> {
        await test.step('Set Prerequisites', async () => {
            await this.prerequisites.click();
            await this.addRuleButton.click();
            await this.courseIdOrTitle.click();
            await this.selectCourse.click();
            await this.PrerequisitesSaveButton.click();
            await this.waitForElement(this.notificationIcon);
            await expect(this.notificationIcon).toBeVisible();
            await this.closeNotification();
            await this.prerequisites.click();
        });
    }

    async SetCourseAccess(): Promise<void> {
        await test.step('Set Course Access', async () => {
            await this.courseAccess.click();
            await this.roleInput.click();
            await this.selectRole.click();
            await this.courseAccessSaveButton.click();
            await this.waitForElement(this.notificationIcon);
            await expect(this.notificationIcon).toBeVisible();
            await this.closeNotification();
            await this.courseAccess.click();
        });
    }





    async SetLearningObjective(): Promise<void> {
        await test.step('Set Learning Objective', async () => {
            await this.learningObjective.click();
            await this.learningObjectiveButton.click();
            await this.learningObjectiveMessage.type('Test Learning Objective');
            await this.learningObjectiveSaveButton.click();
            await this.waitForElement(this.notificationIcon);
            await expect(this.notificationIcon).toBeVisible();
            await this.closeNotification();
            await this.learningObjective.click();
        });
    }



    async SetCourseFee(): Promise<void> {
        await test.step('Set Course Fee', async () => {
            await this.courseFee.click();
            await this.addFeeButton.click();
            await this.feeType.click({delay:1000});
            await this.tuitionFee.click();
            await this.description.type('Test Description');
            await this.optionalCheckbox.click();
            await this.feeAmount.click();
            await this.feeAmount.clear();
            await this.feeAmount.fill('100');
            await this.saveButton.click();
            await this.closeNotification();
            await this.courseFee.click();
        });

    }
}
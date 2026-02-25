import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage.page.js';
import { courseData } from '../test-data/courseData.js';


export class ManageCourseDocumentsPage extends BasePage {
    private readonly notificationIcon: Locator;
    private readonly closeNotificationIcon: Locator;
    private readonly documentTab: Locator;
    private readonly documentTypeDropdown: Locator;
    private readonly uploadButton: Locator;
    private readonly titleInput: Locator;
    private readonly fileInput: Locator;
    private readonly saveButton: Locator;




    constructor(page: Page) {
        super(page);
        this.notificationIcon = this.page.locator('i.material-icons.notifications');
        this.closeNotificationIcon = this.page.locator('[class*="close-notify-alert"]').last()
        this.documentTab = this.page.locator("#documents-tab")
        this.documentTypeDropdown = this.page.locator("//span[contains(text(),'Document Type')]/../descendant::mat-select")
        this.uploadButton = this.page.getByRole('button', { name: 'Upload' });

        this.titleInput = this.page.locator('[formcontrolname="title"]');
    
        this.fileInput = this.page.locator('input[type="file"]');
    
        this.saveButton = this.page.getByRole('button', { name: 'Save' });


    }

    async validateNotificationIcon(): Promise<void> {
        await this.notificationIcon.waitFor({ state: 'visible', timeout: 20000 })
        if (await this.closeNotificationIcon.isVisible()) {
            await this.closeNotificationIcon.click({ force: true });
        }
    }

    async addDocuments(): Promise<void> {

        await this.documentTab.waitFor({ state: 'visible', timeout: 10000 });
        await this.documentTab.click();

        const document = courseData.document;
        const documentType = courseData.documentType;

        await this.documentTypeDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await this.documentTypeDropdown.click( {delay:2000} );
        await this.page.getByRole('option', { name: documentType }).click();

        await this.uploadButton.click();

        // Wait for modal title field
        await this.titleInput.waitFor({ state: 'visible', timeout: 10000 });
        
        // Upload file directly
        await this.fileInput.setInputFiles('test-data/Software Testing Image.png');
    
        // Click Save
        await this.saveButton.click();
    }

}
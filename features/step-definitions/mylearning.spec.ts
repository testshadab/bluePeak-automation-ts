import { test, expect } from '../../fixtures/fixture.js';
import { User } from '../../pages/user.js';
import { courseData } from '../../test-data/courseData.js';
/**
 * My Learnings tests with UI-based login (form fill + click Login).
 * Uses User class to access all page objects (managePage, loginPage, etc.).
 */

test.describe('My Learnings', () => {

    test('navigate Manage and Courses after UI login', async ({ page, uiLogin }) => {
        test.setTimeout(120000);
        const user = new User(page);

        await test.step('Go to Manage and open Courses', async () => {
            await user.managePage.gotoManage();
            await user.managePage.gotoCourses();
        });

        await test.step('Click Add Course button', async () => {
            await user.managePage.clickAddCourse();
            await expect(page).toHaveURL(/add-course/i);
        });

        await test.step('Enter all the reqired course details and click on save button', async () => {
            await user.managePage.selectSelfPaced();
            await user.managePage.isSelfPacedSelected()
            await user.managePage.enterDurationDays(courseData.durationDays);
            await user.managePage.generateAndStoreCourseId();
            // Optional validation
            expect(user.managePage.generatedCourseId).not.toBeNull();
            await user.managePage.enterCourseTitle(courseData.title);
            await user.managePage.clickSave()
            await user.manageCourseResourcePage.validateNotificationIcon();
        });

        await test.step('Set Registration Alert Message', async () => {
            await page.waitForURL(new RegExp('courses/manage-course', 'i'), { timeout: 60000 });
            expect.soft(page).toHaveURL(new RegExp('courses/manage-course', 'i'));
            await user.manageCourseDetailsPage.setRegistrationAlertMessage();
        });

        await test.step('Set Prerequisites', async () => {
            await user.manageCourseDetailsPage.SetPrerequisites();
        });

        await test.step('Set Course Access', async () => {
            await user.manageCourseDetailsPage.SetCourseAccess();
        });

        await test.step('Set Learning Objective', async () => {
            await user.manageCourseDetailsPage.SetLearningObjective();
        });
        await test.step('Set Course Fee', async () => {
            await user.manageCourseDetailsPage.SetCourseFee();
        });



        await test.step('click on resource tab and add section', async () => {
            await user.manageCourseResourcePage.addSection()
            await user.manageCourseResourcePage.validateNotificationIcon();

        });

        await test.step('Add audio resource', async () => {
            await user.manageCourseResourcePage.addAudioResource()
            await user.manageCourseResourcePage.validateNotificationIcon();
        });

        await test.step('Add video resource', async () => {
            await user.manageCourseResourcePage.addVideoResource()
            await user.manageCourseResourcePage.validateNotificationIcon();
        });

        await test.step('Add document resource', async () => {
            await user.manageCourseResourcePage.addDocumentResource()
            await user.manageCourseResourcePage.validateNotificationIcon();
        });

        await test.step('Add content resource', async () => {
            await user.manageCourseResourcePage.addContentResource()
            await user.manageCourseResourcePage.validateNotificationIcon();
        });

        await test.step('Add web resource', async () => {
            await user.manageCourseResourcePage.addWebLinkResource()
            await user.manageCourseResourcePage.validateNotificationIcon();
        });

        await test.step('Add picture resource', async () => {
            await user.manageCourseResourcePage.addPictureResource()
            await user.manageCourseResourcePage.validateNotificationIcon();
        });

        await test.step('Add picture resource', async () => {
            await user.manageCourseResourcePage.addScormResource()
            await user.manageCourseResourcePage.validateNotificationIcon();
        });

        await test.step('Add picture resource', async () => {
            await user.manageCourseResourcePage.addTestResource()
            await user.manageCourseResourcePage.validateNotificationIcon();
        });

        await test.step('imort test', async () => {
            await user.manageCourseResourcePage.importTest()
            await user.manageCourseResourcePage.validateNotificationIcon();
            await page.pause()
        });
    });

});
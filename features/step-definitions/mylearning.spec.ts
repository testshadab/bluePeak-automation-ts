import { test, expect } from '../../fixtures/fixture.js';
import { User } from '../../pages/user.js';
import { courseData } from '../../test-data/courseData.js';
/**
 * My Learnings tests with UI-based login (form fill + click Login).
 * Uses User class to access all page objects (managePage, loginPage, etc.).
 */

test.describe('My Learnings', () => {

    test('navigate Manage and Courses after UI login', async ({ page, uiLogin }) => {
        const user = new User(page);

        await test.step('Go to Manage and open Courses', async () => {
            await user.managePage.gotoManage();
            await user.managePage.gotoCourses();
        });

        await test.step('Click Add Course button', async () => {
            await user.managePage.clickAddCourse();
            await expect(page).toHaveURL(/add-course/i);
        });

        await test.step('Select Self-Paced training method', async () => {
            await user.managePage.selectSelfPaced();
            await user.managePage.isSelfPacedSelected()
        });

        await test.step('Enter duration days', async () => {
            await user.managePage.enterDurationDays(courseData.durationDays);
        });

        await test.step('Generate and store Course ID', async () => {
            await user.managePage.generateAndStoreCourseId();
            // Optional validation
            expect(user.managePage.generatedCourseId).not.toBeNull();
        });

        await test.step('Enter Course Title', async () => {
            await user.managePage.enterCourseTitle(courseData.title);
        });

        await test.step('Click on save button', async () => {
            await user.managePage.clickSave()
        });

        await test.step('Validate success notification icon', async () => {
            await user.managePage.validateNotificationIcon();
        });

    });
});
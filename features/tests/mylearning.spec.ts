import { test, expect } from '../../fixtures/fixture.js';
import { ManagePage } from '../../pages/ManagePage.page.js';
import { User } from '../../pages/user.js';
import { courseData } from '../../test-data/courseData.js';
/**
 * My Learnings tests with UI-based login (form fill + click Login).
 * Uses User class to access all page objects (managePage, loginPage, etc.).
 */

test.describe('My Learnings', () => {

    test('navigate Manage and Courses after UI login', async ({ page, uiLogin }) => {
        test.setTimeout(360000);
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
            await user.managePage.enterCourseDetails();

        });

        await test.step('Set Registration Alert Message', async () => {
            await page.waitForURL(new RegExp('courses/manage-course', 'i'), { timeout: 60000 });
            expect.soft(page).toHaveURL(new RegExp('courses/manage-course', 'i'));
            await user.manageCourseDetailsPage.setRegistrationAlertMessage();
        });

        // await test.step('Set Prerequisites', async () => {
        //     await user.manageCourseDetailsPage.SetPrerequisites();
        // });

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

        });

        await test.step('Add audio resource', async () => {
            await user.manageCourseResourcePage.addAudioResource()
        });

        await test.step('Add video resource', async () => {
            await user.manageCourseResourcePage.addVideoResource()
        });

        await test.step('Add document resource', async () => {
            await user.manageCourseResourcePage.addDocumentResource()
            
        });

        await test.step('Add content resource', async () => {
            await user.manageCourseResourcePage.addContentResource()
        });

        await test.step('Add web resource', async () => {
            await user.manageCourseResourcePage.addWebLinkResource()
        });

        await test.step('Add picture resource', async () => {
            await user.manageCourseResourcePage.addPictureResource()
        });

        // await test.step('Add scorm resource', async () => {
        //     await user.manageCourseResourcePage.addScormResource()
        // });

        // await test.step('Add Test resource', async () => {
        //     await user.manageCourseResourcePage.addTestResource()
        // });

        // await test.step('imort test', async () => {
        //     await user.manageCourseResourcePage.importTest()
        // });

        await test.step('Add surveys', async () => {
            await user.manageCourseSurveysPage.addSurvey()
        });

        await test.step('Add documents', async () => {
            await user.manageCourseDocumentsPage.addDocuments()
        });

        await test.step('publishCourse', async () => {
            await user.manageCourseDetailsPage.publishCourse()
        });

        await test.step('perform registration', async () => {
            await user.trainingEventsPage.performRegistration(user.managePage.getGeneratedCourseId())
        });

        await test.step('start course', async () => {
            await user.myLearningPage.startCourseFromMyLearnings(user.managePage.getGeneratedCourseId())
        });

        await test.step('complete all resources', async () => {
            await user.myLearningPage.completeSourceResources()
        });
    });

});
import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.page.js';
import { ManagePage } from '../pages/ManagePage.page.js';
import { ManageCourseResourcePage } from '../pages/ManageCourseResourcePage.page.js';
import { ManageCoursePage } from './ManageCourseDetailsPage.page.js';
import { ManageCourseSurveysPage } from '../pages/ManageCourseSurveysPage.page.js';
import { ManageCourseDocumentsPage } from '../pages/ManageCourseDocumentsPage.page.js';
import { TrainingEventsPage } from '../pages/TrainingEventsPage.page.js';
import { MyLearningPage } from '../pages/MyLearningPage.page.js';


/**
 * User (session) that holds all page objects for a single browser page.
 * Use one User per test; create with the Playwright page.
 *
 * @example
 * const user = new User(page);
 * await user.loginPage.goto();
 * await user.loginPage.login('user', 'pass');
 * await user.managePage.gotoCourses();
 */
export class User {
    readonly page: Page;
    private _loginPage?: LoginPage;
    //   private _dashboardPage?: DashboardPage;
    //   private _myLearningPage?: MyLearningPage;
    private _managePage?: ManagePage;
    private _manageCourseDetailsPage?: ManageCoursePage;
    private _manageCourseResourcePage?: ManageCourseResourcePage;
    private _manageCourseSurveysPage?: ManageCourseSurveysPage;
    private _manageCourseDocumentsPage?: ManageCourseDocumentsPage;
    private _trainingEventsPage?: TrainingEventsPage;
    private _myLearningPage?: MyLearningPage;


    constructor(page: Page) {
        this.page = page;
    }

    get loginPage(): LoginPage {
        if (!this._loginPage) this._loginPage = new LoginPage(this.page);
        return this._loginPage;
    }

    //   get dashboardPage(): DashboardPage {
    //     if (!this._dashboardPage) this._dashboardPage = new DashboardPage(this.page);
    //     return this._dashboardPage;
    //   }

    //   get myLearningPage(): MyLearningPage {
    //     if (!this._myLearningPage) this._myLearningPage = new MyLearningPage(this.page);
    //     return this._myLearningPage;
    //   }

    get managePage(): ManagePage {
        if (!this._managePage) this._managePage = new ManagePage(this.page);
        return this._managePage;
    }

    get manageCourseDetailsPage(): ManageCoursePage {
        if (!this._manageCourseDetailsPage) this._manageCourseDetailsPage = new ManageCoursePage(this.page);
        return this._manageCourseDetailsPage;
    }

    get manageCourseResourcePage(): ManageCourseResourcePage {
        if (!this._manageCourseResourcePage) {
            this._manageCourseResourcePage = new ManageCourseResourcePage(this.page);
        }
        return this._manageCourseResourcePage;
    }

    get manageCourseSurveysPage(): ManageCourseSurveysPage {
        if (!this._manageCourseSurveysPage) {
            this._manageCourseSurveysPage = new ManageCourseSurveysPage(this.page);
        }
        return this._manageCourseSurveysPage;
    }

    get manageCourseDocumentsPage(): ManageCourseDocumentsPage {
        if (!this._manageCourseDocumentsPage) {
            this._manageCourseDocumentsPage = new ManageCourseDocumentsPage(this.page);
        }
        return this._manageCourseDocumentsPage;
    }

    get trainingEventsPage(): TrainingEventsPage {
        if (!this._trainingEventsPage) {
            this._trainingEventsPage = new TrainingEventsPage(this.page);
        }
        return this._trainingEventsPage;
    }

    get myLearningPage(): MyLearningPage {
        if (!this._myLearningPage) {
            this._myLearningPage = new MyLearningPage(this.page);
        }
        return this._myLearningPage;
    }
}
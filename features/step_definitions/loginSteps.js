const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('playwright/test');
const { takeScreenshot } = require('../utils/screenshot.js');

Given('I am on the login page', async function () {
    try {
        await this.page.goto('https://tracelog14.slashrtc.in/index.php/login');
        await takeScreenshot(this.page, 'login-page-opened');
        console.log('✔  Navigated to login page');
    } catch (error) {
        console.error('✖ Failed to open login page:', error.message);
        await takeScreenshot(this.page, 'error-login-page');
        throw error;
    }
});

When('I enter valid credentials', async function () {
    try {
        await this.page.fill('input[name="username"]', 'testInternAdmin');
        await this.page.fill('input[name="password"]', 'Admin@12');
        await takeScreenshot(this.page, 'credentials-entered');
        console.log('✔  Entered valid credentials');
    } catch (error) {
        console.error('✖ Failed to enter credentials:', error.message);
        await takeScreenshot(this.page, 'error-credentials');
        throw error;
    }
});

When('I click the login button', async function () {
    try {
        await this.page.click('button[type="submit"]');
        await this.page.waitForTimeout(1500);
        await takeScreenshot(this.page, 'login-button-clicked');
        console.log('✔  Login button clicked');
    } catch (error) {
        console.error('✖ Failed to click login button:', error.message);
        await takeScreenshot(this.page, 'error-login-click');
        throw error;
    }
});

Then('I should be redirected to the dashboard', async function () {
    try {
        await this.page.waitForTimeout(2000);
        const currentUrl = this.page.url();

        expect(currentUrl).not.toContain('/login');

        const pageTitle = await this.page.title();
        expect(pageTitle.toLowerCase()).not.toContain('login');

        await takeScreenshot(this.page, 'dashboard-opened');
        console.log('✔  Successfully redirected to dashboard');
    } catch (error) {
        console.error('✖ Login failed - not redirected to dashboard:', error.message);
        await takeScreenshot(this.page, 'error-dashboard');
        throw error;
    }
});

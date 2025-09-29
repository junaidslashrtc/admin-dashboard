const { Given, Then, When } = require('@cucumber/cucumber');
const { takeScreenshot } = require('../utils/screenshot.js');
const { expect } = require('playwright/test');
const assert = require('assert');

Given('I am logged in as an admin', async function () {
    try {
        await this.page.goto('https://tracelog14.slashrtc.in/index.php/login');
        await this.page.fill('input[name="username"]', 'testInternAdmin');
        await this.page.fill('input[name="password"]', 'Admin@12');
        await takeScreenshot(this.page, 'admin-data-is-filled');
        await this.page.click('button[type="submit"]');
        await this.page.waitForTimeout(2000);

        console.log('✔  Logged in as admin successfully');
    } catch (error) {
        console.error('✖ Failed to log in as admin:', error.message);
        await takeScreenshot(this.page, 'error-login-admin');
        throw error;
    }
});

When('I navigate to the agents management page', async function () {
    try {
        await this.page.hover('#tabOperations');
        await this.page.waitForTimeout(500);
        await takeScreenshot(this.page, 'agents-management-page');

        const userLink = await this.page.$('.sub-menu a[href*="viewusers"]');
        if (!userLink) throw new Error('Agents management link not found');
        await userLink.click();

        await this.page.waitForTimeout(1000);
        const currentUrl = this.page.url();
        expect(currentUrl).toContain('/site/viewusers');

        console.log('✔  Navigated to agents management page');
    } catch (error) {
        console.error('✖ Failed to navigate to agents management page:', error.message);
        await takeScreenshot(this.page, 'error-agents-management-page');
        throw error;
    }
});

When('I click on the create new agent button', async function () {
    try {
        await this.page.click('button.dropdown-toggle:has-text("Expand")');
        await this.page.waitForTimeout(500);
        await takeScreenshot(this.page, 'create-new-agent-button');

        await this.page.click('a[href="https://tracelog14.slashrtc.in/index.php/site/createuser"]');
        await this.page.waitForTimeout(1000);

        console.log('✔  Clicked on create new agent button');
    } catch (error) {
        console.error('✖ Failed to click on create new agent button:', error.message);
        await takeScreenshot(this.page, 'error-create-new-agent');
        throw error;
    }
});

When('I fill in the agent details with valid information', async function () {
    try {
        await this.page.fill("#userFirstName", "dua");
        await this.page.fill("#userLastName", "lipa");
        await this.page.fill("#userName", "duaLipa");
        await this.page.fill("#userPassword", "Pass@123");
        await this.page.fill("#confirmPassword", "Pass@123");
        await takeScreenshot(this.page, 'agent-details-filled');

        await this.page.click("#saveButton");
        await this.page.waitForTimeout(1000);

        console.log('✔  Agent details filled and saved successfully');
    } catch (error) {
        console.error('✖ Failed to fill in agent details:', error.message);
        await takeScreenshot(this.page, 'error-agent-details');
        throw error;
    }
});

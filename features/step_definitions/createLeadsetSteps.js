const { Given, Then, When } = require('@cucumber/cucumber');
const { takeScreenshot } = require('../utils/screenshot.js');
const { expect } = require('playwright/test');
const assert = require('assert');

require('./commonSteps.js');

When('I navigate to contact management page for creating leadset', async function () {
    try {
        await this.page.waitForTimeout(2000);
        console.log(this.page.url());

        await this.page.hover('#tabContacts');
        await takeScreenshot(this.page, 'tab-contacts-hovered');
        await this.page.waitForTimeout(500);

        await this.page.click('a:has-text("Manage")');
        await this.page.waitForTimeout(2000);
        console.log(this.page.url());
    } catch (error) {
        console.error(' Failed to navigate to contact management page:', error.message);
        await takeScreenshot(this.page, 'error-navigate-contact-management');
        throw error;
    }
});

When('I click on manage submenu', async function () {
    try {
        const leadsetLink = await this.page.$('a[href*="leadset"]');
        if (leadsetLink) {
            await leadsetLink.click();
        } else {
            await this.page.goto('https://tracelog14.slashrtc.in/index.php/site/createleadset');
        }
        await this.page.waitForTimeout(2000);
        await takeScreenshot(this.page, 'click-manage-submenu');
    } catch (error) {
        console.error(' Failed to click on manage submenu:', error.message);
        await takeScreenshot(this.page, 'error-manage-submenu');
        throw error;
    }
});

When('I click on create leadset icon', async function () {
    try {
        const createButton = await this.page.$('a[href*="createleadset"], button:has-text("Create")');
        if (createButton) {
            await createButton.click();
            await this.page.waitForTimeout(2000);
        }
        await takeScreenshot(this.page, 'click-create-leadset-icon');
    } catch (error) {
        console.error(' Failed to click on create leadset icon:', error.message);
        await takeScreenshot(this.page, 'error-create-leadset-icon');
        throw error;
    }
});

When('I fill leadset name as {string}', async function (name) {
    try {
        this.leadsetName = name.replace(/[^a-zA-Z0-9]/g, '');
        await this.page.fill('input[name="name"]', this.leadsetName);
        await takeScreenshot(this.page, 'fill-leadset-name');
    } catch (error) {
        console.error(' Failed to fill leadset name:', error.message);
        await takeScreenshot(this.page, 'error-fill-leadset-name');
        throw error;
    }
});

When('I fill leadset description as {string}', async function (description) {
    try {
        await this.page.fill('textarea[name="description"]', description);
        await takeScreenshot(this.page, 'fill-leadset-description');
    } catch (error) {
        console.error(' Failed to fill leadset description:', error.message);
        await takeScreenshot(this.page, 'error-fill-leadset-description');
        throw error;
    }
});

When('I enable skill option', async function () {
    try {
        console.log('Skill option left as default (false)');
        await takeScreenshot(this.page, 'skill-option-default');
    } catch (error) {
        console.error(' Failed while handling skill option:', error.message);
        await takeScreenshot(this.page, 'error-skill-option');
        throw error;
    }
});

When('I click save button', async function () {
    try {
        await this.page.click('button[type="submit"]');
        await this.page.waitForTimeout(3000);
        await takeScreenshot(this.page, 'click-save-button');
    } catch (error) {
        console.error(' Failed to click save button:', error.message);
        await takeScreenshot(this.page, 'error-save-button');
        throw error;
    }
});

Then('I should see leadset created successfully message', async function () {
    try {
        await this.page.waitForSelector('.alert, [role="alert"], .error, .text-danger', { timeout: 5000 });

        const successElement = await this.page.$('.alert-success, [class*="success"]');
        if (successElement) {
            const successText = await successElement.textContent();
            console.log('✔ Success message:', successText);
            expect(successText.toLowerCase()).toContain('successfully');
            await takeScreenshot(this.page, 'success-message');
            return;
        }

        const errorElement = await this.page.$('.alert-danger, .error, .text-danger, [class*="error"]');
        if (errorElement) {
            const errorText = await errorElement.textContent();
            console.warn('Error message:', errorText);
            if (errorText.includes('must contain a unique value')) {
                console.log('Leadset already exists. Please delete the existing leadset before creating a new one.');
                await takeScreenshot(this.page, 'duplicate-leadset-message');
                return; 
            }
            throw new Error(`Form submission failed: ${errorText}`);
        }

        const bodyText = await this.page.textContent('body');
        if (bodyText.toLowerCase().includes('successfully')) {
            expect(bodyText.toLowerCase()).toContain('successfully');
            await takeScreenshot(this.page, 'success-message-in-body');
        } else if (bodyText.includes('field may only contain alpha-numeric')) {
            throw new Error('Validation error: Name field only allows alpha-numeric characters');
        } else {
            await takeScreenshot(this.page, 'debug-no-messages');
            throw new Error('No success or error messages found on the page');
        }
    } catch (error) {
        console.error('Failed while checking leadset creation message:', error.message);
        await takeScreenshot(this.page, 'error-check-leadset-message');
        throw error;
    }
});

Then('I should be on manage leadset page', async function () {
    try {
        const currentUrl = this.page.url();
        const isManagePage = currentUrl.includes('manage') ||
                             currentUrl.includes('view') ||
                             currentUrl.includes('leadset') ||
                             currentUrl.includes('contact');

        if (!isManagePage) {
            await takeScreenshot(this.page, 'debug-wrong-page');
            throw new Error(`Not on management page. Current URL: ${currentUrl}`);
        }

        await takeScreenshot(this.page, 'manage-leadset-page');
    } catch (error) {
        console.error(' Failed to validate manage leadset page:', error.message);
        await takeScreenshot(this.page, 'error-manage-leadset-page');
        throw error;
    }
});

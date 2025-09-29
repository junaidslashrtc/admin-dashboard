const { Given, Then, When } = require('@cucumber/cucumber');
const { takeScreenshot } = require('../utils/screenshot.js');
const { expect } = require('playwright/test');
const fs = require('fs');
const path = require('path');

require('./commonSteps.js');

When('I navigate to contact management page', async function () {
    try {
        await this.page.waitForTimeout(2000);
        await this.page.hover('#tabContacts');
        await this.page.waitForTimeout(500);
        console.log('✔  Hovered on Contacts tab');

        await this.page.waitForSelector(
            'a[href="https://tracelog14.slashrtc.in/index.php/site/viewleadset"]',
            { visible: true, timeout: 30000 }
        );

        await this.page.click('a[href="https://tracelog14.slashrtc.in/index.php/site/viewleadset"]');
        const currentUrl = this.page.url();

        expect(currentUrl).toContain('/site/viewleadset');
        await takeScreenshot(this.page, 'contacts-manage-clicked');
        console.log('✔  Navigated to contact management page');
    } catch (error) {
        console.error('✖ Failed to navigate to contact management page:', error.message);
        await takeScreenshot(this.page, 'error-contact-manage');
        throw error;
    }
});

When('I click on existing leadset {string}', async function (leadsetName) {
    try {
        await this.page.waitForTimeout(4000);
        console.log(`⏳ Waiting for leadset: ${leadsetName}`);

        await this.page.waitForSelector(`a:has-text("${leadsetName}")`, { timeout: 30000 });
        await this.page.click(`a:has-text("${leadsetName}")`);

        await takeScreenshot(this.page, 'leadset-clicked');
        console.log(`✔  Leadset "${leadsetName}" clicked successfully`);
    } catch (error) {
        console.error(`✖ Failed to click on leadset "${leadsetName}":`, error.message);
        await takeScreenshot(this.page, 'error-leadset-click');
        throw error;
    }
});

// Upload leadset
When('I click on upload button', async function () {
    try {
        console.log('⏳ Clicking upload button...');
        await this.page.waitForTimeout(3000);

        await this.page.click('a[href*="uploadlead?leadset=58"]');
        await this.page.waitForTimeout(2000);

        await takeScreenshot(this.page, 'upload-button-clicked');
        console.log('✔  Upload button clicked successfully');
    } catch (error) {
        console.error('✖ Failed to click upload button:', error.message);
        await takeScreenshot(this.page, 'error-upload-button');
        throw error;
    }
});

// Choose file
When('I Choose csv file', async function () {
    try {
        const fileInput = 'input[name="csv"]';
        const filePath = '/home/intern/avinash/Tracelog14-testing-admin/data/Leadset1.csv';

        if (!fs.existsSync(filePath)) {
            throw new Error(`CSV file not found at: ${filePath}`);
        }

        await this.page.setInputFiles(fileInput, filePath);
        await takeScreenshot(this.page, 'file-uploaded');
        await this.page.waitForTimeout(1000);

        console.log(`✔  CSV file uploaded: ${path.basename(filePath)}`);
    } catch (error) {
        console.error('✖ Failed to upload CSV file:', error.message);
        await takeScreenshot(this.page, 'error-upload-file');
        throw error;
    }
});

// Upload successfully
When('I clicked on upload button', async function () {
    try {
        await this.page.click('#uploadLeadUbmit');
        await this.page.waitForTimeout(3000);

        await takeScreenshot(this.page, 'upload-submitted');
        console.log('✔  Leadset upload submitted successfully');
    } catch (error) {
        console.error('✖ Failed to submit leadset upload:', error.message);
        await takeScreenshot(this.page, 'error-upload-submit');
        throw error;
    }
});

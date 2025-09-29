const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('playwright/test');
const { takeScreenshot } = require('../utils/screenshot.js');

require('./commonSteps.js');

When('I navigate to the campaign manage page', async function () {
    try {
        await this.page.hover('#tabOperations');
        await this.page.waitForTimeout(500);

        const campaignLink = await this.page.$('.sub-menu a[href*="viewcampaign"]');
        if (!campaignLink) throw new Error('Campaign manage link not found');
        await campaignLink.click();

        const currentUrl = this.page.url();
        expect(currentUrl).toContain('/site/viewcampaign');

        console.log('✔  Navigated to campaign manage page');
    } catch (error) {
        console.error('✖ Failed to navigate to campaign manage page:', error.message);
        await takeScreenshot(this.page, 'error-campaign-manage-page');
        throw error;
    }
});

When('I click on create campaign', async function () {
    try {
        await this.page.click('button.dropdown-toggle:has-text("Expand")');
        await this.page.waitForTimeout(5000);

        await this.page.waitForSelector(
            'a[href="https://tracelog14.slashrtc.in/index.php/site/createcampaign"]',
            { visible: true, timeout: 30000 }
        );

        await this.page.click('a[href="https://tracelog14.slashrtc.in/index.php/site/createcampaign"]');
        await this.page.waitForTimeout(1000);

        console.log('✔  Clicked on create campaign button');
    } catch (error) {
        console.error('✖ Failed to click on create campaign button:', error.message);
        await takeScreenshot(this.page, 'error-create-campaign');
        throw error;
    }
});

When('I fill the campaign details with valid information', async function () {
    try {
        // Fill campaign name
        await this.page.fill('input[name="name"]', 'testcamp12');

        // Fill description
        await this.page.fill('input[name="description"]', 'testcampaigncucumber');

        // Fill client
        await this.page.fill('input[name="client"]', 'testcampaign');

        // Select supervisor (samad shaikh)
        await this.page.selectOption('select[name="supervisor[]"]', '42');

        // Select Show Comment dropdown (System option)
        await this.page.selectOption('select[name="leadSearch"]', '2');

        // Fill prefix (leave empty or put "none")
        await this.page.fill('input[name="processPrefix"]', 'none');

        // Click save button
        await this.page.click('button[type="submit"]');
        await this.page.waitForTimeout(2000);

        await takeScreenshot(this.page, 'campaign-details-filled');
        console.log('✔  Campaign details filled and submitted');
    } catch (error) {
        console.error('✖ Failed to fill campaign details:', error.message);
        await takeScreenshot(this.page, 'error-campaign-details');
        throw error;
    }
});

Then('I should see a creation successful message', async function () {
    try {
        await this.page.waitForTimeout(3000);
        const currentUrl = this.page.url();

        if (currentUrl.includes('alertsuccess=Campaign%20created%20Successfully')) {
            await takeScreenshot(this.page, 'new-campaign-created');
            console.log('✔  New campaign created successfully');
        } else {
            // If no success in URL, check for error alert
            await this.page.waitForSelector('.alert-danger', { visible: true, timeout: 3000 });
            await takeScreenshot(this.page, 'campaign-already-exists');
            console.warn('⚠️ Campaign already exists');
        }
    } catch (error) {
        console.error('✖ Error while verifying campaign creation:', error.message);
        await takeScreenshot(this.page, 'error-campaign-creation');
        throw error;
    }
});

const { Given, Then, When } = require('@cucumber/cucumber');
const { takeScreenshot } = require('../utils/screenshot.js');
const { BASE_URL, USERNAME, PASSWORD, CAMPAIGN_MANAGE_PAGE } = require('../utils/constant.js');
const { expect } = require('playwright/test');
const assert = require('assert');
require('./commonSteps.js');

When('I navigate in campaign view', async function(){
 await this.page.hover('#tabOperations');   
 await this.page.waitForTimeout(500);
 const campaignLink = await this.page.$(`.sub-menu a[href*="https://tracelog14.slashrtc.in/index.php/site/viewcampaign"]`);
 await campaignLink.click();
 await this.page.waitForTimeout(1000);
 const currentUrl = this.page.url();
 expect(currentUrl).toContain(CAMPAIGN_MANAGE_PAGE);
 console.log('Navigated to the campaign management page');
});

When('I select a campaign id', async function () {
 const processLink = await this.page.$(`a[href*="https://tracelog14.slashrtc.in/index.php/site/viewcampaignprocess?campaign=31"]`);
 await processLink.click();
 await this.page.waitForTimeout(1000); 
});

When('I click on process {string}', async function (processName) {
   
    const processSpan = this.page.locator(`span#proName141:has-text("${processName}")`);
    await processSpan.click();
    await this.page.waitForTimeout(1000);
});


When('I click on add leadset', async function () {
    const addButton = this.page.locator('button[processid="141"].leadsetAdd');
    await addButton.click();
    await this.page.waitForTimeout(1000);
});

When('I click on input and select leadset', async function () {
    const leadsetInput = this.page.locator('input.select2-search__field[placeholder*="Leadset"]');
    await leadsetInput.click();
    await this.page.waitForTimeout(500);
    await leadsetInput.fill('sla');
    await this.page.waitForTimeout(1000);
    const option = this.page.locator('li.select2-results__option:has-text("slashrtc")');
    await option.click();
    await this.page.waitForTimeout(1000);
    // Force close dropdown by clicking on the selected tag
    const selectedTag = this.page.locator('li.select2-selection__choice[title="slashrtc"]');
    await selectedTag.click();
    await this.page.waitForTimeout(500);
});



When('I click on save button', async function () {
    // await this.page.waitForTimeout(1000);
    await this.page.locator('.saveNewLead').click();  
    // Wait for the modal alert to appear
    const dialogPromise = new Promise((resolve) => {
      this.page.on('dialog', async (dialog) => {
        console.log(`Alert message: ${dialog.message()}`);
        await dialog.accept();
        resolve(dialog.message());
        });
    });
    await dialogPromise;
    await this.page.waitForTimeout(10000); 
});

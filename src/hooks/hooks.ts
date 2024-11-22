import { BeforeAll, AfterAll, Before, After } from "@cucumber/cucumber";
import { chromium, Browser, Page, BrowserContext,expect } from "@playwright/test"
import { pageFixture } from "./pageFixture";
import { invokeBrowser } from "../utility/browsers/browserManager";
import { getEnv } from "../utility/env/env";

let browser: Browser;
let page: Page;
let context: BrowserContext;


BeforeAll(async function() {
    getEnv();
    browser = await invokeBrowser();
    
});

Before(async function() {
    context = await browser.newContext();
    page = await context.newPage();
    pageFixture.page = page;
   
});

After(async function({pickle} ) {
    //screenshot
    const screenshot = await pageFixture.page.screenshot({ path: `./test-result/screenshots/${pickle.name}.png`, type: "png"})
    await this.attach(screenshot, "image/png");
    await page.close();
    await context.close();
   
});

//afterStep hook can also be included if required

AfterAll(async function() {
    await browser.close();
      
});
import { Page, expect } from "playwright/test";

export default class HomePage{

constructor(public page: Page)
{
 
}
 private Elements = {
     homePageLogo: "//div[@class='header-logo']",
     searchTextBox: "#small-searchterms",
     searchButton: "//button[@class='button-1 search-box-button']",
     homePageHeader: "//div[@class='header-menu']"
}
async verifyHomePageTitle(expectedTitle)
{
    await expect(this.page).toHaveTitle(expectedTitle);
}
async verifySearchIcon()
{
    await expect(this.page.locator(this.Elements.searchTextBox)).toBeVisible();
    await expect(this.page.locator(this.Elements.searchButton)).toBeVisible();
 
}

async verifyHomePageLogo()
{
    await expect(this.page.locator(this.Elements.homePageLogo)).toBeVisible();
}
async verifyHomePageHeader()
{
     await expect(this.page.locator(this.Elements.homePageHeader)).toBeVisible();
}

}
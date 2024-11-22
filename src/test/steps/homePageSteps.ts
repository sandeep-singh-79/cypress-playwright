import { Then } from '@cucumber/cucumber'
import {  Page, expect }  from "@playwright/test"
import { pageFixture } from '../../hooks/pageFixture';
import HomePage from '../../pages/homePage';

let homePage: HomePage;

Then('user should see the Home Page title {string}', async function (title) {
  homePage = new HomePage(pageFixture.page);
   await homePage.verifyHomePageTitle(title);
     });

  Then('user should see the search icon', async function () {
    homePage = new HomePage(pageFixture.page);
   await homePage.verifySearchIcon();
    });

  Then('user should see the home page logo', async function () {
    homePage = new HomePage(pageFixture.page);
    await homePage.verifyHomePageLogo();
     });

  Then('user should see the home page header', async function () {
    homePage = new HomePage(pageFixture.page);
    await homePage.verifyHomePageHeader();
     });


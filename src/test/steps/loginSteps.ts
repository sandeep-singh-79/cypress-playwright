import { Given, Then, When } from "@cucumber/cucumber";
import { chromium, Page, Browser, expect } from "@playwright/test";
import { pageFixture } from "../../hooks/pageFixture";
import LoginPage from "../../pages/loginPage";

let loginPage: LoginPage;

Given(
  "User navigates to the application",
  { timeout: 5 * 5000 },
  async function () {
    await pageFixture.page.goto(process.env.BASEURL);
  }
);

Given("User clicks the login link", async function () {
  loginPage = new LoginPage(pageFixture.page);
  await loginPage.navigateToLogin();
});

When(
  "user enters the login details {string}, {string}",
  async function (email, pw) {
    await loginPage.enterCredentials(email, pw);
  }
);

When("user clicks on the login Page", async function () {
  await loginPage.doLogin();
});

Then("User should see the error message {string}", async function (errormsg) {
  await loginPage.verifyFailedLoginMessage(errormsg);
});



When("user clicks on forgot password link", async function () {
  await loginPage.forgotPassword();
});

Then(
  "User should navigate to password recovery page {string}",
  { timeout: 2 * 5000 },
  async function (pagetitle) {
    await expect(pageFixture.page).toHaveTitle(pagetitle);
  }
);

When("user checks the remember me checkbox", async function () {
  await loginPage.checkRememberMeCheckbox();
});

Then("User should see login link on the login page", async function () {
  loginPage = new LoginPage(pageFixture.page);
  await loginPage.verifyLoginLink();
});
// Oranage HRM Code
Then("User should see login Button on the login page", async function () {
  loginPage = new LoginPage(pageFixture.page);
  await loginPage.verifyLoginButton();
});

Then("Enter the {string} and {string}.", async function (username, pw) { 
  await loginPage.enterCredentials(username, pw);
  await loginPage.doLogin();
});


Then("Validate that Invalid message is displaying.", async function (username, pw) { 
  
});

Then("Validate Dashboard Page is loaded.", async function (username, pw) { 
  
});





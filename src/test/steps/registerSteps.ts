import { Given, Then, When } from '@cucumber/cucumber'
import {  Page, expect }  from "@playwright/test"
import { pageFixture } from '../../hooks/pageFixture';
import RegisterPage from '../../pages/registerPage';
import { json } from 'stream/consumers';
import * as registrationData from "../../../testData.json"


let registerPage: RegisterPage;

Given('user clicks on register link', async function () {
     registerPage = new RegisterPage(pageFixture.page);
   await registerPage.clickRegisterLink();
  });

  When('user enters the details {string}, {string}, {string}, {string}', async function (fname, lname, email, pw) {
    await registerPage.fillRegistrationForm(fname, lname, email, pw);
   });

  When('user clicks on register button', async function () {
       await registerPage.clickRegisterButton();
  });

  Then('user should be able to see message {string}', async function (expectedmsg) {
    await registerPage.verifyRegistrationMessage(expectedmsg);
  });

  When('user gets the data from testdata file', async function () {
    await registerPage.readTestData(registrationData.firstName,registrationData.lastName,registrationData.email,registrationData.password);
  });

  
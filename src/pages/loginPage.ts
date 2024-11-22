import { Page, expect } from "playwright/test";

export default class LoginPage{

constructor(public page: Page)
{
 
}
 private Elements = {
    LoginLink: "//a[@class='ico-login']",
    LoginButton:"//button[@type ='submit']",
    username:"//*[@name='username']",
    password: "//*[@name='password']",
    loginButton: "//button[@class='button-1 login-button']",
    loginErrorMsg: "//div[@class='message-error validation-summary-errors']",
    forgotPwdLink: "//span[@class='forgot-password']",
    rememberMeChkbox: "#RememberMe",
    loginFailedMsg: "//div[@class='message-error validation-summary-errors']"


}
async navigateToLogin()
{
    await this.page.locator(this.Elements.LoginLink).isVisible();
    await this.page.locator(this.Elements.LoginLink).click();
}
async enterCredentials(user, pw)
{
    await this.page.fill(this.Elements.username,user);
    await this.page.fill(this.Elements.password,pw);
 
}

async doLogin()
{
    await this.page.locator(this.Elements.LoginButton).click();
}
async failedLogin()
{
   
}
async forgotPassword()
{
    await this.page.locator(this.Elements.forgotPwdLink).click();
}
async verifyPwRecoverPage()
{
   
}
async checkRememberMeCheckbox()
{
    await this.page.locator(this.Elements.rememberMeChkbox).check();
}
async verifyLoginLink()
{
    await this.page.locator(this.Elements.LoginLink).isVisible();
}

async verifyLoginButton()
{
    await this.page.locator(this.Elements.LoginButton).isVisible();
}
async verifyFailedLoginMessage(expectedmsg)
{
     await expect (this.page.locator(this.Elements.loginFailedMsg)).toContainText(expectedmsg)
   
}
}
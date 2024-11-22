import { Page, expect } from "playwright/test";


export default class RegisterPage{

   

constructor(public page: Page)
{
 
}

private Elements = {

    registerLink: "//a[@class='ico-register']", 
    firstName: "#FirstName",
    lastName: "#LastName",
    email: "#Email",
    password: "#Password",
    confirmPassword: "#ConfirmPassword",
    registerButton: "#register-button",
    successRegisterMessage: "//div[@class='page-body']",
      
 
}

    async clickRegisterLink()
{
await this.page.click(this.Elements.registerLink);
}
async fillRegistrationForm(fname, lname, email, pw) 
{
    await this.page.fill(this.Elements.firstName,fname);
    await this.page.fill(this.Elements.lastName,lname);
    await this.page.fill(this.Elements.email,email);
    await this.page.fill(this.Elements.password,pw);
    await this.page.fill(this.Elements.confirmPassword,pw);
}
async clickRegisterButton()
{
    await this.page.click(this.Elements.registerButton);
}
async verifyRegistrationMessage(expectedmsg)
{
     await expect (this.page.locator(this.Elements.successRegisterMessage)).toContainText(expectedmsg)
   
}
async readTestData(fname, lname, email, pw)
{
    
    await this.page.fill(this.Elements.firstName,fname);
    await this.page.fill(this.Elements.lastName,lname);
    await this.page.fill(this.Elements.email,email);
    await this.page.fill(this.Elements.password,pw);
    await this.page.fill(this.Elements.confirmPassword,pw);
   
}
}
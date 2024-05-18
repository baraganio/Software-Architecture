const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/register-form.feature');

let page;
let browser;

defineFeature(feature, test => {
  
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: "new", slowMo: 100 });
      page = await browser.newPage();
    //Way of setting up the timeout
    setDefaultOptions({ timeout: 10000 })

    await page
      .goto("http://localhost:3000", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});
  });

  test('The user is not registered in the site', ({given,when,then}) => {
    
    let username;
    let password;

    given('An unregistered user', async () => {
      username = "user_de_prueba"
      password = "asw_user"
      await expect(page).toClick("button", { text: "¿No tienes una cuenta? Regístrate aquí." });
    });

    when('I fill the data in the form and press submit', async () => {
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('button', { text: 'Crear usuario' })
    });

    then('I should be redirected to main page', async () => {
      const title = await page.$eval("h2", element => element.textContent);
      expect(title).toBe("WIQ 2024");
      
    });
  })

  afterAll(async () => {
    if (!page.isClosed()) {
      await browser.close();
    }
  });
  

});
const puppeteer = require("puppeteer");
const fs = require("fs").promises;

require("dotenv").config();

const run = async () => {
  console.log("Logging in");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://www.facebook.com/login");
  await page.type("#email", process.env.EMAIL);
  await page.type("#pass", process.env.PASSWORD);

  await page.click("#loginbutton");

  const toSaveCookies = await page.cookies();
  await fs.writeFile("./cookies.json", JSON.stringify(toSaveCookies, null, 2));
  await page.waitForNavigation();

  // screenshot after login
  await page.screenshot({ path: "after-login.jpg" });

  console.log("logged in");

  console.log("Logging in using cookies");

  const cookies = require("../cookies.json");
  const context = await browser.createIncognitoBrowserContext();
  const page2 = await context.newPage();
  await page2.setCookie(...cookies);
  await page2.goto("https://www.facebook.com/");

  // screen shot after login using cookies
  await page2.screenshot({ path: "login-using-cookies.jpg" });
  await browser.close();

  console.log("Logged in using cookies");
};

run();

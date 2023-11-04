// src/bing.ts
import puppeteer from "puppeteer";
var BingApi = class {
  constructor(options) {
    this.browser = null;
    this.options = options;
  }
  launch() {
    return new Promise(async (resolve, reject) => {
      this.browser = await puppeteer.launch({
        headless: "new",
        timeout: this.options.timeout
      });
      resolve();
    });
  }
  async setCookieAndReload(page) {
    const cookie = { "name": "_U", "value": this.options.cookie };
    await page.setCookie(cookie);
    await page.reload();
  }
  createImage(query) {
    return new Promise(async (resolve, reject) => {
      if (!this.browser) {
        await this.launch();
      }
      if (!this.browser) {
        reject("Browser not launched");
        return;
      }
      const page = await this.browser.newPage();
      await page.goto(`https://www.bing.com/images/create?q=${query}`, {
        waitUntil: "networkidle2"
      });
      await this.setCookieAndReload(page);
      await page.waitForSelector("#bnp_btn_accept");
      await page.click("#bnp_btn_accept");
      await page.waitForSelector(".mimg");
      const res = await page.$$eval(".mimg", (imgs) => imgs.map((img) => img.getAttribute("src")));
      const urls = res.map((url) => {
        return url?.split("?")[0];
      });
      await page.close();
      resolve({
        urls
      });
    });
  }
  getDalleCredits() {
    return new Promise(async (resolve, reject) => {
      if (!this.browser) {
        await this.launch();
      }
      if (!this.browser) {
        reject("Browser not launched");
        return;
      }
      const page = await this.browser.newPage();
      await page.goto(`https://www.bing.com/images/create`, {
        waitUntil: "networkidle2"
      });
      await this.setCookieAndReload(page);
      await page.waitForSelector("#token_bal");
      const tokens = await page.$eval("#token_bal", (el) => el.textContent);
      await page.close();
      resolve(Number(tokens));
    });
  }
  close() {
    return new Promise(async (resolve) => {
      if (this.browser) {
        await this.browser.close();
      }
      resolve();
    });
  }
};
var bing_default = BingApi;
export {
  bing_default as BingApi
};

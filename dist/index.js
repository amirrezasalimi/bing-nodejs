var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  BingApi: () => bing_default
});
module.exports = __toCommonJS(src_exports);

// src/bing.ts
var import_puppeteer = __toESM(require("puppeteer"));
var BingApi = class {
  constructor(options) {
    this.browser = null;
    this.options = options;
  }
  launch() {
    return new Promise(async (resolve, reject) => {
      this.browser = await import_puppeteer.default.launch({
        headless: "new",
        defaultViewport: {
          width: 1920,
          height: 1080
        },
        args: ["--no-sandbox"],
        timeout: 1e3 * 10
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
      await page.goto(`https://www.bing.com/images/create`, {
        waitUntil: "networkidle2"
      });
      await this.setCookieAndReload(page);
      try {
        await page.waitForSelector("#bnp_btn_accept");
        await page.click("#bnp_btn_accept");
      } catch (e) {
        console.log(
          "Accept button not found, continuing..."
        );
      }
      await page.focus("#sb_form_q");
      await page.keyboard.type(query);
      await page.keyboard.press("Enter");
      await page.waitForSelector(".imgpt", {
        timeout: this.options.timeout || 1e3 * 60
      });
      const res = await page.$$eval(".imgpt", (imgs) => {
        return imgs.map((img) => {
          return img.querySelector("img")?.getAttribute("src");
        });
      });
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BingApi
});

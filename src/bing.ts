import puppeteer, { Browser, Page } from 'puppeteer';
interface Options {
    cookie: string;
    timeout?: number;
}
interface Output {
    urls: string[];
}


class BingApi {
    options: Options;
    browser: Browser | null = null;
    constructor(options: Options) {
        this.options = options;
    }
    private launch(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            this.browser = await puppeteer.launch({
                headless: "new",
                timeout: this.options.timeout,
                args: ["--no-sandbox"]
            })
            resolve();
        });
    }
    async setCookieAndReload(page: Page) {
        const cookie = { "name": "_U", "value": this.options.cookie }
        await page.setCookie(cookie);
        await page.reload();
    }
    createImage(query: string): Promise<Output> {
        return new Promise(async (resolve, reject) => {
            if (!this.browser) {
                await this.launch();
            }
            if (!this.browser) {
                reject("Browser not launched");
                return;
            }

            // pptr
            const page = await this.browser.newPage();
            await page.goto(`https://www.bing.com/images/create?q=${query}`, {
                waitUntil: 'networkidle2',
            });
            await this.setCookieAndReload(page);

            // click on  accept button if its there
            try {
                await page.waitForSelector('#bnp_btn_accept');
                await page.click('#bnp_btn_accept');
            } catch (e) {
                console.log(
                    "Accept button not found, continuing..."
                );
            }

            // wait until img tags with .mimg class are loaded
            await page.waitForSelector('.mimg',);

            // then extract the src attribute of those img tags
            const res = await page.$$eval('.mimg', imgs => imgs.map(img => img.getAttribute('src')));

            // remove params from url
            const urls = res.map((url) => { return url?.split("?")[0] });
            // close page
            await page.close();

            resolve({
                urls: urls as string[]
            });
        });
    }
    getDalleCredits(): Promise<number> {
        return new Promise(async (resolve, reject) => {
            if (!this.browser) {
                await this.launch();
            }
            if (!this.browser) {
                reject("Browser not launched");
                return;
            }

            // pptr
            const page = await this.browser.newPage();
            await page.goto(`https://www.bing.com/images/create`, {
                waitUntil: 'networkidle2',
            });
            await this.setCookieAndReload(page);

            // wait for #token_bal
            await page.waitForSelector('#token_bal');
            const tokens = await page.$eval('#token_bal', el => el.textContent);

            // close
            await page.close();

            resolve(Number(tokens));
        });
    }
    close(): Promise<void> {
        return new Promise(async (resolve) => {
            if (this.browser) {
                await this.browser.close();
            }
            resolve();
        });
    }
}

export default BingApi;
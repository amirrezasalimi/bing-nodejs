import { Browser, Page } from 'puppeteer';
interface Options {
    cookie: string;
    timeout?: number;
}
interface Output {
    urls: string[];
}
declare class BingApi {
    options: Options;
    browser: Browser | null;
    constructor(options: Options);
    private launch;
    setCookieAndReload(page: Page): Promise<void>;
    createImage(query: string): Promise<Output>;
    getDalleCredits(): Promise<number>;
    close(): Promise<void>;
}
export default BingApi;

import { BingApi } from "../dist/index";

const bing = new BingApi({
    cookie: process.env.BING_COOKIE as string,
})

await bing.createImage("cute cat").then((output) => {
    console.log(
        output
    );
})
await bing.getDalleCredits().then((credits) => {
    console.log(
        credits
    );
})
await bing.close();

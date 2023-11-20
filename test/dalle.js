const { BingApi } = require('../dist/index.js');
const bing = new BingApi({
    cookie: process.env.BING_COOKIE,
})

async function main() {
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

}
main();
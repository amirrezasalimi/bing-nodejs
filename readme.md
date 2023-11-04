# bing-nodejs

A Node.js package for using the DALLE3 API to create images with Bing. DALLE3 is the latest image generation model from OpenAI, known for its high-quality image generation.

## Installation

You can install this package using npm:

```bash
npm install bing-nodejs
```

To use the bing-nodejs package, follow these steps:

1. Import the BingApi class:
```js
import { BingApi } from "bing-nodejs";
```

2. Create an instance of BingApi by providing your Bing Image Creator cookie:

```js
const bing = new BingApi({
    cookie: "YOUR_COOKIE_VALUE_HERE",
});
```

To obtain your cookie value, follow these steps:

- Go to Bing Image Creator in your browser and log in to your account.
- Press Ctrl+Shift+J (or Cmd+Option+J on Mac) to open the developer tools.
- Navigate to the Application section.
- Click on the Cookies section.
- Find the variable _U and copy its value.
- Paste the copied value as the cookie 
- parameter when creating the BingApi instance.

#### Use the package to create images with DALLE3:
```js
await bing.createImage("cute cat").then((urls) => {
    console.log(urls); // string[]
});
```

#### You can also check your DALLE3 credits:
```js
await bing.getDalleCredits().then((credits) => {
    console.log(credits); // number
});
```

#### Make sure to close the connection when you're done:
```js
await bing.close();
```


### Credits:
Inspired by the Python version: [https://github.com/Agora-X/Dalle3](https://github.com/Agora-X/Dalle3)

## License
This package is licensed under the MIT License.
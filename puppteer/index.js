/*
* 掘金账号自登录
*
* */
const puppeteer = require('puppeteer');
const {join} = require('path');


; (async () => {
    const browser = await puppeteer.launch({
        // executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        // headless: false,        // 开启界面
        args: [`--window-size=${1440},${1000}`], // new option
        defaultViewport: { width: 1440, height: 1000 },
    });

    const page = await browser.newPage();
    // 新建页面
    await page.waitForTimeout(1000);                    // 暂停 500ms


    var cookie6 = {
        name: "sid_guard",
        value:"4971bf4d492313c22acc40c97b2c590a%7C1682407871%7C31536000%7CWed%2C+24-Apr-2024+07%3A31%3A11+GMT",
        domain: "juejin.cn/",
        path: "/",
        expires: Date.now() + 3600 * 1000
    };

    await page.setCookie(cookie6);       // 设置cookie

    await page.goto('https://juejin.cn/');       // 打开页面

    await page.waitForTimeout(1000);

    await page.screenshot({path: join(__dirname, "example.png")});

    browser.close();
})();
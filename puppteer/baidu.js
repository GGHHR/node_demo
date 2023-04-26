/*
* 掘金账号自登录
*
* */
const puppeteer = require('puppeteer');
const {join} = require('path');

; (async () => {
    const browser = await puppeteer.launch({
        // executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        headless: false,        // 开启界面
        args: [`--window-size=${1440},${1000}`], // new option
        defaultViewport: { width: 1440, height: 1000 },
    });

    const page = await browser.newPage();
    // 新建页面
    await page.waitForTimeout(500);                    // 暂停 500ms


    var cookie6 = {
        name: "BDUSS_BFESS",
        value: "d3ei11R3Fta010LWsxZzRHTUlXeHJJS2d2d3QwS3JkMlp3eXpJb0lITWNIVzlrSUFBQUFBJCQAAAAAAAAAAAEAAACi-qQ6YWFhYWFhYWFhYTE3MwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAByQR2QckEdkUV",
        domain: ".baidu.com",
        path: "/",
        expires: Date.now() + 3600 * 1000
    };

    await page.setCookie(cookie6);       // 设置cookie

    await page.goto('https://www.baidu.com/');       // 打开页面

    await page.waitForTimeout(500);

    await page.screenshot({path: join(__dirname, "example.png")});

    // browser.close();
})();
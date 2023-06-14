
let url="https://github.com/search?q=节点&type=repositories&s=updated&o=desc&p=1";

/*
* 掘金账号自登录
*
* */
const puppeteer = require('puppeteer');
const {join} = require('path');


; (async () => {
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        headless: false,        // 开启界面
        args: [`--window-size=${1440},${1000}`], // new option
        defaultViewport: { width: 1440, height: 1000 },
    });

    const page = await browser.newPage();



    await page.goto('https://juejin.cn/');       // 打开页面


    inputElement = await  page.$(".logo")

    console.log(inputElement)
    await  inputElement.screenshot({path: join(__dirname, "example1.png")})

    await page.type('.search-input', 'node', {delay: 100});

    await page.click('.seach-icon-container')

    //判断页面加载完成
    await page.waitForNavigation({
        waitUntil:"networkidle0"
    });

    await page.screenshot({path: join(__dirname, "example.png")});

    browser.close();
})();
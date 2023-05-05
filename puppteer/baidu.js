const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.baidu.com/', { waitUntil: 'networkidle2' });
    const html = await page.content();
    fs.writeFileSync('baidu.html', html);
    await browser.close();
})();
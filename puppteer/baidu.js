const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    });

    const page = await browser.newPage();

    await page.goto('https://github.com/search?q=节点&type=repositories&s=updated&o=desc&p=1');

    await page.waitForSelector('a[class="v-align-middle"]');

    let elements = await page.$$('span[class="search-match"]');

    if (elements.length === 0) {
        elements = await page.$$('a[class="v-align-middle"]');
    }

    const content = [];

    for (const element of elements) {
        const url = await page.evaluate((el) => 'https://github.com/' + el.innerText, element);
        content.push(url);
    }

    let index = 0;

    for (const element of content) {
        index++;
        console.log('正在加载：' + element);

        await page.goto(element);

        await page.screenshot({ path: `screenshot${index}.png`, fullPage: true });

        const el = await page.$$('div[id="readme"]');

        for (const divElement of el) {
            const innerText = await page.evaluate((el) => el.innerText, divElement);
            const regex = /\b(?:https?:\/\/|www\.)\S+\.yaml\b/g;
            const matches = innerText.match(regex);
            const links = matches ? matches : [];
            await fs.appendFile('output.txt', links.join('\n') + '\n');
        }
    }

    await browser.close();
})();

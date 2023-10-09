const puppeteer = require('puppeteer');
const sqlite3 = require('sqlite3').verbose();
const ps = require('ps-node');
const path = require('path');


function getRunningV2raynPath() {
    return new Promise((resolve, reject) => {
        ps.lookup({
            command: 'v2rayn.exe',
        }, (err, resultList) => {
            if (err) {
                console.log('查询过程中出现错误：', err);
                reject(err);
                return;
            }

            if (resultList.length > 0) {
                const v2raynProcess = resultList[0];
                const parsedPath = path.parse(v2raynProcess.command);

                resolve(parsedPath.dir);
            } else {
                console.log('v2rayn 未在运行');
                resolve(null);
            }
        });
    });
}


class SubGet {
    async initialize(url, listEl, el, remarks, id) {
        this.url = url;
        this.listEl = listEl;
        this.el = el;
        this.remarks = remarks;
        this.id = id;

        this.browser = await puppeteer.launch({
            headless: true,
            executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        });
        await this.start();
    }

    async start() {
        const page = await this.browser.newPage();
        await page.goto(this.url);
        await page.waitForSelector(this.listEl,{timeout:99999});

        const content = await page.$eval(this.listEl, element => element.href);

        await page.goto(content);

        await page.waitForSelector(this.el,{timeout:99999});


        let content1 =  await page.$eval(this.el, element => element.textContent);

        // 定义匹配URL的正则表达式模式
        const urlPattern = /https?:\/\/[^\s/$.?#].[^\s]*/gi;

        // 查找匹配的链接
        const matches = content1.match(urlPattern);

        // 输出匹配的链接
        for (const match of matches||[]) {
            let convertTarget = "";

            if (match.endsWith("yaml")) {
                convertTarget = "mixed";
            }

            console.log(`链接${this.remarks}：${match}`);

            // 调用 UpSubItem.Up() 函数
            await new UpSubItem(match, this.remarks, this.id, convertTarget); // 等待函数完成

            await this.browser.close();
        }
    }
}

class SubGet1 {
    async initialize(url, el, remarks, id) {
        this.url = url;
        this.el = el;
        this.remarks = remarks;
        this.id = id;

        this.browser = await puppeteer.launch({
            headless: false,
            executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        });
        this.start();
    }

    async start() {
        const page = await this.browser.newPage();
            await page.goto(this.url);
            await page.waitForSelector(this.el,{timeout:99999});

            const content1= page.$eval(this.el, element => element.textContent);

            // 定义匹配URL的正则表达式模式
            const urlPattern = /https?:\/\/[^\s/$.?#].[^\s]*/gi;

            // 查找匹配的链接
            const matches = content1.match(urlPattern);

            // 输出匹配的链接
            for (const match of matches) {
                let convertTarget = "";

                if (match.endsWith("yaml")) {
                    convertTarget = "mixed";
                }

                console.log(`链接${this.remarks}：${match}`);

                // 调用 UpSubItem.Up() 函数
                await new UpSubItem(match, this.remarks, this.id, convertTarget); // 等待函数完成

                await this.browser.close();
            }

    }
}





class UpSubItem {
    constructor(url, remarks, id, convertTarget) {
         getRunningV2raynPath()
            .then(command => {
                if (command) {

                    const outputValue = path.join(command,'guiConfigs/guiNDB.db'); // 替换为实际的输出路径
                    // console.log(outputValue)
                    // 打开数据库连接
                    const db = new sqlite3.Database(outputValue, sqlite3.OPEN_READWRITE)

                    // 定义 SQL 语句以插入或替换 SubItem 表中的记录
                    const insertOrUpdateSql = `INSERT OR REPLACE INTO SubItem (remarks, url, id, convertTarget) VALUES (?, ?, ?, ?)`;

                    // 执行 SQL 语句
                    db.run(insertOrUpdateSql, [remarks, url, id, convertTarget], function (err) {
                        if (err) {
                            console.error(err.message);
                        } else {
                            // console.log(`Row(s) updated: ${this.changes}`);
                        }

                        // 关闭数据库连接
                        db.close((err) => {
                            if (err) {
                                console.error(err.message);
                            } else {
                                // console.log('Closed the database connection.');
                            }
                        });
                    });
                } else {
                    console.log('v2rayn 未在运行');
                }
                return command;
            })
            .catch(err => {
                console.log('获取路径时出现错误：', err);
            });


    }
}

async function main() {



    // 进来是列表的那种
    await new SubGet().initialize("https://nodefree.org/", ".item-title a", ".section p", "a1", "1");
    await new SubGet().initialize("https://clashnode.com/", "[cp-post-title] a", ".post-content-content h2+p+p+p", "a2", "2");
    await new SubGet().initialize("https://v2cross.com/", ".entry-title a", ".entry-content h5", "a3", "3");
    await new SubGet().initialize("https://clashgithub.com/", "[itemprop=\"name headline\"] a", ".article-content p:nth-child(11)", "a4", "4");
    await new SubGet().initialize("https://kkzui.com/", ".row  .url-card:last-child a", ".panel-body p:nth-child(7)", "a6", "6");
    // 进来直接找链接
    await new SubGet1().initialize("https://wanshanziwo.eu.org/", ".is-fullwidth tr:nth-child(3) td", "b1", "1000");
}

main();

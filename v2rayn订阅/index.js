const puppeteer = require('puppeteer');
const sqlite3 = require('sqlite3').verbose();
const ps = require('ps-node');
const fs = require("fs");
const path = require("path");


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
    constructor(browser) {
        this.browser = browser;
    }
    async initialize(url,sel, remarks, id) {
        this.url = url;
        this.listEl = sel[0];
        this.el = sel[1];
        this.remarks = remarks;
        this.id = id;

        await this.start();
    }

    async start() {
        const page = await this.browser.newPage();

        console.log('正在：' + this.url);

        await page.goto(this.url,{timeout:99999});
        let content;
        if (this.listEl) {
            await page.waitForSelector(this.listEl,{timeout:99999});
            content = await page.$eval(this.listEl, element => element.href);
            await page.goto(content,{timeout:99999});
            console.log('正在：' + content);
        }
        await page.waitForSelector(this.el,{timeout:99999});
        content = await page.$eval(this.el, element => element.textContent);

        // 定义匹配URL的正则表达式模式
        const urlPattern = /https?:\/\/[^\s/$.?#].[^\s]*/gi;

        // 查找匹配的链接
        const match = content.match(urlPattern)[0];

        // 输出匹配的链接
        let convertTarget = "";
        if (match.endsWith("yaml"||"yml")) {
            convertTarget = "mixed";
        }
        console.log(`链接${this.remarks}：${match}`);
        // 调用 UpSubItem.Up() 函数
        await  UpSubItem(match, this.remarks, this.id, convertTarget); // 等待函数完成


        await page.close();
    }
}

    async function UpSubItem(url, remarks, id, convertTarget) {
        try {
            const command = await getRunningV2raynPath();
            if (command) {
                const outputValue = path.join(command, 'guiConfigs/guiNDB.db');
                const db = new sqlite3.Database(outputValue, sqlite3.OPEN_READWRITE);
                const insertOrUpdateSql = `INSERT OR REPLACE INTO SubItem (remarks, url, id, convertTarget,sort) VALUES (?, ?, ?, ?, ?)`;

                db.run(insertOrUpdateSql, [remarks, url, id, convertTarget, id], function (err) {
                    if (err) {
                        console.error(err.message);
                    }
                    db.close((err) => {
                        if (err) {
                            console.error(err.message);
                        }
                    });
                });
            } else {
                console.log('v2rayn 未在运行');
            }

            return command;
        } catch (error) {
            console.error('处理路径时出现错误：', error);
        }
    }


async function main() {

    const select = JSON.parse(fs.readFileSync('./init.json', 'utf8'));

    let browser =   await puppeteer.launch({
        headless: "new",
        slowMo: 250,
        executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    });

    await Promise.all(select.select.map(async (v, i) => {
        v.id=i+1;
        try {
            await new SubGet(browser).initialize(v.url, v.sel, i + 1, i + 1);
            v.update=true;
        } catch (e) {
            v.update=false;
            v.shibai=v.shibai?v.shibai+1:1;
            console.log(`${i + 1}失败：`+ v.url);

        }
    }));

    await cleanupDatabase(select.select.length);
    await fs.writeFileSync('./init.json',JSON.stringify(select),'utf-8');
    await browser.close()
    await process.exit(0);

}

main();
const cleanupDatabase = async (num) => {
    try {
        const command = await getRunningV2raynPath();
        console.log('Command:', command);
        if (command) {
            const outputValue = path.join(command, 'guiConfigs/guiNDB.db');
            const db = new sqlite3.Database(outputValue, sqlite3.OPEN_READWRITE);
            const deleteSql = `DELETE FROM SubItem WHERE sort > ${num}`;
            console.log('Delete SQL:', deleteSql);
            db.exec(deleteSql, function (err) {
                if (err) {
                    console.error('Error deleting records:', err.message);
                } else {
                    console.log('Records with sort >', num, 'deleted successfully.');
                }
            });

            db.close((err) => {
                if (err) {
                    console.error('Error closing the database connection:', err.message);
                } else {
                    console.log('Closed the database connection.');
                }
            });
        } else {
            console.log('v2rayn is not running.');
        }
    } catch (error) {
        console.error('Cleanup operation failed:', error);
    }
};


const puppeteer = require('puppeteer-core');
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

        if(sel==undefined){
            let convertTarget = "";
            if (url.endsWith("yaml") || url.endsWith("yml")) {
                convertTarget = "mixed";
            }
            console.log(`链接${id}：${url}`);
            console.log(convertTarget);
            // 调用 UpSubItem.Up() 函数
            return  await  UpSubItem(url, remarks, id, convertTarget); // 等待函数完成
        }

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
        if (match.endsWith("yaml") || match.endsWith("yml")) {
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
    let select ;

    let browser =   await puppeteer.launch({
        headless: "new",
        slowMo: 250,
        executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    });

    try {
        console.log('请求远程json中')
        const page = await browser.newPage();
        let  url='https://raw.githubusercontent.com/GGHHR/node_demo/master/v2rayn%E8%AE%A2%E9%98%85/init.json';
        await page.goto(url,{timeout:99999});
        await page.waitForSelector('pre',{timeout:99999});
        let  content = await page.$eval('pre', element => element.textContent);
        content=JSON.parse(content);
        select=content;
        await page.close();
        console.log('请求成功')
    }catch (e){

        select  = JSON.parse(fs.readFileSync('./init.json', 'utf8'));
        console.log('请求失败，用本地的json文件')
    }

    await Promise.all(select.select.map(async (v, i) => {
        v.id=i+1;
        try {
            await new SubGet(browser).initialize(v.url, v.sel, i + 1, i + 1);
        } catch (e) {
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
        console.log('命令:', command);
        if (command) {
            const outputValue = path.join(command, 'guiConfigs/guiNDB.db');
            const db = new sqlite3.Database(outputValue, sqlite3.OPEN_READWRITE);
            const deleteSql = `DELETE FROM SubItem WHERE sort > ${num}`;
            console.log('删除 SQL:', deleteSql);
            db.exec(deleteSql, function (err) {
                if (err) {
                    console.error('删除记录时出错:', err.message);
                } else {
                    console.log('成功删除排序大于', num, '的记录。');
                }
            });

            db.close((err) => {
                if (err) {
                    console.error('关闭数据库连接时出错:', err.message);
                } else {
                    console.log('已关闭数据库连接。');
                }
            });
        } else {
            console.log('v2rayn 未在运行。');
        }
    } catch (error) {
        console.error('清理操作失败:', error);
    }
};


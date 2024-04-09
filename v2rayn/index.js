const puppeteer = require('puppeteer-core');
const sqlite3 = require('better-sqlite3');
const ps = require('ps-node');
const fs = require("fs");
const path = require("path");
let  not_clean_arr=[]

function getRunningV2raynPath() {
    return new Promise((resolve, reject) => {
        ps.lookup({
            command: 'v2rayN.exe',
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
let num =0

class SubGet {
    constructor(browser) {
        this.browser = browser;
    }
    async initialize(url,sel, remarks, id) {
        not_clean_arr.push(id);

        num++;
        if(sel==undefined){
            let convertTarget = "";
            if (url.endsWith("yaml") || url.endsWith("yml")) {
                convertTarget = "mixed";
            }
            console.log(id,`${url}`);
            //
            // console.log(url, remarks, id, convertTarget);
            // console.log(url, num, num, convertTarget);
            // 调用 UpSubItem.Up() 函数
            return  await  UpSubItem(url, id, id, convertTarget); // 等待函数完成
        }

        this.url = url;
        this.listEl = sel[0];
        this.el = sel[1];
        this.remarks = id;
        this.id = id;

        await this.start();

    }

    async start() {
        const page = await this.browser.newPage();

        // console.log('正在：' + this.url);

        await page.goto(this.url,{timeout:99999});
        let content;
        if (this.listEl) {
            await page.waitForSelector(this.listEl,{timeout:99999});
            content = await page.$eval(this.listEl, element => element.href);
            await page.goto(content,{timeout:99999});
            // console.log('正在：' + content);
        }


        await page.waitForSelector(this.el,{timeout:99999});
        /*content = await page.$eval(this.el, element => element.textContent);

        // 定义匹配URL的正则表达式模式
        const urlPattern = /https?:\/\/[^\s/$.?#].[^\s]*!/gi;

        // 查找匹配的链接
        const match = content.match(urlPattern)[0];

        // 输出匹配的链接
        let convertTarget = "";
        if (match.endsWith("yaml") || match.endsWith("yml")) {
            convertTarget = "mixed";
        }
        // console.log(`链接${this.remarks}：${match}`);
        console.log(this.remarks,`${match}`);
        // 调用 UpSubItem.Up() 函数
        await  UpSubItem(match, this.remarks, this.id, convertTarget); // 等待函数完成
*/


        let contents = await page.$$eval(this.el, elements => {

            return  elements.map(element => element.textContent);
        });
        contents.map((content,i)=>{
            const urlPattern = /https?:\/\/[^\s/$.?#].[^\s]*/gi;
            const match = content.match(urlPattern)[0];

            // 输出匹配的链接
            let convertTarget = "";
            if (match.endsWith("yaml") || match.endsWith("yml")) {
                convertTarget = "mixed";
            }
            // console.log(`链接${this.remarks}：${match}`);
            // 调用 UpSubItem.Up() 函数
            this.id=i==0?this.id:100*this.id+i;

            console.log(this.id,`${match}`);

            // console.log(match, num,num, convertTarget)
            UpSubItem(match, this.id,this.id, convertTarget);
        })
        // 定义匹配URL的正则表达式模式
        await page.close();

    }
}
async function UpSubItem(url, remarks, id, convertTarget) {
    not_clean_arr.push(id);
    try {
        const command = await getRunningV2raynPath();
        if (command) {
            const outputValue = path.join(command, 'guiConfigs/guiNDB.db');
            const db = sqlite3(outputValue); // Modified line
            const insertOrUpdateSql = `INSERT OR REPLACE INTO SubItem (remarks, url, id, convertTarget,sort) VALUES (?, ?, ?, ?, ?)`;

            try {
                const stmt = db.prepare(insertOrUpdateSql); // Modified line
                stmt.run(remarks+'', url, id+'', convertTarget, id); // Modified line
            } catch (err) {
                console.error(err.message);
            }

            // db.close(); // Optionally removed line
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
        let  url='https://raw.githubusercontent.com/GGHHR/node_demo/master/v2rayn/init.json';
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
            console.log(`${i + 1}  失败：`+ v.url );
        }
    }));

    await cleanupDatabase(not_clean_arr);
    await fs.writeFileSync('./init.json',JSON.stringify(select),'utf-8');
    await browser.close()
    await process.exit(0);

}

main();
const cleanupDatabase = async (num) => {
    console.log(num)
    try {
        const command = await getRunningV2raynPath();
        console.log('命令:', command);
        if (command) {
            const outputValue = path.join(command, 'guiConfigs/guiNDB.db');
            const db = sqlite3(outputValue); // Keep your original sqlite3 instantiation
            // Convert the array of numbers into a list of placeholders for the SQL query
            const placeholders = num.map(() => '?').join(', ');
            const deleteSql = `DELETE FROM SubItem WHERE sort NOT IN (${placeholders})`;

            console.log(placeholders)

            // Execute the SQL query using a prepared statement
            try {
                const stmt = db.prepare(deleteSql);
                const info = stmt.run(num); // Use the array directly if your library supports it
                console.log(`成功删除排序不在 [${num.join(', ')}] 内的记录。已删除记录数: ${info.changes}`);
            } catch (err) {
                console.error('删除记录时出错:', err.message);
            }

            // Close the database connection
            db.close();
            console.log('已关闭数据库连接。');
        } else {
            console.log('v2rayn 未在运行。');
        }
    } catch (error) {
        console.error('清理操作失败:', error);
    }
};
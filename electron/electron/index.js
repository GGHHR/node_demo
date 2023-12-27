const electron = require('electron');
let {desktopCapturer ,app, BrowserWindow, globalShortcut, Menu, MenuItem, ipcMain, autoUpdater, dialog} = electron;

const Store = require('electron-store');

const store = new Store();

let path = require('path')


const createWindow = () => {
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            enableRemoteModule: true,
            worldSafeExecuteJavaScript: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    //窗口最大化
    win.maximize();
    // 设置窗口为全屏
    // win.setFullScreen(true);
    electron.Menu.setApplicationMenu(null)
    // win.webContents.openDevTools();

    win.once('ready-to-show', () => {
        win.show(); // 当窗口准备好显示时，显示窗口
    });

    const indexPath = path.join('dist', 'index.html');
    app.isPackaged ? win.loadFile(indexPath) : win.loadURL('http://localhost:5173/#/');

    const menu = new Menu()
    menu.append(new MenuItem({
        label: '帮助',
        submenu: [{
            label: '开发者工具',
            role: 'help',
            accelerator: process.platform === 'darwin' ? 'F12' : 'F12',
            click: () => {
                // 判断开发者工具是否已打开
                if (!win.webContents.isDevToolsOpened()) {
                    // 打开开发者工具
                    win.webContents.openDevTools();
                } else {
                    // 关闭开发者工具
                    win.webContents.closeDevTools();
                }

            }
        }]
    }))

    Menu.setApplicationMenu(menu)



    ipcMain.on('savevideo', async (event, data) => {
        console.log(data)
        desktopCapturer.getSources({ types: ['screen'],thumbnailSize: { width: 1920, height: 1080 } }).then(async sources => {
            for (const source of sources) {
                console.log( source.name)
                console.log( win.getTitle())
                win.webContents.send('SET_SOURCE', source.id)
            }
        })

    });



    /*最小化 */
    ipcMain.handle('min', () => {
        win.minimize()
    });
    /*关闭 */
    ipcMain.handle('close', () => {
        win.close()
    });
    /*获取记住的帐号密码 */
    ipcMain.handle('getStoreData', () => {
        return store.get('userData');
    });

    // 监听渲染进程请求来保存数据
    ipcMain.on('saveData', (event, data) => {
        store.set('userData', data);
    });


}
app.whenReady().then(() => {
    createWindow();
    update();
})




app.on('will-quit', () => {

})

function update() {


}
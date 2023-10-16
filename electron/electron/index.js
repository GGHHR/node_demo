const electron= require('electron');
let { app, BrowserWindow ,globalShortcut,Menu,MenuItem,ipcMain}=electron;

let path = require('path')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    //窗口最大化
    win.maximize();
    // 设置窗口为全屏
    // win.setFullScreen(true);
    electron.Menu.setApplicationMenu(null)
    // win.webContents.openDevTools();

    const indexPath = path.join(  'dist', 'index.html');
    win.loadFile(indexPath)
    // win.loadURL('http://localhost:5173/')

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
                }else{
                    // 关闭开发者工具
                    win.webContents.closeDevTools();
                }

            }
        }]
    }))

    Menu.setApplicationMenu(menu)

}
app.whenReady().then(() => {
    createWindow()
})
ipcMain.on('message-from-renderer', (event, message) => {

    console.log('Received message from renderer:', message);

    event.reply('message-to-renderer', 'Hello from main process!');
});
app.on('will-quit', () => {

})
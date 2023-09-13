let {join}=require('path');
let {BrowserWindow,app}=require('electron');
// 创建窗口
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    // win.loadURL("http://localhost:5173/")
    win.loadFile(join(__dirname,"../dist/index.html"))
    win.webContents.openDevTools();
    // 打开文件选择器
    // dialog.showOpenDialog(win, {
    //     properties: ['openFile']
    // }).then(result => {
    //     if (!result.canceled) {
    //         const filePaths = result.filePaths;
    //         console.log('Selected file paths:', filePaths);
    //         // 进一步处理选中的文件路径
    //     }
    // });
}

// 应用程序准备就绪时创建窗口
app.whenReady().then(createWindow);

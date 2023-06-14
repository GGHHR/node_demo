let  app=require('electron').app;
let  BrowserWindow=require('electron').BrowserWindow;
// 创建窗口
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.loadURL("http://localhost:5173/")

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

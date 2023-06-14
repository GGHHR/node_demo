const { DevTools } = require('edge-devtools-client');

// 连接到 Edge 浏览器的 DevTools
DevTools.createSession(async (session) => {
    // 订阅 'Browser.windowBoundsChanged' 事件，监听窗口大小和位置的变化
    session.on('Browser.windowBoundsChanged', (event) => {
        const { windowId, bounds } = event;

        console.log(`窗口 ${windowId} 的位置和大小发生了变化：`);
        console.log('新的位置:', bounds.left, bounds.top);
        console.log('新的大小:', bounds.width, bounds.height);
    });

    // 开启 'Browser.windowBoundsChanged' 事件的监听
    await session.send('Browser.enable');

    // 获取所有窗口的信息
    const { windowIds } = await session.send('Browser.getWindowBounds');

    for (const windowId of windowIds) {
        // 打印当前窗口的位置和大小
        const { bounds } = await session.send('Browser.getWindowBounds', { windowId });

        console.log(`窗口 ${windowId} 的位置和大小：`);
        console.log('位置:', bounds.left, bounds.top);
        console.log('大小:', bounds.width, bounds.height);
    }
});

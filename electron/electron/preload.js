// preload.js

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    send: (channel, data) => {
        // 从渲染进程发送消息到主进程
        ipcRenderer.send(channel, data);
    },
    receive: (channel, func) => {
        // 从主进程接收消息
        ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
});

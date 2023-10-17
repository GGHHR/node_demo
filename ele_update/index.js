const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, './outputs')));
// 启动 Express 服务器
app.listen(port, () => {
    console.log(`Express server is running on port ${port}`);
});

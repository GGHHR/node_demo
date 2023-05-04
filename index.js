let path=require('path');

let a=path.resolve(__dirname, "electron/aa/bb/a.js");


console.log(path.isAbsolute(a));
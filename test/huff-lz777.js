let filter = require('../src/nodePDF').filters;
let a = filter.DEFLATE.Huffman("");
let fs = require('fs');
fs.writeFileSync("/Users/zhenkaixiong/temp/a.json", JSON.stringify(a));
console.log(a);
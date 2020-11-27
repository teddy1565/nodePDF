let filter = require('../src/nodePDF').filters;
//let a = filter.DEFLATE.Huffman("my name is teddy");
let t = (() => {
    let bigO = [];
    for (let i = 0; i < 1000; i++) {
        let str = "";
        let dic = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
        for (let i = 0; i < 1000000; i++) {
            str += dic[parseInt((Math.random() * 100) % 16)];
        }
        console.log(i);
        str = Buffer.from(str, 'hex').toString('ascii');
        bigO.push(filter.DEFLATE.Huffman(str));
    }
    return bigO
})();
let k = 0;
for (let i in t) {
    k += t[i];
}
k /= 1000;
console.log(k);
let fs = require('fs');

//fs.writeFileSync("/Users/zhenkaixiong/temp/a.json", JSON.stringify(a));
//console.log(a);
//3.6990047950744627s
let NP = require('../src/nodePDF');
let PDFpath = "/Users/zhenkaixiong/temp/a.pdf";
let fs = require('fs');
let data = fs.readFileSync(PDFpath);
data = NP.splitPDF(data);

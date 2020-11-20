const fs = require('fs');
const path = require('path');

let PDFpath=[];
function loadPDF(path){
  PDFpath.push(path);
}

function splitPDF(data){
  let reg = new RegExp("3e3e\+\|3c3c\+");
  let dataStr = data.toString('hex').split(reg);
  console.log(dataStr.length);
}
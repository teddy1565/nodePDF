const fs = require('fs');
const path = require('path');
const md5js = require('md5');
const PDFParser = require('pdf2json');
let PDFpath = [];

/**
 * Record PDF file path
 * @param {string} path -- File Path
 */
function loadPDFpath(path) {
  PDFpath.push(path);
}
/**
 * PDF Stream hex string converse to {ascii | unicode} string
 * @param {string} HexStr --Hex string
 * @param {string} encode --Trans encode
 * @returns {string} -- return Encode string
 */
function HexToStr(HexStr, encode) {
  if (encode) return Buffer.from(HexStr, 'hex').toString(encode);
  else return Buffer.from(HexStr, 'hex').toString('ascii');
}


/**
 * {ascii | unicode} string converse to HEX string
 * @param {string} Str -- Souce String
 * @param {string} encode -- Source String Encode
 * @returns {string} -- HEX String
 */
function StrToHex(Str, encode) {
  return Buffer.from(Str, encode).toString('hex');
}


/**
 * It will read PDF Buffer and converse to Hex string.
 * And also it was split 0a('\n')
 * ---------------------------------
 * @param {Buffer} data -- Data Buffer
 * @param {bool} platfrom -- win32:true ,unix:false
 * @returns {Array} -- ASCII string array
 */
function splitPDF(data, platfrom) {
  let REGE = "0a";
  if (platfrom) REGE = "0d0a";
  let response = [];
  data = data.toString('hex');
  let temp = "";
  for (let i in data) {
    if (i != 0 && i % 2 == 0) temp += " ";
    temp += data[i];
  }
  temp = temp.split(REGE);
  data = [];
  for (let i in temp) {
    data[i] = "";
    for (let j in temp[i]) {
      if (temp[i][j] == ' ') continue;
      data[i] += temp[i][j];
    }
  }
  let stream_check = false;
  for (let i in data) {
    if (data[i - 1] == "stream" || data[i - 1] == "73747265616d") stream_check = true;
    if (data[i] == "endstream" || data[i] == "656e6473747265616d") stream_check = false;
    if (!stream_check) {
      response[i] = {
        data: Buffer.from(data[i], 'hex').toString('ascii'),
        type: "text",
        sqrt: i
      };
    } else {
      response[i] = {
        data: data[i],
        type: "stream",
        sqrt: i
      }
    }
  }
  return response;
}

let PrivateTools = {

  MD5: {
    /**
     * Use md5.js
     * @param {string|Buffer} --message
     * @return
     */
    md5js: (message) => {
      return md5js(message);
    },
  },
  /**
   * Achieve DEFLATE algorithm
   */
  DEFLATE: {
    Huffman: (message) => { },
    LZ777: () => { }
  }
};
let nodePDF = {
  loadPDFpath: loadPDFpath,
  splitPDF: splitPDF,
  HexToStr: HexToStr,
  StrToHex: StrToHex
};
module.exports = nodePDF;
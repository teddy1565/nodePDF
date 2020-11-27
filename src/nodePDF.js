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
  if (platfrom) REGE = "0d 0a";
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

};
let filters = {
  /**
   * Achieve DEFLATE algorithm
   */
  DEFLATE: {
    /**
     * @param {string} message --encode string
     * @returns {Object}
     */
    Huffman: (message) => {
      let strheep = [];
      for (let i in message) {
        let find = false;
        for (let j in strheep) {
          if (message[i] == strheep[j].text) {
            find = true;
            strheep[j].freq++;
          }
        }
        if (find == false) {
          strheep.push({
            text: `${message[i]}`,
            freq: 1
          });
        }
      }
      strheep = ((sheep) => {
        let performance = require('perf_hooks').performance;
        let a = performance.now();
        let sheepsqrt = (sheep) => {
          let LS = []; LS.push(sheep[0]);
          let MS = []; MS.push(sheep[sheep.length - 1]);
          let res = [], max;
          for (let i in sheep) {
            if (sheep[i].freq >= LS[0].freq && sheep[i].text != LS[0].text) LS.push(sheep[i]);
            if (sheep[i].freq <= MS[0].freq && sheep[i].text != MS[0].text) MS.push(sheep[i]);
          }
          if ((!~(LS[0].freq ^ ~MS[0].freq)) || (LS[0].freq > MS[0].freq)) {
            max = LS[0];
            for (let i in LS) {
              if (LS[i].freq >= max.freq) {
                max = LS[i];
              }
            }
          } else if (LS[0].freq < MS[0].freq) {
            max = MS[0];
            for (let i in sheep) {
              if (sheep[i].freq < MS[0].freq) continue;
              if (sheep[i].freq >= max.freq) {
                max = sheep[i];
              }
            }
          }
          for (let i in sheep) {
            if (sheep[i].text != max.text) {
              res.push(sheep[i]);
            }
          }
          return { res, max };
        }
        let result = [];
        while (sheep.length > 0) {
          let res = sheepsqrt(sheep);
          sheep = res.res;
          result.push(res.max);
        }
        let b = performance.now();
        console.log(`Time:${b - a}`);
        //return result;
        return (b - a);
      })(strheep);
      return strheep;
    },
    LZ777: () => { }
  }
}
let nodePDF = {
  loadPDFpath: loadPDFpath,
  splitPDF: splitPDF,
  HexToStr: HexToStr,
  StrToHex: StrToHex,
  filters: filters
};
module.exports = nodePDF;
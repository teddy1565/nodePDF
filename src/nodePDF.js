const fs = require('fs');
const path = require('path');

let PDFpath=[];

/**
 * Record PDF file path
 * @param {string} path -- File Path
 */
function loadPDFpath(path){
    PDFpath.push(path);
}
/**
 * PDF Stream hex string converse to {ascii | unicode} string
 * @param {string} HexStr --Hex string
 * @param {string} encode --Trans encode
 * @returns {string} -- return Encode string
 */
function HexToStr(HexStr,encode){
    if(encode) return Buffer.from(HexStr,'hex').toString(encode);
    else return Buffer.from(HexStr,'hex').toString('ascii');
}


/**
 * {ascii | unicode} string converse to HEX string
 * @param {string} Str -- Souce String
 * @param {string} encode -- Source String Encode
 * @returns {string} -- HEX String
 */
function StrToHex(Str,encode){
    return Buffer.from(Str,encode).toString('hex');
}


/**
 * It will read PDF Buffer and converse to Hex string.  
 * 
 * Then use Regex to Split Buffer and return String array.  
 * 
 * If you want split keyword "stream" and "endstream".  
 * 
 * ---------------------------------
 * You need keyin like this:  
 * > "/73747265616d+|656e6473747265616d+/".  
 * 
 * It's that meam:
 * >/stream+|endstream+/   
 * ---------------------------------
 * 
 * It will build a new RegExp to Split this Hex string and return a HEX string array.   
 * 
 * ---------------------------------
 * @param {Buffer} data -- Data Buffer
 * @param {RegExp} reg -- Split Regex
 * @returns {Array} -- Hex String Array
 */
function splitPDF(data,reg){
    let REGE = /73747265616d+|656e6473747265616d+/;
    if(reg){
        REGE = new RegExp(reg);
    }
    return data.toString('hex').split(REGE);
}

let nodePDF={
    loadPDFpath:loadPDFpath,
    loadPDF:loadPDF,
    splitPDF:splitPDF,
    HexToStr:HexToStr,
    StrToHex:StrToHex
};
module.exports = nodePDF;
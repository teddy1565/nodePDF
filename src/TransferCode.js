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

const Transfer = {
    HexToStr:HexToStr,
    StrToHex:StrToHex
};

exports.modules = Transfer;
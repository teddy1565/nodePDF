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
const split={
    splitPDF:splitPDF
};
exports.modules = split;
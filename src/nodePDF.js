const fs = require('fs');
const path = require('path');
const md5js = require('md5');
const PDFParser = require('pdf2json');

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

let PrivateTools = {
    /**
     * MD5 HASH string
     * @param {string} str -- input
     * @returns {string} Return a HASH string
     */
    learn_MD5v1:(str)=>{
        //Make string length be (N+1)*512bit
        let OriginStrLeng = `${str.length}`;
        for(let i=OriginStrLeng.length;i<64;i++){
            OriginStrLeng = '0'+OriginStrLeng;
        }
        if((str.length%512)!=448)str+='1';
        while((str.length%512)!=448)str+='0';
        str+=OriginStrLeng;
        //Grouping
        //BigGroup will grouping every 512 bit with string
        let BigGroup = [];
        for(let i=0;i<(str.length/512);i++){
            BigGroup[i]="";
        }
        for(let i=0;i<=(str.length/512);i++){
            while(str.length!=0){
                BigGroup[i]+=str[0];
                str = str.slice(1);
                if(str.length%512==0)break;
            }
        }
        //SmallGroup will grouping 16 groups with 512bit string,every SmallGroup will be 32bit
        let SmallGroup = [];
        //Initial array
        for(let i=0;i<(BigGroup.length)*16;i++){
            SmallGroup[i]="";
        }
        //Grouping
        for(let i=0;i<(BigGroup.length)*16;i++){
            for(let j=0;j<32;j++){
              SmallGroup[i] += BigGroup[parseInt(i/16)].slice(0,1);
              BigGroup[parseInt(i/16)] = BigGroup[parseInt(i/16)].slice(1);
            }
        }
        //Setup shift amounts and initial variable
        const {R1,R2,R3,R4}={R1:[7,12,17,22],R2:[5,9,14,20],R3:[4,11,16,23],R4:[6,10,15,21]};
        const {A,B,C,D}={A:"67452301",B:"efcdab89",C:"98badcfe",D:"10325476"};
        //Initial algorithm
        const csdn_algorithm = {
            F:(x,y,z)=>{
                return (x&y)|((~x)&z);
            },
            G:(x,y,z)=>{
                return (x&z)|(y&(~z));
            },
            H:(x,y,z)=>{
                return x^y^z;
            },
            I:(x,y,z)=>{
                return y^(x|(~z));
            },
            FF:(a,b,c,d,x,s,ac)=>{
                a += (F(b, c, d)&0xFFFFFFFF) + x + ac;
                a = ((a&0xFFFFFFFF)<< s) | ((a&0xFFFFFFFF) >>> (32 - s));
                a += b;
                return (a&0xFFFFFFFF);
            },
            GG:(a,b,c,d,x,s,ac)=>{
                a += (G(b, c, d)&0xFFFFFFFF) + x + ac;
                a = ((a&0xFFFFFFFF) << s) | ((a&0xFFFFFFFF) >>> (32 - s));
                a += b;
                return (a&0xFFFFFFFF);
            },
            HH:(a,b,c,d,x,s,ac)=>{
                a += (H(b, c, d)&0xFFFFFFFF) + x + ac;
                a = ((a&0xFFFFFFFF) << s) | ((a&0xFFFFFFFF) >>> (32 - s));
                a += b;
                return (a&0xFFFFFFFF);
            },
            II:(a,b,c,d,x,s,ac)=>{
                a += (I(b, c, d)&0xFFFFFFFF) + x + ac;
                a = ((a&0xFFFFFFFF) << s) | ((a&0xFFFFFFFF) >>> (32 - s));
                a += b;
                return (a&0xFFFFFFFF);
            }
        };
        const wiki_algorithm = {
            F:(x,y,z)=>{
                return (x&y)|((~x)&z);
            },
            G:(x,y,z)=>{
                return (x&z)|(y&(~z));
            },
            H:(x,y,z)=>{
                return x^y^z;
            },
            I:(x,y,z)=>{
                return y^(x|(~z));
            }
        };
        let formateStr = (SmallGroup)=>{
            let res=[];
            for(let i in SmallGroup){
                res[i] = Buffer.from(SmallGroup[i],'utf8');
            }
            return res;
        };
        let response = (formateStr,R,Magic_Number,Algorithm)=>{
            let Str = [];
            let res={a,b,c,d};
            for(let i in formateStr){
                Str[parseInt(i/16)][i] = formateStr[i];
            }
            Algorithm.F(formateStr)
        };
        response = response(formateStr(SmallGroup),[R1,R2,R3,R4],[A,B,C,D],wiki_algorithm);
        console.log(response);
        //main
        return str;
    },
    learn_MD5v2:(message)=>{
        let crypt = require('crypt');
        let utf8 = require('charenc').utf8;
        let isBuffer = require('is-buffer');
        let bin = require('charenc').bin;
        
        let md5 = function(message,options){
            if(message.constructor == String){
                if(options && options.encoding === 'binary'){
                    message = bin.stringToBytes(message);
                }else{
                    message = utf8.stringToBytes(message);
                }
            }else if(isBuffer(message)){
                message = Array.prototype.slice.call(message,0);
            }else if(isBuffer(message)){
                message = message.toString();
            }
            let m = crypt.bytesToWords(message),
                l = message.length * 8,
                a = 1732584193,
                b = -271733879,
                c = -1732584194,
                d = 271733878;
            for(let i in m){
                m[i] = ((m[i]<<8)|(m[i]>>>24))&0x00FF00FF|((m[i]<<24)|(m[i]>>>8))&0xFF00FF00;
            }
            m[l>>>5]|= 0x80 <<(l%32);
            m[(((l+64)>>>9)<<4)+14] = l;
            let FF = (a,b,c,d,x,s,t)=>{
                let n = a + (b&c|~b&d)+(x>>>0)+t;
                return ((n<<s)|(n>>>(32-s)))+b;
            };
            let GG = (a,b,c,d,x,s,t)=>{
                let n = a+(b&d|c&~d)+(x>>>0)+t;
                return ((n<<s)|(n>>>(32-s)))+b;
            };
            let HH = (a,b,c,d,x,s,t)=>{
                let n = a + (b^c^d)+(x>>>0)+t;
                return ((n<<s)|(n>>>(32-s)))+b;
            };
            let II = (a,b,c,d,x,s,t)=>{
                let n = a + (c^(b|~d))+(x>>>0)+t;
                return ((n<<s)|(n>>>(32-s)))+b;
            };
            for(let i=0;i<m.length;l+=16){
                let aa = a,bb = b,cc = c,dd = d;
                a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
                d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
                c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
                b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
                a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
                d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
                c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
                b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
                a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
                d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
                c = FF(c, d, a, b, m[i+10], 17, -42063);
                b = FF(b, c, d, a, m[i+11], 22, -1990404162);
                a = FF(a, b, c, d, m[i+12],  7,  1804603682);
                d = FF(d, a, b, c, m[i+13], 12, -40341101);
                c = FF(c, d, a, b, m[i+14], 17, -1502002290);
                b = FF(b, c, d, a, m[i+15], 22,  1236535329);
          
                a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
                d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
                c = GG(c, d, a, b, m[i+11], 14,  643717713);
                b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
                a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
                d = GG(d, a, b, c, m[i+10],  9,  38016083);
                c = GG(c, d, a, b, m[i+15], 14, -660478335);
                b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
                a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
                d = GG(d, a, b, c, m[i+14],  9, -1019803690);
                c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
                b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
                a = GG(a, b, c, d, m[i+13],  5, -1444681467);
                d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
                c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
                b = GG(b, c, d, a, m[i+12], 20, -1926607734);
          
                a = HH(a, b, c, d, m[i+ 5],  4, -378558);
                d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
                c = HH(c, d, a, b, m[i+11], 16,  1839030562);
                b = HH(b, c, d, a, m[i+14], 23, -35309556);
                a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
                d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
                c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
                b = HH(b, c, d, a, m[i+10], 23, -1094730640);
                a = HH(a, b, c, d, m[i+13],  4,  681279174);
                d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
                c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
                b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
                a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
                d = HH(d, a, b, c, m[i+12], 11, -421815835);
                c = HH(c, d, a, b, m[i+15], 16,  530742520);
                b = HH(b, c, d, a, m[i+ 2], 23, -995338651);
          
                a = II(a, b, c, d, m[i+ 0],  6, -198630844);
                d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
                c = II(c, d, a, b, m[i+14], 15, -1416354905);
                b = II(b, c, d, a, m[i+ 5], 21, -57434055);
                a = II(a, b, c, d, m[i+12],  6,  1700485571);
                d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
                c = II(c, d, a, b, m[i+10], 15, -1051523);
                b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
                a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
                d = II(d, a, b, c, m[i+15], 10, -30611744);
                c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
                b = II(b, c, d, a, m[i+13], 21,  1309151649);
                a = II(a, b, c, d, m[i+ 4],  6, -145523070);
                d = II(d, a, b, c, m[i+11], 10, -1120210379);
                c = II(c, d, a, b, m[i+ 2], 15,  718787259);
                b = II(b, c, d, a, m[i+ 9], 21, -343485551);

                a = (a+aa)>>>0;
                b = (b+bb)>>>0;
                c = (c+cc)>>>0;
                d = (d+dd)>>>0;
            }
            return crypt.endian([a,b,c,d]);
        };
        return md5(message);
    },
    /**
     * Use md5.js
     * @param {string|Buffer} --message
     * @return 
     */
    MD5:(message)=>{
        return md5js(message);
    }
};
PrivateTools.learn_MD5v2("hi");
let nodePDF={
    loadPDFpath:loadPDFpath,
    splitPDF:splitPDF,
    HexToStr:HexToStr,
    StrToHex:StrToHex
};
module.exports = nodePDF;
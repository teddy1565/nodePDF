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

let PrivateTools = {
    /**
     * MD5 HASH string
     * @param {string} str -- input
     * @returns {string} Return a HASH string
     */
    MD5:(str)=>{
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
        const {F,G,H,I,FF,GG,HH,II}={
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
            },
        };
        return str;
    },
};
PrivateTools.MD5("A");
let nodePDF={
    loadPDFpath:loadPDFpath,
    splitPDF:splitPDF,
    HexToStr:HexToStr,
    StrToHex:StrToHex
};
module.exports = nodePDF;
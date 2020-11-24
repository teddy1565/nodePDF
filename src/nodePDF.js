const fs = require('fs');
const path = require('path');
const md5js = require('md5');

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
        (()=>{
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
                }
            }
        })();
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

let nodePDF={
    loadPDFpath:loadPDFpath,
    splitPDF:splitPDF,
    HexToStr:HexToStr,
    StrToHex:StrToHex
};
module.exports = nodePDF;
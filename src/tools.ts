
export interface PDF_DEFLATE_Huffman_Item {
    text: string;
    freq: number;
}

export class DEFLATE {
    static Huffman(message: string) {
        const strheep: Array<PDF_DEFLATE_Huffman_Item> = [];
        for (let i = 0; i < message.length; i++) {
            let find = false;
            for (let j = 0; j < strheep.length; j++) {
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

        return strheep;
    }
    static LZ777() {}
}

export class Filters {
    static DEFLATE = DEFLATE;
}

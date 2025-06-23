export type Data_Item_Type = "text" | "stream";

export interface PDF_Split_Data_Item {
    data: string,
    type: Data_Item_Type,
    sqrt: number
}


/**
 * It will read PDF Buffer and converse to Hex string.
 * And also it was split 0a('\n')
 * ---------------------------------
 * @param data -- Data Buffer
 * @param platfrom
 * @returns ASCII string array
 */
export function split_PDF_buffer(data: Buffer, platfrom: NodeJS.Platform): Array<PDF_Split_Data_Item> {
    let REGE = platfrom === "win32" ? "0d 0a" : "0a";
    const hex_data = data.toString("hex");

    let temp = "";

    for (let i = 0; i < hex_data.length; i++) {
        if (i !== 0 && i % 2 === 0) {
            temp += " ";
        }
        temp += hex_data[i];
    }
    const split_pdf_source_buffer = temp.split(REGE);

    const split_data: Array<string> = [];
    for (let i = 0; i < split_pdf_source_buffer.length; i++) {
        split_data[i] = "";
        for (let j = 0; j < split_pdf_source_buffer[i].length; j++) {
            if (split_pdf_source_buffer[i][j] === ' ') {
                continue;
            }
            split_data[i] += split_pdf_source_buffer[i][j];
        }
    }

    const response: Array<PDF_Split_Data_Item> = [];
    let stream_check = false;
    for (let i = 0; i < split_data.length; i++) {
        if (split_data[i] === "endstream" || split_data[i] === "656e6473747265616d") {
            stream_check = false;
        }

        if (i > 0 && (split_data[i - 1] === "stream" || split_data[i - 1] === "73747265616d")) {
            stream_check = true
        }

        if (stream_check === false) {
            response[i] = {
                data: Buffer.from(split_data[i], "hex").toString("ascii"),
                type: "text",
                sqrt: i
            };
        } else {
            response[i] = {
                data: split_data[i],
                type: "stream",
                sqrt: i
            };
        }
    }

  return response;
}

export class PDFParser {
    static split_pdf_buffer = split_PDF_buffer;
}

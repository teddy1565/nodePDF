/**
 * PDF Stream hex string converse to {ascii | unicode} string
 * @param HexStr --Hex string
 * @param encode --Trans encode
 * @returns { string } -- return Encode string
 */
export function hex_to_str(hex_str: string, encode?: BufferEncoding): string {
    if (encode) {
        return Buffer.from(hex_str, "hex").toString(encode);
    }

    return Buffer.from(hex_str, "hex").toString("ascii");
}

/**
 * {ascii | unicode} string converse to HEX string
 * @param Str -- Souce String
 * @param encode -- Source String Encode
 * @returns { string } -- HEX String
 */
export function str_to_hex(str: string, encode: BufferEncoding): string {
    return Buffer.from(str, encode).toString("hex");
}

export class ConvertMethods {
    static hex_to_str = hex_to_str;
    static str_to_hex = str_to_hex;
}

import CryptoJS from "crypto-js";
import { Buffer } from "buffer";

export const SHA512 = (value: string) => {
    const base64Decoded = Buffer.from(value).toString("base64");
    return CryptoJS.SHA512(base64Decoded).toString(CryptoJS.enc.Hex);
};

/**
 * 处理字符串，并返回去除两侧空白字符的新字符串
 * @param str 被处理的字符串
 */
export function trim(str: string): string {
    return str.replace(/^\s+|\s+$/g, "");
}

/**
 * 处理字符串，转义html字符串中的<和>符号
 * @param str 被处理的字符串
 */
export function encode(str: string): string {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;")
}
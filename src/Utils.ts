/**
 * 处理字符串，并返回去除两侧空白字符的新字符串
 * @param str 被处理的字符串
 */
export function trim(str: string): string {
    return str.replace(/^\s+|\s+$/g, "");
}
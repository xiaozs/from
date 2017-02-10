import { Iterator, IterationResult } from "Interface";

/**
 * 处理字符串，并返回去除两侧空白字符的新字符串
 * @param str 被处理的字符串
 */
export function trim(str: string): string {
    return str.replace(/^\s+|\s+$/g, "");
}

/**
 * 数组枚举器
 */
export class ArrayIterator<T> implements Iterator<T>{
    /**
     * 被枚举的数组的副本
     */
    private array_: T[];
    /**
     * 当前被枚举到的索引
     */
    private index_ = 0;
    /**
     * @param array 需要生产枚举器的数组
     */
    constructor(array: T[]) {
        this.array_ = array.slice();
    }
    /**
     * 获得一个枚举结果
     */
    next(): IterationResult<T> {
        let result: IterationResult<T>;
        if (this.index_ < this.array_.length) {
            result = {
                value: this.array_[this.index_],
                done: false
            }
            this.index_++;
        } else {
            result = { done: true };
        }
        return result;
    }
}
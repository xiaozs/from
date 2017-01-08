import { Iterator, IterationResult } from './Interface';

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
    private list_: T[];
    private index_ = 0;
    constructor(list: T[]) {
        this.list_ = list.slice();
    }
    next(): IterationResult<T> {
        let result: IterationResult<T>;
        if (this.index_ < this.list_.length) {
            result = {
                value: this.list_[this.index_],
                done: false
            }
            this.index_++;
        } else {
            result = { done: true };
        }
        return result;
    }
}
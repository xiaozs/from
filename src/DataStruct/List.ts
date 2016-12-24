import * as Type from "Type";
import * as Error from "Error";
import { Iterable, Iterator, IterationResult } from "Interface";

/**
 * 数组加强类
 */
export default class List<T> implements Iterable<T>{
    /**
     * 用于存储着代理的数组
     */
    private innerArray_: T[];

    /**
     * @param array 被代理的数组
     */
    constructor(array?: T[]);
    /**
     * @param items 将合并为数组并且被代理的项目
     */
    constructor(...items: T[]);
    constructor(array: T[]) {
        if (Type.isArray(array) && arguments.length === 1) {
            this.innerArray_ = array;
        } else {
            let array = [].slice.call(arguments);
            this.innerArray_ = array;
        }
    }

    /**
     * 获取数组长度
     */
    length(): number;
    /**
     * 设置数组的长度
     * @param length 数组长度
     */
    length(length: number): this;
    length(length?: number): this | number {
        if (Type.isNumber(length)) {
            this.innerArray_.length = length;
            return this;
        } else {
            return this.innerArray_.length;
        }
    }

    /**
     * 获得数组索引下的元素，支持负数由元素最后开始获取
     * @param index 索引
     * @throws OutOfIndexError 真实索引值小于0时抛出
     */
    get(index: number): T {
        index = this.getTrueIndex_(index);
        return this.innerArray_[index];
    }

    /**
     * 设置数组索引下的元素，支持负数由元素最后开始设置
     * @param index 索引
     * @throws OutOfIndexError 真实索引值小于0时抛出
     */
    set(index: number, value: T): this {
        index = this.getTrueIndex_(index);
        this.innerArray_[index] = value;
        return this;
    }

    /**
     * 将可为负数的索引值转化真实的索引值
     * @param index 索引
     * @throws OutOfIndexError
     */
    private getTrueIndex_(index: number): number {
        let trueIndex: number = index;
        let length = this.innerArray_.length;
        if (index < 0) {
            trueIndex = length + index;
        }
        if (trueIndex < 0) {
            throw new Error.OutOfIndexError();
        }
        return trueIndex;
    }

    /**
     * 判定是否每个元素都满足条件
     * @param callbackFn 回调函数，用于判定是否某个元素都满足条件
     * @param thisArg 上下文参数，用于设置回调函数的this指针
     */
    every<A>(callbackFn: (this: A, value: T, index: number, list: List<T>) => boolean, thisArg?: A): boolean {
        let maxLenght = this.innerArray_.length;
        for (let i = 0; i < this.innerArray_.length && i < maxLenght; i++) {
            let result = callbackFn.call(thisArg, this.innerArray_[i], i, this);
            if (!result) {
                return false;
            }
        }
        return true;
    }

    /**
     * 判定是否某个元素都满足条件
     * @param callbackFn 回调函数，用于判定是否某个元素都满足条件
     * @param thisArg 上下文参数，用于设置回调函数的this指针
     */
    some<A>(callbackFn: (this: A, value: T, index: number, list: List<T>) => boolean, thisArg?: A): boolean {
        let maxLenght = this.innerArray_.length;
        for (let i = 0; i < this.innerArray_.length && i < maxLenght; i++) {
            let result = callbackFn.call(thisArg, this.innerArray_[i], i, this);
            if (result) {
                return true;
            }
        }
        return false;
    }

    /**
     * 迭代数组中的每个元素
     * @param callbackFn 回调函数，用于操作每一个元素，返回值为true时退出整个循环
     * @param thisArg 上下文参数，用于设置回调函数的this指针
     */
    forEach<A>(callbackFn: (this: A, value: T, index: number, list: List<T>) => boolean | void, thisArg?: A): this {
        let maxLenght = this.innerArray_.length;
        for (let i = 0; i < this.innerArray_.length && i < maxLenght; i++) {
            let result = callbackFn.call(thisArg, this.innerArray_[i], i, this);
            if (result) {
                break;
            }
        }
        return this;
    }

    /**
     * 迭代数组中的每个元素，并返回一个新的数组
     * @param callbackFn 回调函数，用于操作每一个元素，返回值为新数组的元素
     * @param thisArg 上下文参数，用于设置回调函数的this指针
     */
    map<U, A>(callbackFn: (this: A, value: T, index: number, list: List<T>) => U, thisArg?: A): List<U> {
        let maxLenght = this.innerArray_.length;
        let array: U[] = [];
        for (let i = 0; i < this.innerArray_.length && i < maxLenght; i++) {
            let result = callbackFn.call(thisArg, this.innerArray_[i], i, this);
            array.push(result);
        }
        return new List(array);
    }

    /**
     * 过滤数组中的元素，并返回一个新的数组
     * @param callbackFn 回调函数，返回值为true时，保留该元素
     * @param thisArg 上下文参数，用于设置回调函数的this指针
     */
    filter<A>(callbackFn: (this: A, value: T, index: number, list: List<T>) => boolean, thisArg?: A): List<T> {
        let maxLenght = this.innerArray_.length;
        let array: T[] = [];
        for (let i = 0; i < this.innerArray_.length && i < maxLenght; i++) {
            let result = callbackFn.call(thisArg, this.innerArray_[i], i, this);
            if (result) {
                array.push(this.innerArray_[i]);
            }
        }
        return new List(array);
    }

    /**
     * 从左侧开始归并数组中的元素，并返回归并结果
     * @param callbackFn 回调函数，处理每一个元素，并返回当前归并结果
     * @param initialValue 归并结果的初始化值
     * @throws EmptyArrayError 不存在初始化值且数组元素个数为0时抛出
     */
    reduce(callbackFn: (this: void, previousValue: T, currentValue: T, currentIndex: number, list: List<T>) => T, initialValue?: T): T;
    /**
     * 从左侧开始归并数组中的元素，并返回归并结果
     * @param callbackFn 回调函数，处理每一个元素，并返回当前归并结果
     * @param initialValue 归并结果的初始化值
     * @throws EmptyArrayError 不存在初始化值且数组元素个数为0时抛出
     */
    reduce<U>(callbackFn: (this: void, previousValue: U, currentValue: T, currentIndex: number, list: List<T>) => U, initialValue: U): U;
    reduce<U>(callbackFn: (this: void, previousValue: U | T, currentValue: T, currentIndex: number, list: List<T>) => U | T, initialValue?: U | T): U | T {
        let array = this.innerArray_;
        let maxLenght = array.length;
        let result: T | U;
        let i = 0;
        if (Type.isNotVoid(initialValue)) {
            result = initialValue;
        } else if (array.length >= 1) {
            result = array[i];
            i++;
        } else {
            throw new Error.EmptyArrayError();
        }

        for (; i < array.length && i < maxLenght; i++) {
            result = callbackFn(result, array[i], i, this);
        }
        return result;
    }

    /**
     * 从右侧开始归并数组中的元素，并返回归并结果
     * @param callbackFn 回调函数，处理每一个元素，并返回当前归并结果
     * @param initialValue 归并结果的初始化值
     * @throws EmptyArrayError 不存在初始化值且数组元素个数为0时抛出
     */
    reduceRight(callbackFn: (this: void, previousValue: T, currentValue: T, currentIndex: number, list: List<T>) => T, initialValue?: T): T;
    /**
     * 从右侧开始归并数组中的元素，并返回归并结果
     * @param callbackFn 回调函数，处理每一个元素，并返回当前归并结果
     * @param initialValue 归并结果的初始化值
     * @throws EmptyArrayError 不存在初始化值且数组元素个数为0时抛出
     */
    reduceRight<U>(callbackFn: (this: void, previousValue: U, currentValue: T, currentIndex: number, list: List<T>) => U, initialValue: U): U;
    reduceRight<U>(callbackFn: (this: void, previousValue: U | T, currentValue: T, currentIndex: number, list: List<T>) => U | T, initialValue?: U | T): U | T {
        let array = this.innerArray_;
        let result: T | U;
        let i = array.length - 1;
        if (Type.isNotVoid(initialValue)) {
            result = initialValue;
        } else if (array.length >= 1) {
            result = array[i];
            i--;
        } else {
            throw new Error.EmptyArrayError();
        }

        for (; i >= 0 && i < array.length; i--) {
            result = callbackFn(result, array[i], i, this);
        }
        return result;
    }

    /**
     * 从数组右侧插入元素
     * @param items 添加进数组的元素
     */
    push(...items: T[]): this {
        this.innerArray_.push(...items);
        return this;
    }

    /**
     * 从数组右侧弹出元素
     */
    pop(): T | undefined {
        return this.innerArray_.pop();
    }

    /**
     * 从数组左侧插入元素
     * @param items 添加进数组的元素
     */
    unshift(...items: T[]): this {
        this.innerArray_.unshift(...items);
        return this;
    }

    /**
     * 从数组左侧弹出元素
     */
    shift(): T | undefined {
        return this.innerArray_.shift();
    }

    /**
     * 连接当前数组及参数数组，并返回新的数组
     * @param items 数组或元素
     */
    concat(...items: (T | T[] | List<T>)[]): List<T> {
        let array: T[] = this.innerArray_.slice();
        for (let item of items) {
            if (Type.isArray(item)) {
                for (let t of item) {
                    array.push(t);
                }
            } else if (item instanceof List) {
                item.forEach((item) => {
                    array.push(item);
                });
            } else {
                array.push(item);
            }
        }
        return new List(array);
    }

    /**
     * 返回以分隔符分隔各个元素所形成的字符串
     * @param separator 分隔符，默认为","
     */
    join(separator?: string): string {
        return this.innerArray_.join(separator);
    }

    /**
     * 反转当前数组中的元素
     */
    reverse(): this {
        this.innerArray_.reverse();
        return this;
    }

    /**
     * 切分当前数组，并返回新数组
     * @param start 切分开始的索引
     * @param start 切分结束的索引
     */
    slice(start?: number, end?: number): List<T> {
        let newArray: T[] = [].slice.apply(this.innerArray_, arguments);
        return new List(newArray);
    }

    /**
     * 对当前数组中的元素进行排序
     * @param compareFn 回调函数，用于对比两个元素的大小
     */
    sort(compareFn?: (a: T, b: T) => number): this {
        [].sort.apply(this.innerArray_, arguments);
        return this;
    }

    /**
     * 从左侧开始查找特定元素的索引，当不存在该元素时返回-1
     * @param searchElement 需要查找的元素
     * @param fromIndex 从特定的索引值开始查找，默认为0
     */
    indexOf(searchElement: T, fromIndex?: number): number {
        for (let i = fromIndex || 0; i < this.innerArray_.length; i++) {
            if (this.innerArray_[i] === searchElement) {
                return i;
            }
        }
        return -1;
    }

    /**
     * 从右侧开始查找特定元素的索引，当不存在该元素时返回-1
     * @param searchElement 需要查找的元素
     * @param fromIndex 从特定的索引值开始查找，默认为0
     */
    lastIndexOf(searchElement: T, fromIndex?: number): number {
        let startIndex = this.innerArray_.length - 1;
        for (let i = fromIndex || startIndex; i >= 0; i--) {
            if (this.innerArray_[i] === searchElement) {
                return i;
            }
        }
        return -1;
    }

    /**
     * 往当前数组中删除、插元素
     * @param start 从此索引处开始删除
     */
    splice(start: number): this;
    /**
     * 往当前数组中删除、插入元素
     * @param start 从此索引处开始删除
     * @param deleteCount 删除元素的个数
     * @param items 需要插入的元素
     */
    splice(start: number, deleteCount: number, ...items: T[]): this;
    splice(start: number, deleteCount?: number): this {
        if (arguments.length == 1) {
            this.innerArray_.splice(start, this.innerArray_.length);
        } else {
            [].splice.apply(this.innerArray_, arguments);
        }
        return this;
    }

    /**
     * 返回一个新的原生数组，其元素与当前数组相同
     */
    toArray(): T[] {
        return this.innerArray_.slice();
    }

    /**
     * 生成枚举器
     */
    getIterator(): Iterator<T> {
        return new ListIterator(this);
    }
}

class ListIterator<T> implements Iterator<T>{
    private index_ = 0;
    constructor(private list: List<T>) { }
    async next(): Promise<IterationResult<T>> {
        let result: IterationResult<T>;
        if (this.index_ < this.list.length()) {
            result = {
                value: this.list.get(this.index_),
                done: false
            }
        } else {
            result = { done: true };
        }
        this.index_++;
        return result;
    }
}
import * as Type from "Type";

/**
 * 数组加强类
 */
export default class List<T>{
    private innerArray_: T[];
    constructor(array?: T[]);
    constructor(...items: T[]);
    constructor(array: T[]) {
        if (Type.isArray(array)) {
            this.innerArray_ = array;
        } else if (arguments.length > 0) {
            let array: T[] = [];
            for (let i = 0; i < arguments.length; i++) {
                array.push(arguments[i]);
            }
            this.innerArray_ = array;
        } else {
            this.innerArray_ = [];
        }
    }
    length(count: number): this;
    length(): number;
    length(length?: number): this | number {
        if (Type.isNumber(length)) {
            this.innerArray_.length = length;
            return this;
        } else {
            return this.innerArray_.length;
        }
    }
    get(index: number): T {
        return this.innerArray_[index];
    }
    set(index: number, value: T): this {
        this.innerArray_[index] = value;
        return this;
    }
    getItem(index: number): T {
        index = this.getTrueIndex_(index);
        return this.innerArray_[index];
    }
    setItem(index: number, value: T): this {
        index = this.getTrueIndex_(index);
        this.innerArray_[index] = value;
        return this;
    }
    private getTrueIndex_(index: number): number {
        let trueIndex: number = index;
        let length = this.innerArray_.length;
        if (index < 0) {
            trueIndex = length + index;
        }
        if (trueIndex < 0) {
            throw new Error();
        }
        return trueIndex;
    }
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
    map<U, A>(callbackFn: (this: A, value: T, index: number, list: List<T>) => U, thisArg?: A): List<U> {
        let maxLenght = this.innerArray_.length;
        let array: U[] = [];
        for (let i = 0; i < this.innerArray_.length && i < maxLenght; i++) {
            let result = callbackFn.call(thisArg, this.innerArray_[i], i, this);
            array.push(result);
        }
        return new List(array);
    }
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
    reduce(callbackFn: (this: void, previousValue: T, currentValue: T, currentIndex: number, list: List<T>) => T, initialValue?: T): T;
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
            throw new Error();
        }

        for (; i < array.length && i < maxLenght; i++) {
            result = callbackFn(result, array[i], i, this);
        }
        return result;
    }
    reduceRight(callbackFn: (this: void, previousValue: T, currentValue: T, currentIndex: number, list: List<T>) => T, initialValue?: T): T;
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
            throw new Error();
        }

        for (; i >= 0 && i < array.length; i--) {
            result = callbackFn(result, array[i], i, this);
        }
        return result;
    }
    push(...items: T[]): this {
        this.innerArray_.push(...items);
        return this;
    }
    pop(throwError: boolean = false): T | undefined {
        return this.innerArray_.pop();
    }
    unshift(...items: T[]): this {
        this.innerArray_.unshift(...items);
        return this;
    }
    shift(throwError: boolean = false): T | undefined {
        return this.innerArray_.shift();
    }
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
    join(separator?: string): string {
        return this.innerArray_.join(separator);
    }
    reverse(): this {
        this.innerArray_.reverse();
        return this;
    }
    slice(start?: number, end?: number): List<T> {
        let newArray: T[] = [].slice.apply(this.innerArray_, arguments);
        return new List(newArray);
    }
    sort(compareFn?: (a: T, b: T) => number): this {
        [].sort.apply(this.innerArray_, arguments);
        return this;
    }
    indexOf(searchElement: T, fromIndex?: number): number {
        for (let i = fromIndex || 0; i < this.innerArray_.length; i++) {
            if (this.innerArray_[i] === searchElement) {
                return i;
            }
        }
        return -1;
    }
    lastIndexOf(searchElement: T, fromIndex?: number): number {
        let startIndex = this.innerArray_.length - 1;
        for (let i = fromIndex || startIndex; i >= 0; i--) {
            if (this.innerArray_[i] === searchElement) {
                return i;
            }
        }
        return -1;
    }
    splice(start: number): this;
    splice(start: number, deleteCount: number, ...items: T[]): this;
    splice(start: number, deleteCount?: number): this {
        if (arguments.length == 1) {
            this.innerArray_.splice(start, this.innerArray_.length);
        } else {
            [].splice.apply(this.innerArray_, arguments);
        }
        return this;
    }
    toArray(): T[] {
        return this.innerArray_.slice();
    }
}
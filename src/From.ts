import * as Type from "Type";
import List from "DataStruct/List";
import Map from "DataStruct/Map";
import { IConstructor } from "Interface";
import { Iterable, Iterator, IterationResult } from "Interface";
import { MapObject, KeyValuePair } from "Interface";
import { Predicate, Comparer, Selector } from "Interface";
import { DoneIterationResult, NotDoneIterationResult } from "Interface";

/**
 * from函数支持的3中类型
 */
type Extable<T> = Iterable<T> | T[] | MapObject<T>;

/**
 * 返回一个支持多种函数式方法的包装对象
 * @param iterable 需要被包装的Iterable对象
 */
export default function from<T>(iterable: Iterable<T>): Ext<T>;
/**
 * 返回一个支持多种函数式方法的包装对象
 * @param array 需要被包装的数组对象
 */
export default function from<T>(array: T[]): Ext<T>;
/**
 * 返回一个支持多种函数式方法的包装对象
 * @param array 需要被包装的MapObject对象
 */
export default function from<T>(mapObject: MapObject<T>): Ext<KeyValuePair<T>>;
export default function from<T>(obj: Extable<T>): Ext<T> | Ext<KeyValuePair<T>> {
    if (isIterable(obj)) {
        return new Ext(obj);
    } else if (Type.isArray(obj)) {
        return new Ext(new List(obj));
    } else {
        return new Ext(new Map(obj));
    }
}

/**
 * 生成指定范围内的整数序列
 * @param start 序列开始的元素
 * @param count 序列的元素个数 
 */
export function range(start: number, count: number): Ext<number> {
    return from(new RangeIterable(start, count));
}
/**
 * 将生成一个序列，其中包含一个重复的值
 * @param item 重复的元素
 * @param count 重复的次数
 */
export function repeat<T>(item: T, count: number): Ext<T> {
    return from(new RepeatIterable(item, count));
}
/**
 * 返回一个空Ext<T>具有指定的类型参数
 */
export function empty<T>(): Ext<T> {
    return from<T>([]);
}

/**
 * 判断对象是否为Iterable类型
 * @param obj 需要判断的对象
 */
function isIterable<T>(obj: any): obj is Iterable<T> {
    return Type.isFunction(obj.getIterator);
}

class RangeIterable implements Iterable<number>{
    constructor(
        private start: number,
        private count: number
    ) { }
    getIterator(): Iterator<number> {
        return new RangeIterator(this.start, this.count);
    }
}
class RangeIterator implements Iterator<number>{
    private index_: number = 0;
    constructor(
        private start: number,
        private count: number
    ) { }
    next(): IterationResult<number> {
        var result: IterationResult<number>;
        if (this.index_ < this.count) {
            result = {
                value: this.start + this.index_,
                done: false
            };
            this.index_++;
        } else {
            result = { done: true };
        }
        return result;
    }
}

class RepeatIterable<T> implements Iterable<T>{
    constructor(
        private item: T,
        private count: number
    ) { }
    getIterator(): Iterator<T> {
        return new RepeatIterator<T>(this.item, this.count);
    }
}
class RepeatIterator<T> implements Iterator<T>{
    private index_: number = 0;
    constructor(
        private item: T,
        private count: number
    ) { }
    next(): IterationResult<T> {
        var result: IterationResult<T>;
        if (this.index_ < this.count) {
            result = {
                value: this.item,
                done: false
            };
            this.index_++;
        } else {
            result = { done: true };
        }
        return result;
    }
}

/**
 * 用作部分Predicate参数的默认值
 */
function defaultPredicate<T>(item: T) {
    return true;
}

/**
 * 用作部分Comparer参数的默认值
 */
function defaultComparer<T>(a: T, b: T) {
    return a === b;
}


interface ProxyNext<I, O, C> {
    (iterator: Iterator<I>, index: number, countext: C): IterationResult<O>;
}
class ProxyIterable<I, O, C> implements Iterable<O>{
    constructor(
        private iterable: Iterable<I>,
        private proxyNext: ProxyNext<I, O, C>
    ) { }
    getIterator(): Iterator<O> {
        let it = this.iterable.getIterator();
        return new ProxyIterator(it, this.proxyNext);
    }
}
class ProxyIterator<I, O, C> implements Iterator<O>{
    private currentIndex_ = 0;
    private context_: any = {};
    constructor(
        private iterator: Iterator<I>,
        private proxyNext: ProxyNext<I, O, C>
    ) { }
    next(): IterationResult<O> {
        let itResult = this.proxyNext(this.iterator, this.currentIndex_, this.context_);
        this.currentIndex_++;
        return itResult;
    }
}

/**
 * 支持多种函数式方法的包装对象
 */
class Ext<T> implements Iterable<T> {
    constructor(private iterable: Iterable<T>) { }
    getIterator(): Iterator<T> {
        return this.iterable.getIterator();
    }

    /**
     * 遍历对象中的每一个元素
     * @param callback 对每一个元素执行的回调函数，当返回值为true时候停止迭代
     */
    private forEach(callback: (item: T, index: number) => void | boolean): this {
        let it = this.iterable.getIterator();
        let itResult: IterationResult<T>;
        let index = 0;
        for (itResult = it.next(); !itResult.done; itResult = it.next(), index++) {
            let flag = callback(itResult.value, index);
            if (flag) return this;
        }
        return this;
    }

    /**
     * 返回数组
     */
    toArray(): T[] {
        let it = this.iterable.getIterator();
        let itResult: IterationResult<T>;
        let arr: T[] = [];
        for (itResult = it.next(); !itResult.done; itResult = it.next()) {
            let value = itResult.value;
            arr.push(value);
        }
        return arr;
    }

    /**
     * 返回List对象
     */
    toList(): List<T> {
        let arr = this.toArray();
        return new List(arr);
    }

    /**
     * 如果对象中不存在元素，则返回一个只有默认值的对象
     * @param defaultValue 默认值
     */
    defaultIfEmpty(defaultValue: T): Ext<T> {
        let hasItem = this.any();
        if (hasItem) {
            return this;
        } else {
            return from([defaultValue]);
        }
    }

    /**
     * 返回对象中符合条件元素的个数
     * @param predicate 用于判断元素是否符合条件的回调函数
     */
    count(predicate: Predicate<T> = defaultPredicate): number {
        let it = this.iterable.getIterator();
        let itResult: IterationResult<T>;
        let count = 0;
        for (itResult = it.next(); !itResult.done; itResult = it.next()) {
            count++;
        }
        return count;
    }

    /**
     * 计算元素之和
     * @param selector 将元素转换为数字
     */
    sum(selector?: Selector<T, number>): number {
        let it = this.iterable.getIterator();
        let itResult: IterationResult<T>;
        let total = 0;
        let count = 0;

        if (Type.isFunction(selector)) {
            for (itResult = it.next(); !itResult.done; itResult = it.next(), count++) {
                let value = itResult.value;
                total += selector(value);
            }
        } else {
            for (itResult = it.next(); !itResult.done; itResult = it.next(), count++) {
                let value = itResult.value;
                if (Type.isNumber(value)) {
                    total += value;
                } else {
                    throw new Error();
                }
            }
        }

        if (count === 0) {
            throw new Error();
        }
        return total;
    }

    /**
     * 调用序列的每个元素上的转换函数并返回最大值
     * @param selector 将元素转换为数字
     */
    max(selector?: Selector<T, number>): T {
        if (Type.isFunction(selector)) {
            return this.aggregate((prev, current) => {
                if (selector(prev) > selector(current)) {
                    return prev;
                } else {
                    return current;
                }
            })
        } else {
            return this.aggregate((prev, current) => {
                if (!Type.isNumber(prev) || !Type.isNumber(current)) {
                    throw new Error();
                }
                if (prev > current) {
                    return <any>prev;
                } else {
                    return <any>current;
                }
            })
        }
    }

    /**
     * 调用序列的每个元素上的转换函数并返回最小值
     * @param selector 将元素转换为数字
     */
    min(selector?: Selector<T, number>): T {
        if (Type.isFunction(selector)) {
            return this.aggregate((prev, current) => {
                if (selector(prev) < selector(current)) {
                    return prev;
                } else {
                    return current;
                }
            })
        } else {
            return this.aggregate((prev, current) => {
                if (!Type.isNumber(prev) || !Type.isNumber(current)) {
                    throw new Error();
                }
                if (prev < current) {
                    return <any>prev;
                } else {
                    return <any>current;
                }
            })
        }
    }

    /**
     * 计算序列的平均值，该值可通过调用输入序列的每个元素的转换函数获取
     * @param selector 应用于每个元素的转换函数
     */
    average(selector?: Selector<T, number>): number {
        let it = this.iterable.getIterator();
        let itResult: IterationResult<T>;
        let total = 0;
        let count = 0;

        if (Type.isFunction(selector)) {
            for (itResult = it.next(); !itResult.done; itResult = it.next(), count++) {
                let value = itResult.value;
                total += selector(value);
            }
        } else {
            for (itResult = it.next(); !itResult.done; itResult = it.next(), count++) {
                let value = itResult.value;
                if (Type.isNumber(value)) {
                    total += value;
                } else {
                    throw new Error();
                }
            }
        }

        if (count === 0) {
            throw new Error();
        }
        return total / count;
    }

    /**
     * 对序列应用累加器函数
     * @param func 要对每个元素调用的累加器函数
     */
    aggregate(func: (prev: T, current: T) => T): T;
    /**
     * 对序列应用累加器函数。将指定的种子值用作累加器初始值。
     * @param seed 累加器的初始值
     * @param func 要对每个元素调用的累加器函数
     */
    aggregate<S>(seed: S, func: (prev: S, current: T) => S): S;
    /**
     * 对序列应用累加器函数。将指定的种子值用作累加器的初始值，并使用指定的函数选择结果值。
     * @param seed 累加器的初始值
     * @param func 要对每个元素调用的累加器函数
     * @param resultSelector 将累加器的最终值转换为结果值的函数
     */
    aggregate<S, R>(seed: S, func: (prev: S, current: T) => S, resultSelector: (item: S) => R): R;
    aggregate<S, R>(funcOrSeed: ((prev: T, current: T) => T) | S, func?: (prev: T | S, current: T) => T | S, resultSelector?: Selector<S, R>): T | S | R {
        let it = this.iterable.getIterator();
        let itResult: IterationResult<T>;
        let index = 0;
        let current: T;

        let argsLength = arguments.length;
        if (argsLength === 1) {
            let func = <(prev: T, current: T) => T>funcOrSeed;
            let prev: T;
            itResult = it.next();
            if (!itResult.done) {
                prev = itResult.value;
                index++;
            } else {
                throw new Error();
            }
            for (itResult = it.next(); !itResult.done; itResult = it.next(), index++) {
                current = itResult.value;
                prev = func(prev, current);
            }
            return prev;
        } else if (argsLength === 2) {
            let seed = <S>funcOrSeed;
            let prev = seed;
            for (itResult = it.next(); !itResult.done; itResult = it.next(), index++) {
                current = itResult.value;
                prev = (func as (prev: S, current: T) => S)(prev, current);
            }
            return prev;
        } else {
            let seed = <S>funcOrSeed;
            let prev = seed;
            for (itResult = it.next(); !itResult.done; itResult = it.next(), index++) {
                current = itResult.value;
                prev = (func as (prev: S, current: T) => S)(prev, current);
            }
            return (resultSelector as Selector<S, R>)(prev);
        }
    }

    /**
     * 返回序列中满足条件的第一个元素；如果未找到这样的元素，则返回默认值。
     * @param predicate 用于测试每个元素是否满足条件的函数
     * @param defaultValue 默认值
     */
    firstOrDefault(predicate: Predicate<T> = defaultPredicate, defaultValue?: T): T {
        let it = this.iterable.getIterator();
        let itResult: IterationResult<T>;
        let index = 0;
        let result: { hasValue: false } | { hasValue: true, value: T } = { hasValue: false };
        for (itResult = it.next(); !itResult.done; itResult = it.next(), index++) {
            let value = itResult.value;
            let flag = predicate(value, index);
            if (flag) {
                result = {
                    hasValue: true,
                    value: value
                }
                break;
            }
        }
        if (result.hasValue) {
            return result.value;
        } else if (arguments.length >= 2) {
            return <any>defaultValue;
        } else {
            throw new Error();
        }
    }

    /**
     * 返回序列中满足条件的最后一个元素；如果未找到这样的元素，则返回默认值。
     * @param predicate 用于测试每个元素是否满足条件的函数
     * @param defaultValue 默认值
     */
    lastOrDefault(predicate: Predicate<T> = defaultPredicate, defaultValue?: T): T {
        let it = this.iterable.getIterator();
        let itResult: IterationResult<T>;
        let index = 0;
        let result: { hasValue: false } | { hasValue: true, value: T } = { hasValue: false };
        for (itResult = it.next(); !itResult.done; itResult = it.next(), index++) {
            let value = itResult.value;
            let flag = predicate(value, index);
            if (flag) {
                result = {
                    hasValue: true,
                    value: value
                }
            }
        }
        if (result.hasValue) {
            return result.value;
        } else if (arguments.length >= 2) {
            return <any>defaultValue;
        } else {
            throw new Error();
        }
    }

    /**
     * 返回序列中指定索引处的元素；如果索引超出范围，则返回默认值。
     * @param index 要检索的从零开始的元素索引
     * @param defaultValue 默认值
     */
    elementAtOrDefault(index: number, defaultValue?: T): T {
        let argsArr = [];
        let filterFn = (_: T, i: number) => {
            return index === i;
        };
        argsArr.push(filterFn);
        if (arguments.length >= 2) {
            argsArr.push(defaultValue);
        }
        return this.firstOrDefault.apply(this, argsArr);
    }

    singleOrDefault(predicate: Predicate<T> = defaultPredicate, defaultValue?: T): T {
        let it = this.iterable.getIterator();
        let itResult: IterationResult<T>;
        let count = 0;
        let index = 0;
        let result: T = <any>null;
        for (itResult = it.next(); !itResult.done; itResult = it.next(), index++) {
            let value = itResult.value;
            let flag = predicate(value, index);
            if (flag) {
                result = value;
                count++;
                if (count >= 2) {
                    break;
                }
            }
        }
        if (count !== 1) {
            if (arguments.length >= 2) {
                return <T>defaultValue;
            } else {
                throw new Error();
            }
        } else {
            return result;
        }
    }
    //集合操作符
    union(second: Extable<T>, comparer: Comparer<T> = defaultComparer): Ext<T> {

    }
    concat(second: Extable<T>): Ext<T> {

    }
    intersect(second: Extable<T>, comparer?: (a: T, b: T) => boolean): Ext<T> {

    }
    except(second: Extable<T>, comparer?: (a: T, b: T) => boolean): Ext<T> {

    }
    zip<S, R>(second: Extable<S>, resultSelector: (a: T, b: S) => R): Ext<R> {

    }
    SequenceEqual(second: Extable<T>, comparer: Comparer<T> = defaultComparer): boolean {
        let it1 = this.iterable.getIterator();
        let it2 = from(<Iterable<T>>second).getIterator();
        let itResult1: IterationResult<T>;
        let itResult2: IterationResult<T>;
        while (true) {
            itResult1 = it1.next();
            itResult2 = it2.next();
            if (itResult1.done && itResult2.done) {
                return true;
            }
            if (itResult1.done !== itResult2.done) {
                return false;
            }
            let value1 = (<NotDoneIterationResult<T>>itResult1).value;
            let value2 = (<NotDoneIterationResult<T>>itResult2).value;
            let isEqual = defaultComparer(value1, value2);
            if (!isEqual) {
                return false;
            }
        }
    }
    //过滤操作符
    where(predicate: Predicate<T>): Ext<T> {

    }
    OfType<U>(constructor: IConstructor<U>): Ext<U> {

    }
    distinct(comparer?: Comparer<T>): Ext<T> {

    }
    //投影操作符
    select<S>(selector: (item: T, index: number) => S): Ext<S> {

    }
    SelectMany<TResult>(
        selector: (item: T, index: number) => Extable<TResult>
    ): Extable<TResult>;
    SelectMany<TCollection, TResult>(
        collectionSelector: (item: T, index: number) => Extable<TCollection>,
        resultSelector: (item: T, collection: TCollection) => TResult
    ): Extable<TResult>;
    SelectMany<TCollection, TResult>(
        collectionSelector: (item: T, index: number) => Extable<TResult | TCollection>,
        resultSelector?: (item: T, collection: TCollection) => TResult
    ): Extable<TResult> {

    }

    /**
     * 确定序列中的任何元素是否都满足条件
     * @param predicate 用于测试每个元素是否满足条件的函数
     */
    any(predicate: Predicate<T> = defaultPredicate): boolean {
        let result = false;
        this.forEach((item, index) => {
            let flag = predicate(item, index);
            if (flag) {
                result = true;
                return true;
            }
        })
        return result;
    }

    /**
     * 确定序列中的所有元素是否满足条件
     * @param predicate 用于测试每个元素是否满足条件的函数
     */
    all(predicate: Predicate<T> = defaultPredicate): boolean {
        let result = true;
        this.forEach((item, index) => {
            let flag = predicate(item, index);
            if (flag) {
                result = false;
                return true;
            }
        })
        return result;
    }

    /**
     * 确定序列是否包含指定的元素
     * @param value 要在序列中定位的值
     * @param comparer 一个对值进行比较的相等比较器
     */
    contains(value: T, comparer: Comparer<T> = defaultComparer): boolean {
        return this.any(item => {
            let flag = comparer(value, item);
            return flag;
        })
    }
    //分区操作符
    skip(count: number): Ext<T> {

    }
    skipWhile(predicate: Predicate): Ext<T> {

    }
    take(count: number): Ext<T> {

    }
    takeWhile(predicate: Predicate): Ext<T> {

    }
}
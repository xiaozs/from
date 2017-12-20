import * as Type from "Type";
import List from "DataStruct/List";
import Map from "DataStruct/Map";
import { IConstructor } from "Interface";
import { MapObject, KeyValuePair } from "Interface";
import { AggregateFunc, Predicate, EqualityComparer, Selector, ValueComparer } from "Interface";
/**
 * 用作部分Predicate参数的默认值
 */
function defaultPredicate<T>(item: T) {
    return true;
}
/**
 * 用作部分Comparer参数的默认值
 */
function defaultEqualityComparer<T>(a: T, b: T) {
    return a === b;
}
function defaultValueComparerForString(a: string, b: string) {
    return a.localeCompare(b);
}
function defaultValueComparerForNumber(a: number, b: number) {
    return a - b;
}


export class From<T> implements Iterable<T>{
    /**
     * 构造函数
     * @param iterable 可迭代对象
     */
    constructor(protected iterable: Iterable<T>) { }

    /**
     * From的迭代器
     */
    [Symbol.iterator]() {
        return this.iterable[Symbol.iterator]();
    }

    /**
     * 遍历对象中的每一个元素
     * @param callback 对每一个元素执行的回调函数，当返回值为true时候停止迭代
     */
    private forEach(callback: (item: T, index: number) => void | boolean): this {
        let index = 0;
        for (let item of this) {
            let flag = callback(item, index);
            index++;
            if (flag) return this;
        }
        return this;
    }

    /**
     * 对序列应用累加器函数
     * @param func 要对每个元素调用的累加器函数
     */
    aggregate(func: AggregateFunc<T, T>): T;
    /**
     * 对序列应用累加器函数。将指定的种子值用作累加器初始值。
     * @param seed 累加器的初始值
     * @param func 要对每个元素调用的累加器函数
     */
    aggregate<S>(seed: S, func: AggregateFunc<S, T>): S;
    /**
     * 对序列应用累加器函数。将指定的种子值用作累加器的初始值，并使用指定的函数选择结果值。
     * @param seed 累加器的初始值
     * @param func 要对每个元素调用的累加器函数
     * @param resultSelector 将累加器的最终值转换为结果值的函数
     */
    aggregate<S, R>(seed: S, func: AggregateFunc<S, T>, resultSelector: (item: S) => R): R;
    aggregate<S, R>(funcOrSeed: AggregateFunc<T, T> | S, func?: AggregateFunc<T | S, T>, resultSelector?: Selector<S, R>): T | S | R {
        let it = this[Symbol.iterator]();
        let itResult: IteratorResult<T>;
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
        } else {
            let seed = <S>funcOrSeed;
            let prev = seed;
            this.forEach(current => {
                prev = (func as (prev: S, current: T) => S)(prev, current);
            })
            if (argsLength === 2) {
                return prev;
            } else {
                return (resultSelector as Selector<S, R>)(prev);
            }
        }
    }

    /**
     * 确定序列中的所有元素是否满足条件
     * @param predicate 用于测试每个元素是否满足条件的函数
     */
    all(predicate: Predicate<T> = defaultPredicate): boolean {
        let result = true;
        this.forEach((item, index) => {
            let flag = predicate(item, index);
            if (!flag) {
                result = false;
                return true;
            }
        })
        return result;
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
     * 计算序列的平均值，该值可通过调用输入序列的每个元素的转换函数获取
     * @param selector 应用于每个元素的转换函数
     */
    average(selector?: Selector<T, number>): number {
        let total: number;
        let count = 0;
        if (Type.isFunction(selector)) {
            total = this.aggregate(0, (total, value) => {
                count++;
                return total + selector(value);
            })
        } else {
            total = this.aggregate(0, (total, value) => {
                count++;
                if (Type.isNumber(value)) {
                    return total + value;
                } else {
                    throw new Error();
                }
            })
        }

        if (count === 0) {
            throw new Error();
        }
        return total / count;
    }

    /**
     * 连接两个序列
     * @param second 要与第一个序列连接的序列
     */
    concat(second: Iterable<T>): From<T> {
        let that = this;
        return new From({
            *[Symbol.iterator]() {
                for (let item of that) {
                    yield item;
                }
                for (let item of second) {
                    yield item;
                }
            }
        });
    }

    /**
     * 确定序列是否包含指定的元素
     * @param value 要在序列中定位的值
     * @param comparer 一个对值进行比较的相等比较器
     */
    contains(value: T, comparer: EqualityComparer<T> = defaultEqualityComparer): boolean {
        return this.any(item => {
            let flag = comparer(value, item);
            return flag;
        })
    }

    /**
     * 返回对象中符合条件元素的个数
     * @param predicate 用于判断元素是否符合条件的回调函数
     */
    count(predicate: Predicate<T> = defaultPredicate): number {
        let count = 0;
        this.forEach((item, index) => {
            let flag = predicate(item, index);
            if (flag) {
                count++;
            }
        })
        return count;
    }

    /**
     * 如果对象中不存在元素，则返回一个只有默认值的对象
     * @param defaultValue 默认值
     */
    defaultIfEmpty(defaultValue: T): From<T> {
        let hasItem = this.any();
        if (hasItem) {
            return this;
        } else {
            return new From([defaultValue]);
        }
    }

    /**
     * 对值进行比较返回序列中的非重复元素
     * @param comparer 用于比较值的函数
     */
    distinct(comparer: EqualityComparer<T> = defaultEqualityComparer): From<T> {
        let that = this;
        return new From({
            *[Symbol.iterator]() {
                let resultArr: T[] = [];
                let resultExt = new From(resultArr);
                for (let item of that) {
                    let flag = resultExt.contains(item, comparer);
                    if (!flag) {
                        resultArr.push(item);
                        yield item;
                    }
                }
            }
        });
    }

    /**
     * 返回序列中指定索引处的元素；如果索引超出范围，则返回undefined。
     * @param index 要检索的从零开始的元素索引
     */
    elementAt(index: number): T | undefined;
    /**
     * 返回序列中指定索引处的元素；如果索引超出范围，则返回默认值。
     * @param index 要检索的从零开始的元素索引
     * @param defaultValue 默认值
     */
    elementAt(index: number, defaultValue: T): T;
    elementAt(index: number, defaultValue?: T): T | undefined {
        let filterFn = (_: T, i: number) => {
            return index === i;
        };
        if (arguments.length >= 2) {
            return this.first(filterFn, defaultValue);
        } else {
            return this.first(filterFn);
        }
    }

    /**
     * 返回两个序列的差集
     * @param second 需要去除的元素的集合
     * @param comparer 用于比较值的函数
     */
    except(second: Iterable<T>, comparer: EqualityComparer<T> = defaultEqualityComparer): From<T> {
        let that = this;
        return new From({
            *[Symbol.iterator]() {
                let secExt = new From(second);
                for (let item of that) {
                    let flag = secExt.contains(item, comparer);
                    if (!flag) yield item;
                }
            }
        });
    }

    /**
     * 返回序列中满足条件的第一个元素；如果未找到这样的元素，则返回默认值。
     * @param predicate 用于测试每个元素是否满足条件的函数
     * @param defaultValue 默认值
     */
    first(predicate: Predicate<T> = defaultPredicate, defaultValue?: T): T {
        return this.firstOrLast(true, predicate, defaultValue);
    }

    private firstOrLast(isFirst: boolean, predicate: Predicate<T>, defaultValue?: T): T {
        let result: T = <any>null;
        let hasValue = false;
        this.forEach((item, index) => {
            let flag = predicate(item, index);
            if (flag) {
                result = item;
                hasValue = true;
                return isFirst;
            }
        })
        if (hasValue) {
            return result;
        } else if (arguments.length >= 2) {
            return <T>defaultValue;
        } else {
            throw new Error();
        }
    }

    /**
     * 生成两个序列的交集
     * @param second 将返回其也出现在第一个序列中的非重复元素
     * @param comparer 用于比较值的函数
     */
    intersect(second: Iterable<T>, comparer: EqualityComparer<T> = defaultEqualityComparer): From<T> {
        let that = this;
        return new From({
            *[Symbol.iterator]() {
                for (let item of second) {
                    let flag = that.contains(item, comparer);
                    if (flag) yield item;
                }
            }
        });
    }

    /**
     * 返回序列中满足条件的最后一个元素；如果未找到这样的元素，则返回默认值。
     * @param predicate 用于测试每个元素是否满足条件的函数
     * @param defaultValue 默认值
     */
    last(predicate: Predicate<T> = defaultPredicate, defaultValue?: T): T {
        return this.firstOrLast(false, predicate, defaultValue);
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
                    return <T>prev;
                } else {
                    return <T>current;
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
                    return <T>prev;
                } else {
                    return <T>current;
                }
            })
        }
    }

    /**
     * 根据指定类型筛选元素
     * @param type 需要筛选元素的类型的字符串
     */
    ofType(type: "Boolean"): From<boolean>;
    /**
     * 根据指定类型筛选元素
     * @param type 需要筛选元素的类型的字符串
     */
    ofType(type: "Date"): From<Date>;
    /**
     * 根据指定类型筛选元素
     * @param type 需要筛选元素的类型的字符串
     */
    ofType(type: "Function"): From<Function>;
    /**
     * 根据指定类型筛选元素
     * @param type 需要筛选元素的类型的字符串
     */
    ofType(type: "Number"): From<number>;
    /**
     * 根据指定类型筛选元素
     * @param type 需要筛选元素的类型的字符串
     */
    ofType(type: "RegExp"): From<RegExp>;
    /**
     * 根据指定类型筛选元素
     * @param type 需要筛选元素的类型的字符串
     */
    ofType(type: "String"): From<string>;
    /**
     * 根据指定类型筛选元素
     * @param constructor 需要筛选的元素的构造函数
     */
    ofType<U extends object>(constructor: IConstructor<U>): From<U>;
    ofType<U extends object>(stringOrconstructor: string | IConstructor<U>): From<U> {
        if (stringOrconstructor === "Boolean") {
            return <any>this.where(item => {
                return Type.isBool(item);
            });
        } else if (stringOrconstructor === "Date") {
            return <any>this.where(item => {
                return Type.isDate(item);
            });
        } else if (stringOrconstructor === "Function") {
            return <any>this.where(item => {
                return Type.isFunction(item);
            });
        } else if (stringOrconstructor === "Number") {
            return <any>this.where(item => {
                return Type.isNumber(item);
            });
        } else if (stringOrconstructor === "RegExp") {
            return <any>this.where(item => {
                return Type.isRegExp(item);
            });
        } else if (stringOrconstructor === "String") {
            return <any>this.where(item => {
                return Type.isString(item);
            });
        } else {
            return <any>this.where(item => {
                return Type.is(<any>item, stringOrconstructor as IConstructor<U>);
            });
        }
    }

    /**
     * 通过合并元素的索引将序列的每个元素投影到新表中
     * @param selector 一个应用于每个源元素的转换函数；函数的第二个参数表示源元素的索引
     */
    select<S>(selector: (item: T, index: number) => S): From<S> {
        let that = this;
        return new From({
            *[Symbol.iterator]() {
                let index = 0;
                for (let item of that) {
                    yield selector(item, index++);
                }
            }
        });
    }

    /**
     * 将序列的每个元素投影并将结果序列合并为一个序列
     * @param selector 应用于每个元素的转换函数
     */
    selectMany<TResult>(
        selector: (item: T, index: number) => Iterable<TResult>
    ): From<TResult>;
    /**
     * 将序列的每个元素投影并将结果序列合并为一个序列，并对其中每个元素调用结果选择器函数
     * @param collectionSelector 一个应用于输入序列的每个元素的转换函数
     * @param resultSelector 一个应用于中间序列的每个元素的转换函数
     */
    selectMany<TCollection, TResult>(
        collectionSelector: (item: T, index: number) => Iterable<TCollection>,
        resultSelector: (item: T, collection: TCollection) => TResult
    ): From<TResult>;
    selectMany<TCollection, TResult>(
        collectionSelector: (item: T, index: number) => Iterable<TResult> | Iterable<TCollection>,
        resultSelector?: (item: T, collection: TCollection) => TResult
    ): From<TResult> {
        let that = this;
        let argsLength = arguments.length;
        return new From({
            *[Symbol.iterator]() {
                let index = 0;
                if (argsLength === 1) {
                    for (let item of that) {
                        let collection = collectionSelector(item, index++) as Iterable<TResult>;
                        for (let innerItem of collection) {
                            yield innerItem;
                        }
                    }
                } else {
                    for (let item of that) {
                        let collection = collectionSelector(item, index++) as Iterable<TCollection>;
                        for (let innerItem of collection) {
                            yield (<(item: T, collection: TCollection) => TResult>resultSelector)(item, innerItem);
                        }
                    }
                }
            }
        });
    }

    /**
     * 对两个序列的元素进行比较，以确定序列是否相等
     * @param second 用于与当前序列进行比较
     * @param comparer 一个用于比较元素的函数
     */
    sequenceEqual(second: Iterable<T>, comparer: EqualityComparer<T> = defaultEqualityComparer): boolean {
        let it1 = this[Symbol.iterator]();
        let it2 = second[Symbol.iterator]();
        let itResult1: IteratorResult<T>;
        let itResult2: IteratorResult<T>;
        while (true) {
            itResult1 = it1.next();
            itResult2 = it2.next();
            if (itResult1.done && itResult2.done) {
                return true;
            }
            if (itResult1.done !== itResult2.done) {
                return false;
            }
            let value1 = itResult1.value;
            let value2 = itResult2.value;
            let isEqual = comparer(value1, value2);
            if (!isEqual) {
                return false;
            }
        }
    }

    /**
     * 返回序列中的唯一元素；如果不存在元素或如果有多个元素，此方法将引发异常。
     */
    single(): T;
    /**
     * 返回序列中满足指定条件的唯一元素；如果这类元素不存在或如果有多个元素满足该条件，此方法将引发异常。
     * @param predicate 用于测试元素是否满足条件的函数
     */
    single(predicate: Predicate<T>): T;
    /**
     * 返回序列中满足指定条件的唯一元素；如果这类元素不存在或果有多个元素满足该条件，此方法将返回默认值。
     * @param predicate 用于测试元素是否满足条件的函数
     * @param defaultValue 默认值
     */
    single(predicate: Predicate<T>, defaultValue: T): T;
    single(predicate: Predicate<T> = defaultPredicate, defaultValue?: T): T {
        let count = 0;
        let result: T = <any>null;
        this.forEach((value, index) => {
            let flag = predicate(value, index);
            if (flag) {
                result = value;
                count++;
                if (count >= 2) {
                    return true;
                }
            }
        })
        if (count === 1) {
            return result;
        } else if (arguments.length >= 2) {
            return <T>defaultValue;
        } else {
            throw new Error();
        }
    }

    /**
     * 跳过序列中指定数量的元素，然后返回剩余的元素
     * @param count 返回剩余元素前要跳过的元素数量
     */
    skip(count: number): From<T> {
        return this.where((_, index) => {
            return index >= count;
        })
    }

    /**
     * 只要满足指定的条件，就跳过序列中的元素，然后返回剩余元素
     * @param predicate 用于测试每个源元素是否满足条件的函数
     */
    skipWhile(predicate: Predicate<T>): From<T> {
        let that = this;
        return new From({
            *[Symbol.iterator]() {
                let index = 0;
                let it = that[Symbol.iterator]();
                let iterable: Iterable<T> = {
                    [Symbol.iterator]() {
                        return it;
                    }
                }
                for (let item of iterable) {
                    let flag = predicate(item, index++);
                    if (!flag) {
                        yield item;
                        break;
                    }
                }
                for (let item of iterable) {
                    yield item;
                }
            }
        });
    }

    /**
     * 计算元素之和
     * @param selector 将元素转换为数字
     */
    sum(selector?: Selector<T, number>): number {
        let total: number;
        let count = 0;
        if (Type.isFunction(selector)) {
            total = this.aggregate(0, (total, value) => {
                count++;
                return total + selector(value);
            })
        } else {
            total = this.aggregate(0, (total, value) => {
                count++;
                if (Type.isNumber(value)) {
                    return total + value;
                } else {
                    throw new Error();
                }
            })
        }
        return total;
    }

    /**
     * 从序列的开头返回指定数量的连续元素
     * @param count 要返回的元素数量
     */
    take(count: number): From<T> {
        return this.where((_, index) => {
            return index < count;
        })
    }

    /**
     * 只要满足指定的条件，就会返回序列的元素
     * @param predicate 用于测试每个源元素是否满足条件的函数
     */
    takeWhile(predicate: Predicate<T>): From<T> {
        let that = this;
        return new From({
            *[Symbol.iterator]() {
                let index = 0;
                for (let item of that) {
                    let flag = predicate(item, index++);
                    if (flag) {
                        yield item;
                    } else {
                        return;
                    }
                }
            }
        });
    }

    /**
     * 返回数组
     */
    toArray(): T[] {
        let arr: T[] = [];
        this.forEach(item => {
            arr.push(item);
        })
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
     * 生成两个序列的并集
     * @param second 它的非重复元素构成联合的第二个集
     * @param comparer 用于对值进行比较的函数
     */
    union(second: Iterable<T>, comparer: EqualityComparer<T> = defaultEqualityComparer): From<T> {
        let that = this;
        return new From({
            *[Symbol.iterator]() {
                for (let item of that) {
                    yield item;
                }
                for (let item of second) {
                    let flag = that.contains(item, comparer);
                    if (!flag) yield item;
                }
            }
        });
    }

    /**
     * 基于谓词筛选值序列
     * @param predicate 用于测试每个元素是否满足条件的函数
     */
    where(predicate: Predicate<T>): From<T> {
        let that = this;
        return new From({
            *[Symbol.iterator]() {
                let index = 0;
                for (let item of that) {
                    let flag = predicate(item, index++);
                    if (flag) {
                        yield item;
                    }
                }
            }
        });
    }

    /**
     * 对两个序列的元素进行操作返回一个新的序列，抛弃多余的元素
     * @param second 第二个序列
     * @param resultSelector 对两个序列的元素进行操作的函数
     */
    zip<S, R>(second: Iterable<S>, resultSelector: (a: T, b: S) => R): From<R> {
        let that = this;
        return new From({
            *[Symbol.iterator]() {
                let it1 = that[Symbol.iterator]();
                let it2 = second[Symbol.iterator]();

                let itResult1 = it1.next();
                let itResult2 = it2.next();
                while (!itResult1.done && !itResult2.done) {
                    yield resultSelector(itResult1.value, itResult2.value);
                    itResult1 = it1.next();
                    itResult2 = it2.next();
                }
            }
        });
    }



    /**
     * 在序列之后添加新元素
     * @param item 新元素
     */
    append(item: T): From<T> {
        let that = this;
        return new From({
            *[Symbol.iterator]() {
                for (let thatItem of that) {
                    yield thatItem;
                }
                yield item;
            }
        });
    }

    /**
     * 在序列最前添加新元素
     * @param item 新元素
     */
    prepend(item: T): From<T> {
        let that = this;
        return new From({
            *[Symbol.iterator]() {
                yield item;
                for (let thatItem of that) {
                    yield thatItem;
                }
            }
        });
    }

    orderBy(keySelector: Selector<T, number>): OrderedFrom<T>;
    orderBy(keySelector: Selector<T, String>): OrderedFrom<T>;
    orderBy(keySelector: Selector<T, any>, valueComparer: ValueComparer<T>): OrderedFrom<T>;
    orderBy(keySelector: Selector<T, any>, valueComparer?: ValueComparer<T>): OrderedFrom<T> {
        return new OrderedFrom(this, keySelector, valueComparer);
    }
    orderByDescending() { }
    reverse() {

    }
    join() {

    }
    groupJoin() {

    }
    group() {

    }
    groupBy() {

    }

    /**
     * 生成指定范围内的整数序列
     * @param start 序列开始的元素
     * @param count 序列的元素个数 
     */
    static range(start: number, count: number): From<number> {
        return new From({
            *[Symbol.iterator]() {
                while (count--) {
                    yield start++;
                }
            }
        })
    }

    /**
     * 将生成一个序列，其中包含一个重复的值
     * @param item 重复的元素
     * @param count 重复的次数
     */
    static repeat<T>(item: T, count: number): From<T> {
        return new From({
            *[Symbol.iterator]() {
                while (count--) {
                    yield item;
                }
            }
        })
    }

    /**
     * 返回一个空From<T>具有指定的类型参数
     */
    static empty<T>(): From<T> {
        return new From([]);
    }
}

class OrderedFrom<T> extends From<T> {
    constructor(
        iterable: Iterable<T>,
        private keySelector: Selector<T, any>,
        private valueComparer?: ValueComparer<T>
    ) {
        super(iterable);
    }
    *[Symbol.iterator]() {
        let itemArray = this.getInnerArray();
        for (let item of itemArray) {
            yield item;
        }
    }
    private getInnerArray() {
        let itemArray: T[] = [];
        for (let it of this.iterable) {
            itemArray.push(it);
        }
        if (itemArray.length > 0) {
            let comparer = this.valueComparer as ValueComparer<any>;
            let first = itemArray[0];
            let key = this.keySelector(first);
            if (Type.isString(key)) {
                comparer = defaultValueComparerForString;
            } else if (Type.isNumber(key)) {
                comparer = defaultValueComparerForNumber;
            }
            itemArray.sort((a, b) => {
                let keyA = this.keySelector(a);
                let keyB = this.keySelector(b);
                return comparer(keyA, keyB);
            });
        }
        return itemArray;
    }
    thenBy() { }
    thenByDescending() { }
}

/**
 * 生成From对象
 * @param it 可遍历对象
 */
export default function from<T>(it: Iterable<T>) {
    return new From(it);
}
import * as Type from "Type";
import List from "DataStruct/List";
import Map from "DataStruct/Map";
import { IConstructor } from "Type";
import { Iterable, Iterator, IterationResult } from "Interface";
import { MapObject, KeyValuePair } from "Interface";

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
 * 支持多种函数式方法的包装对象
 */
class Ext<T> implements Iterable<T> {
    constructor(private it: Iterable<T>) { }
    //转换操作符

    toArray(): T[] {

    }
    toList(): List<T> {

    }
    defaultIfEmpty(defaultValue: T): Ext<T> {

    }
    //合计操作符
    count(predicate?: (item: T) => boolean): number {

    }
    sum(selector?: (item: T) => number): number {

    }
    max(selector?: (item: T) => number): number {

    }
    min(selector?: (item: T) => number): number {

    }
    average(selector?: (item: T) => number): number {

    }
    aggregate(func: (prev: T, current: T) => T): T;
    aggregate<S>(seed: S, func: (prev: S, current: T) => S): S;
    aggregate<S, R>(seed: S, func: (prev: S, current: T) => S, resultSelector: (item: S) => R): R;
    aggregate<S, R>(funcOrSeed: ((prev: T, current: T) => T) | S, func?: (prev: T, current: T) => T, resultSelector?: (item: S) => R): T | S | R {
        let argsLength = arguments.length;
        if (argsLength === 1) {

        } else if (argsLength === 2) {

        } else {

        }
    }
    //元素操作符
    firstOrDefault(predicate?: (item: T) => boolean, defaultValue?: T): T {

    }
    lastOrDefault(predicate?: (item: T) => boolean, defaultValue?: T): T {

    }
    elementAtOrDefault(index: number, defaultValue?: T): T {

    }
    singleOrDefault(predicate?: (item: T) => boolean, defaultValue?: T): T {

    }
    //集合操作符
    union(second: Extable<T>, comparer?: (a: T, b: T) => boolean): Ext<T> {

    }
    concat(second: Extable<T>): Ext<T> {

    }
    intersect(second: Extable<T>, comparer?: (a: T, b: T) => boolean): Ext<T> {

    }
    except(second: Extable<T>, comparer?: (a: T, b: T) => boolean): Ext<T> {

    }
    zip<S, R>(second: Extable<S>, resultSelector: (a: T, b: S) => R): Ext<R> {

    }
    SequenceEqual(second: Extable<T>, comparer?: (a: T, b: T) => boolean): boolean {

    }
    //过滤操作符
    where(predicate: (item: T, index: number) => boolean): Ext<T> {

    }
    OfType<U>(constructor: IConstructor<U>): Ext<U> {

    }
    distinct(comparer?: (a: T, b: T) => boolean): Ext<T> {

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
    //量词操作符
    any(predicate: (item: T) => boolean): bool {

    }
    all(predicate: (item: T) => boolean): bool {

    }
    contains(value: T, comparer?: (a: T, b: T) => boolean): bool {

    }
    //分区操作符
    skip(count: number): Ext<T> {

    }
    skipWhile(predicate: (item: T, index: number) => boolean): Ext<T> {

    }
    take(count: number): Ext<T> {

    }
    takeWhile(predicate: (item: T, index: number) => boolean): Ext<T> {

    }
}
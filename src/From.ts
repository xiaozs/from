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
 * //todo,MapObject有问题
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
    (iterator: Iterator<I>, context: C): IterationResult<O>;
}
/**
 * 
 */
class ProxyIterable<I, O, C> implements Iterable<O>{
    constructor(
        private iterable: Iterable<I>,
        private proxyNext: ProxyNext<I, O, C>,
        private contextGenerator: () => C
    ) { }
    getIterator(): Iterator<O> {
        let it = this.iterable.getIterator();
        return new ProxyIterator(it, this.proxyNext, this.contextGenerator());
    }
}
class ProxyIterator<I, O, C> implements Iterator<O>{
    constructor(
        private iterator: Iterator<I>,
        private proxyNext: ProxyNext<I, O, C>,
        private context: C
    ) { }
    next(): IterationResult<O> {
        let itResult = this.proxyNext(this.iterator, this.context);
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
        return this.aggregate(0, count => {
            return count + 1;
        })
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
     * 返回序列中满足条件的第一个元素；如果未找到这样的元素，则返回默认值。
     * @param predicate 用于测试每个元素是否满足条件的函数
     * @param defaultValue 默认值
     */
    first(predicate: Predicate<T> = defaultPredicate, defaultValue?: T): T {
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
    last(predicate: Predicate<T> = defaultPredicate, defaultValue?: T): T {
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
    elementAt(index: number, defaultValue?: T): T {
        let argsArr = [];
        let filterFn = (_: T, i: number) => {
            return index === i;
        };
        argsArr.push(filterFn);
        if (arguments.length >= 2) {
            argsArr.push(defaultValue);
        }
        return this.first.apply(this, argsArr);
    }

    /**
     * 返回序列中满足指定条件的唯一元素；如果这类元素不存在，则返回默认值；如果有多个元素满足该条件，此方法将引发异常。
     * @param predicate 用于测试元素是否满足条件的函数
     * @param defaultValue 默认值
     */
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
     * 生成两个序列的并集
     * @param second 它的非重复元素构成联合的第二个集
     * @param comparer 用于对值进行比较的函数
     */
    union(second: Extable<T>, comparer: Comparer<T> = defaultComparer): Ext<T> {
        let iterable = new ProxyIterable(this, (_, context) => {
            let itResult: IterationResult<T>;
            while (true) {
                itResult = context.it.next()
                if (itResult.done) {
                    if (context.isFirst) {
                        context.isFirst = false;
                        context.it = from(<T[]>second).getIterator();
                    } else {
                        return { done: true };
                    }
                } else {
                    let value = itResult.value;
                    let flag = from(context.resultArr).contains(value, comparer);
                    if (!flag) {
                        context.resultArr.push(value);
                        return itResult;
                    }
                }
            }
        }, () => {
            let resultArr: T[] = [];
            return {
                isFirst: true,
                it: this.getIterator(),
                resultArr: resultArr
            }
        });
        return new Ext(iterable);
    }

    /**
     * 连接两个序列
     * @param second 要与第一个序列连接的序列
     */
    concat(second: Extable<T>): Ext<T> {
        let iterable = new ProxyIterable(this, (_, context) => {
            let itResult = context.it.next();
            if (itResult.done && context.isFirst) {
                context.isFirst = false;
                context.it = from(<T[]>second).getIterator();
                itResult = context.it.next();
            }
            return itResult;
        }, () => {
            return {
                isFirst: true,
                it: this.getIterator()
            }
        });
        return new Ext(iterable);
    }

    /**
     * 生成两个序列的交集
     * @param second 将返回其也出现在第一个序列中的非重复元素
     * @param comparer 用于比较值的函数
     */
    intersect(second: Extable<T>, comparer: Comparer<T> = defaultComparer): Ext<T> {

    }

    /**
     * 
     */
    except(second: Extable<T>, comparer: Comparer<T> = defaultComparer): Ext<T> {

    }

    /**
     * 
     */
    zip<S, R>(second: Extable<S>, resultSelector: (a: T, b: S) => R): Ext<R> {
        let iterable = new ProxyIterable(this, (it, context) => {
            let itResult = it.next();
            let itResult2 = context.it2.next();
            if (!itResult.done && !itResult2.done) {
                return {
                    done: false,
                    value: resultSelector(itResult.value, itResult2.value)
                }
            } else {
                return { done: true };
            }
        }, () => {
            return {
                it2: from(<S[]>second).getIterator()
            }
        });
        return new Ext(iterable);
    }

    /**
     * 在序列之后添加新元素
     * @param item 新元素
     */
    append(item: T): Ext<T> {
        let iterable = new ProxyIterable(this, (it, context) => {
            let itResult = it.next();
            if (itResult.done && !context.done) {
                context.done = true;
                return { done: false, value: item };
            } else {
                return itResult;
            }
        }, () => {
            return {
                done: false
            }
        });
        return new Ext(iterable);
    }

    /**
     * 在序列最前添加新元素
     * @param item 新元素
     */
    prepend(item: T): Ext<T> {
        let iterable = new ProxyIterable(this, (it, context) => {
            if (context.readFirst) {
                context.readFirst = false;
                return { done: false, value: item };
            } else {
                return it.next();
            }
        }, () => {
            return {
                readFirst: true
            }
        });
        return new Ext(iterable);
    }

    /**
     * 对两个序列的元素进行比较，以确定序列是否相等
     * @param second 用于与当前序列进行比较
     * @param comparer 一个用于比较元素的函数
     */
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
            let isEqual = comparer(value1, value2);
            if (!isEqual) {
                return false;
            }
        }
    }

    /**
     * 基于谓词筛选值序列
     * @param predicate 用于测试每个元素是否满足条件的函数
     */
    where(predicate: Predicate<T>): Ext<T> {
        let iterable = new ProxyIterable(this, (it, context) => {
            let itResult: IterationResult<T>;
            for (itResult = it.next(); !itResult.done; itResult = it.next(), context.index++) {
                let flag = predicate(itResult.value, context.index);
                if (flag) {
                    return itResult;
                }
            }
            return itResult;
        }, () => {
            return {
                index: 0
            }
        });
        return new Ext(iterable);
    }

    /**
     * 根据指定类型筛选元素
     * @param constructor 需要筛选的元素的构造函数
     */
    OfType<U>(constructor: IConstructor<U>): Ext<U> {
        return <any>this.where(item => Type.is(item, constructor));
    }

    /**
     * 对值进行比较返回序列中的非重复元素
     * @param comparer 用于比较值的函数
     */
    distinct(comparer: Comparer<T> = defaultComparer): Ext<T> {
        let iterable = new ProxyIterable(this, (it, resultArr) => {
            let itResult: IterationResult<T>;
            for (itResult = it.next(); !itResult.done; itResult = it.next()) {
                let value = itResult.value;
                let flag = from(resultArr).contains(value, comparer);
                if (!flag) {
                    resultArr.push(value);
                    return itResult;
                }
            }
            return itResult;
        }, () => {
            let resultArr: T[] = [];
            return resultArr;
        });
        return new Ext(iterable);
    }

    /**
     * 通过合并元素的索引将序列的每个元素投影到新表中
     * @param selector 一个应用于每个源元素的转换函数；函数的第二个参数表示源元素的索引
     */
    select<S>(selector: (item: T, index: number) => S): Ext<S> {
        let iterable = new ProxyIterable(this, (it, context) => {
            let itResult = it.next();
            if (itResult.done) {
                return itResult;
            } else {
                return {
                    done: false,
                    value: selector(itResult.value, context.index++)
                }
            }
        }, () => {
            return {
                index: 0
            }
        });
        return new Ext(iterable);
    }

    /**
     * 将序列的每个元素投影并将结果序列合并为一个序列
     * @param selector 应用于每个元素的转换函数
     */
    SelectMany<TResult>(
        selector: (item: T, index: number) => Extable<TResult>
    ): Ext<TResult>;
    /**
     * 将序列的每个元素投影并将结果序列合并为一个序列，并对其中每个元素调用结果选择器函数
     * @param collectionSelector 一个应用于输入序列的每个元素的转换函数
     * @param resultSelector 一个应用于中间序列的每个元素的转换函数
     */
    SelectMany<TCollection, TResult>(
        collectionSelector: (item: T, index: number) => Extable<TCollection>,
        resultSelector: (item: T, collection: TCollection) => TResult
    ): Ext<TResult>;
    SelectMany<TCollection, TResult>(
        collectionSelector: (item: T, index: number) => Extable<TResult> | Extable<TCollection>,
        resultSelector?: (item: T, collection: TCollection) => TResult
    ): Ext<TResult> {
        let argsLength = arguments.length;
        let iterable = new ProxyIterable(this, (it, context) => {
            if (argsLength === 2) {

            } else {

            }
        }, () => {

        });
        return new Ext(iterable);
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

    /**
     * 跳过序列中指定数量的元素，然后返回剩余的元素
     * @param count 返回剩余元素前要跳过的元素数量
     */
    skip(count: number): Ext<T> {
        return this.where((_, index) => {
            return index >= count;
        })
    }

    /**
     * 只要满足指定的条件，就跳过序列中的元素，然后返回剩余元素
     * @param predicate 用于测试每个源元素是否满足条件的函数
     */
    skipWhile(predicate: Predicate<T>): Ext<T> {
        let iterable = new ProxyIterable(this, (it, context) => {
            if (context.isEnd) {
                return it.next();
            }
            let itResult: IterationResult<T>;
            for (itResult = it.next(); !itResult.done; itResult = it.next(), context.index++) {
                let flag = predicate(itResult.value, context.index);
                if (!flag) {
                    break;
                }
            }
            context.isEnd = true;
            return itResult;
        }, () => {
            return {
                isEnd: false,
                index: 0
            }
        });
        return new Ext(iterable);
    }

    /**
     * 从序列的开头返回指定数量的连续元素
     * @param count 要返回的元素数量
     */
    take(count: number): Ext<T> {
        return this.where((_, index) => {
            return index < count;
        })
    }

    /**
     * 只要满足指定的条件，就会返回序列的元素
     * @param predicate 用于测试每个源元素是否满足条件的函数
     */
    takeWhile(predicate: Predicate<T>): Ext<T> {
        let iterable = new ProxyIterable(this, (it, context) => {
            if (context.isEnd) {
                return { done: true };
            }
            let itResult = it.next();
            if (!itResult.done && predicate(itResult.value, context.index)) {
                context.index++;
            } else {
                context.isEnd = true;
            }
            return itResult
        }, () => {
            return {
                isEnd: false,
                index: 0
            }
        });
        return new Ext(iterable);
    }
}
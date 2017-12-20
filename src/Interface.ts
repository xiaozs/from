/**
 * 键值对
 */
export interface KeyValuePair<T> {
    /**
     * 键
     */
    key: string;
    /**
     * 值
     */
    value: T;
}

/**
 * 将原生js对象当作map来使用
 */
export interface MapObject<T> {
    [key: string]: T;
}
export interface AggregateFunc<S, T> {
    (prev: S, current: T): S;
}
export interface Predicate<T> {
    (item: T, index: number): boolean;
}
export interface EqualityComparer<T> {
    (a: T, b: T): boolean;
}

export interface ValueComparer<T> {
    (a: T, b: T): number;
}

export interface Selector<I, O> {
    (item: I): O;
}

/**
 * 构造函数接口
 */
export interface IConstructor<T> {
    new (...args: any[]): T;
}
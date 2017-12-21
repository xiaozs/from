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

export interface MergeSelector<I1, I2, O> {
    (item1: I1, item2: I2): O;
}

/**
 * 构造函数接口
 */
export interface IConstructor<T> {
    new (...args: any[]): T;
}



export interface SortMessageCache<T> {
    keySelector: Selector<T, any>;
    valueComparer?: ValueComparer<T>;
    sortOrder: SortOrder;
}
export interface GroupParamWithComparer<TKey> {
    comparer: EqualityComparer<TKey>
}
export interface GroupParamWithElementSelector<T, TKey, TElement> {
    elementSelector: Selector<T, TElement>;
    comparer?: EqualityComparer<TKey>
}
export interface GroupParamWithResultSelector<T, TKey, TElement, TResult> {
    elementSelector?: Selector<T, TElement>;
    resultSelector: MergeSelector<T, Iterable<TElement>, TResult>,
    comparer?: EqualityComparer<TKey>
}
export type GroupParam<T, TKey, TElement, TResult> =
    GroupParamWithComparer<TKey> |
    GroupParamWithElementSelector<T, TKey, TElement> |
    GroupParamWithResultSelector<T, TKey, TElement, TResult>;

export enum SortOrder {
    ascending,
    descending
}
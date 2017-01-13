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

/**
 * 可枚举对象
 */
export interface Iterable<T> {
    /**
     * 生成枚举器
     */
    getIterator(): Iterator<T>
}

/**
 * 枚举器
 */
export interface Iterator<T> {
    /**
     * 获得枚举结果
     */
    next(): IterationResult<T>;
}

/**
 * 枚举结果
 */
export type IterationResult<T> = DoneIterationResult<T> | NotDoneIterationResult<T>;

/**
 * 已完成枚举结果
 */
export interface DoneIterationResult<T> {
    /**
     * 枚举是否已经结束
     */
    done: true;
}

/**
 * 未完成枚举结果
 */
export interface NotDoneIterationResult<T> {
    /**
     * 当前枚举的值
     */
    value: T;
    /**
     * 枚举是否已经结束
     */
    done: false;
}


export interface Predicate<T> {
    (item: T, index: number): boolean;
}
export interface Comparer<T> {
    (a: T, b: T): boolean;
}
export interface Selector<I, O> {
    (item: I): O;
}

/**
 * 构造函数接口
 */
export interface IConstructor<T> {
    new (): T;
}
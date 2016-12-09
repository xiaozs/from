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
export interface mapObject<T> {
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
    next(): Promise<IterationResult<T>>;
}

/**
 * 枚举结果
 */
export interface IterationResult<T> {
    /**
     * 当前枚举的值
     */
    value?: T;
    /**
     * 枚举是否已经结束
     */
    done: boolean;
}

/**
 * 数组或者字符串
 */
export interface ArrayOrString<T> {
    [index: number]: T;
    /**
     * 数组或者字符串的长度
     */
    length: number;
}
import { KeyValuePair, MapObject } from "Interface";
import * as Type from "Type";
import { Iterable, Iterator, IterationResult } from "Interface";

/**
 * 保存键值对的Map对象
 */
export default class Map<T> implements Iterable<KeyValuePair<T>>{
    /**
     * 用于存储键值对的数组
     */
    private keyValuePairArray_: KeyValuePair<T>[] = [];

    /**
     * @param mapObj 用于初始化的原生对象
     */
    constructor(mapObj?: MapObject<T>) {
        if (Type.isNotVoid(mapObj)) {
            for (let key in mapObj) {
                this.set(key, mapObj[key]);
            }
        }
    }

    /**
     * 查找键值所在的索引
     */
    private indexOf_(key: string): number {
        for (let i = 0; i < this.keyValuePairArray_.length; i++) {
            if (this.keyValuePairArray_[i].key === key) {
                return i;
            }
        }
        return -1;
    }

    /**
     * 通过键值判断是否存有该键值对
     * @param key 键值
     */
    has(key: string): boolean {
        return this.indexOf_(key) !== -1;
    }

    /**
     * 通过原生对象一次性设置多个键值对
     * @param mapObj 原生对象
     */
    set(mapObj: MapObject<T>): this;
    /**
     * 设置一对键值对
     * @param key 键
     * @param value 值
     */
    set(key: string, value: T): this;
    set(keyOrObject: string | MapObject<T>, value?: T): this {
        if (Type.isString(keyOrObject)) {
            this.setSingle_(keyOrObject, <T>value);
        } else {
            for (let key in keyOrObject) {
                this.setSingle_(key, keyOrObject[key]);
            }
        }
        return this;
    }

    /**
     * 设置单对键值对
     * @param key 键
     * @param value 值
     */
    private setSingle_(key: string, value: T): void {
        let index = this.indexOf_(key);
        if (index !== -1) {
            this.keyValuePairArray_[index].value = value;
        } else {
            this.keyValuePairArray_.push({
                key: key,
                value: value
            });
        }
    }

    /**
     * 通过键获取值
     * @key 键
     */
    get(key: string): T | undefined {
        let index = this.indexOf_(key);
        if (index !== -1) {
            return this.keyValuePairArray_[index].value;
        }
        return undefined;
    }

    /**
     * 返回当前对象中键值对的个数
     */
    count(): number {
        return this.keyValuePairArray_.length;
    }

    /**
     * 通过键值移除键值对
     * @param keys 键
     */
    remove(...keys: string[]): this {
        for (let key of keys) {
            let index = this.indexOf_(key);
            if (index !== -1) {
                this.keyValuePairArray_.splice(index, 1);
            }
        }
        return this;
    }

    /**
     * 清除当前对象中的所有键值对
     */
    clear(): this {
        this.keyValuePairArray_.length = 0;
        return this;
    }

    /**
     * 返回一个由所有键作为元素的原生数组
     */
    keys(): string[] {
        let arr: string[] = [];
        for (let KeyValuePair of this.keyValuePairArray_) {
            arr.push(KeyValuePair.key);
        }
        return arr;
    }

    /**
     * 返回一个由所有值作为元素的原生数组
     */
    values(): T[] {
        let arr: T[] = [];
        for (let i = 0; i < this.keyValuePairArray_.length; i++) {
            arr.push(this.keyValuePairArray_[i].value);
        }
        return arr;
    }

    /**
     * 返回一个由KeyValuePair对象组成的原生数组
     */
    keyValuePairs(): KeyValuePair<T>[] {
        return this.keyValuePairArray_.slice();
    }

    /**
     * 生成枚举器
     */
    getIterator(): Iterator<KeyValuePair<T>> {
        return new MapIterator(this);
    }
}

/**
 * Map类的枚举器
 */
class MapIterator<T> implements Iterator<KeyValuePair<T>>{
    private keyValuePairs_: KeyValuePair<T>[];
    private index_: number = 0;
    constructor(map: Map<T>) {
        this.keyValuePairs_ = map.keyValuePairs();
    }
    async next(): Promise<IterationResult<KeyValuePair<T>>> {
        let result: IterationResult<KeyValuePair<T>>;
        if (this.index_ < this.keyValuePairs_.length) {
            result = {
                value: this.keyValuePairs_[this.index_],
                done: false
            }
        } else {
            result = { done: true };
        }
        this.index_++;
        return result;
    }
}
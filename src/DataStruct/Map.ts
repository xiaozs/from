import { KeyValuePair, MapObject } from "./Interface";
import * as Type from "Type";

/**
 * 
 */
export default class Map<T> {
    private keyValuePairArray_: KeyValuePair<T>[] = [];
    constructor(mapObj?: MapObject<T>) {
        if (Type.isNotVoid(mapObj)) {
            for (let key in mapObj) {
                this.set(key, mapObj[key]);
            }
        }
    }
    private indexOf_(key: string): number {
        for (let i = 0; i < this.keyValuePairArray_.length; i++) {
            if (this.keyValuePairArray_[i].key === key) {
                return i;
            }
        }
        return -1;
    }
    has(key: string): boolean {
        return this.indexOf_(key) !== -1;
    }
    set(mapObj: MapObject<T>): this;
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
    get(key: string): T | undefined {
        let index = this.indexOf_(key);
        if (index !== -1) {
            return this.keyValuePairArray_[index].value;
        }
        return undefined;
    }
    count(): number {
        return this.keyValuePairArray_.length;
    }
    remove(...keys: string[]): this {
        for (let key of keys) {
            let index = this.indexOf_(key);
            if (index !== -1) {
                this.keyValuePairArray_.splice(index, 1);
            }
        }
        return this;
    }
    clear(): this {
        this.keyValuePairArray_.length = 0;
        return this;
    }
    keys(): string[] {
        let arr: string[] = [];
        for (let KeyValuePair of this.keyValuePairArray_) {
            arr.push(KeyValuePair.key);
        }
        return arr;
    }
    values(): T[] {
        let arr: T[] = [];
        for (let i = 0; i < this.keyValuePairArray_.length; i++) {
            arr.push(this.keyValuePairArray_[i].value);
        }
        return arr;
    }
    KeyValuePairs(): KeyValuePair<T>[] {
        return this.keyValuePairArray_.slice();
    }
}
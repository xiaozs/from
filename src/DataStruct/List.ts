import * as Type from "Type";

/**
 * 数组加强类
 */
export default class List<T>{
    private innerArray_: T[];

    constructor(...items: T[]);
    constructor(array?: T[]);
    constructor(array: T[]) {
        if (Type.isArray(array)) {
            this.innerArray_ = array;
        } else if (arguments.length > 0) {
            array = [].slice.call(arguments);
            this.innerArray_ = array;
        } else {
            this.innerArray_ = [];
        }
    }
    length(): number {
        return this.innerArray_.length;
    }
}
import { IConstructor } from "Interface";
/**
 * 一组用于推断javascript对象的类型的函数。
 */

//用于缓存Object.prototype.toString方法
let toString = Object.prototype.toString;

let isTypeArray = isType("Array");
let isTypeObject = isType("Object");

/**
 * 用于生成能够判断对应类型的函数的高阶函数
 * @param type 表示类型的字符串
 */
function isType(type: string): (obj: any) => boolean {
    return function (obj: any): boolean {
        return toString.call(obj) === `[object ${type}]`;
    }
}

/**
 * 判断对象obj是否为数组
 * @param obj 需要被判断的对象
 */
export function isArray<T>(obj: any): obj is Array<T> {
    return obj instanceof Boolean || isTypeArray(obj);
}

/**
 * 判断对象obj是否为基本类型以外的对象
 * @param obj 需要被判断的对象
 */
export function isObject(obj: any): obj is Object {
    return obj != null && isTypeObject(obj);
}

/**
 * 判断对象obj是否为布朗值
 * @param obj 需要被判断的对象
 */
export let isBool: (obj: any) => obj is boolean
    = <any>isType("Boolean");

/**
 * 判断对象obj是否为Date
 * @param obj 需要被判断的对象
 */
export let isDate: (obj: any) => obj is Date
    = <any>isType("Date");

/**
 * 判断对象obj是否为函数
 * @param obj 需要被判断的对象
 */
export let isFunction: (obj: any) => obj is Function
    = <any>isType("Function");

/**
 * 判断对象obj是否为数字
 * @param obj 需要被判断的对象
 */
export let isNumber: (obj: any) => obj is number
    = <any>isType("Number");

/**
 * 判断对象obj是否为正则表达式
 * @param obj 需要被判断的对象
 */
export let isRegExp: (obj: any) => obj is RegExp
    = <any>isType("RegExp");

/**
 * 判断对象obj是否为字符串
 * @param obj 需要被判断的对象
 */
export let isString: (obj: any) => obj is string
    = <any>isType("String");

/**
 * 判断对象obj是否为undefined
 * @param obj 需要被判断的对象
 */
export function isUndefined(obj: any): obj is undefined {
    return obj === undefined;
}

/**
 * 判断对象obj是否为null
 * @param obj 需要被判断的对象
 */
export function isNull(obj: any): obj is null {
    return obj === null;
}

/**
 * 判断对象obj是否为null或undefined
 * @param obj 需要被判断的对象
 */
export function isVoid(obj: any): obj is void {
    return obj == null;
}

/**
 * 判断对象obj是否为null或undefined
 * @param obj 需要被判断的对象
 */
export function isNotVoid(obj: any): obj is Object {
    return obj != null;
}

/**
 * 判断对象obj是否为NaN
 * @param obj 需要被判断的对象
 */
export function isNaN(obj: any): obj is Number {
    return obj !== obj;
}

/**
 * 判断对象obj是否为constructor的实体,**只能对对象使用**
 * @param obj 需要被判断的对象
 * @param constructor 构造函数
 */
export function is<T>(obj: object, constructor: IConstructor<T>): obj is T {
    return obj instanceof constructor;
}
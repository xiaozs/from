import * as Type from "Type";
QUnit.test("Type.isArray", assert => {
    class NewArray extends Array { }
    assert.ok(Type.isArray([]), "判断普通数组");
    assert.ok(Type.isArray(new Array), "判断由构造函数创建的数组");
    assert.ok(Type.isArray(new NewArray), "判断继承了Array的对象");
});
QUnit.test("Type.isObject", assert => {
    class NewClass { }
    class NewArray extends Array { }
    assert.ok(Type.isObject({}), "判断普通对象字面量");
    assert.ok(Type.isObject(new Object), "判断构造函数创造的对象");
    assert.ok(Type.isObject(new NewClass), "继承类型");

    assert.notOk(Type.isObject([]), "数组字面量");
    assert.notOk(Type.isObject(new Array), "数组构造函数");
    assert.notOk(Type.isObject(new NewArray), "继承数组");
    assert.notOk(Type.isObject(new Boolean), "Boolean");
    assert.notOk(Type.isObject(new Date), "Date");
    assert.notOk(Type.isObject(function () { }), "function字面量");
    assert.notOk(Type.isObject(new Boolean), "Boolean");
    assert.notOk(Type.isObject(new Date), "Date");
    assert.notOk(Type.isObject(new Function), "Function");
    assert.notOk(Type.isObject(new Number), "Number");
    assert.notOk(Type.isObject(new RegExp("")), "RegExp");
    assert.notOk(Type.isObject(new String), "String");
    assert.notOk(Type.isObject(void 0), "undefined");
    assert.notOk(Type.isObject(null), "null");
    assert.notOk(Type.isObject(NaN), "NaN");
});
QUnit.test("Type.isBool", assert => {
    assert.ok(Type.isBool(true), "判断字面量");
    assert.ok(Type.isBool(false), "判断字面量");
    assert.ok(Type.isBool(new Boolean(true)), "构造函数");
    assert.ok(Type.isBool(new Boolean(false)), "构造函数");
});
QUnit.test("Type.isDate", assert => {
    assert.ok(Type.isDate(new Date), "判断字面量");
});
QUnit.test("Type.isFunction", assert => {
    assert.ok(Type.isFunction(function () { }), "判断字面量");
    assert.ok(Type.isFunction(new Function), "构造函数");
});
QUnit.test("Type.isNumber", assert => {
    assert.ok(Type.isNumber(1), "整数");
    assert.ok(Type.isNumber(0), "0");
    assert.ok(Type.isNumber(1.1), "浮点数");
    assert.ok(Type.isNumber(-1), "负整数");
    assert.ok(Type.isNumber(-0), "-0");
    assert.ok(Type.isNumber(-1.1), "负浮点数");
    assert.ok(Type.isNumber(new Number), "构造函数");
    assert.ok(Type.isNumber(NaN), "NaN");
    assert.ok(Type.isNumber(Infinity), "Infinity");
});
QUnit.test("Type.isRegExp", assert => {
    assert.ok(Type.isRegExp(/^/), "字面量整数");
    assert.ok(Type.isRegExp(new RegExp("")), "构造函数");
});
QUnit.test("Type.isString", assert => {
    assert.ok(Type.isString(""), "字面量整数");
    assert.ok(Type.isString(new String("")), "构造函数");
});
QUnit.test("Type.isUndefined", assert => {
    assert.ok(Type.isUndefined(void 0), "undefined");
    assert.notOk(Type.isUndefined(null), "null");
});
QUnit.test("Type.isNull", assert => {
    assert.ok(Type.isNull(null), "null");
    assert.notOk(Type.isNull(void 0), "undefined");
});
QUnit.test("Type.isVoid", assert => {
    assert.ok(Type.isVoid(null), "null");
    assert.ok(Type.isVoid(void 0), "undefined");
});
QUnit.test("Type.isNotVoid", assert => {
    assert.ok(Type.isNotVoid({}), "object");

    assert.equal(Type.isNotVoid(null), false, "null");
    assert.equal(Type.isNotVoid(void 0), false, "undefined");
});
QUnit.test("Type.isNaN", assert => {
    assert.ok(Type.isNaN(NaN), "NaN");
});
QUnit.test("Type.is", assert => {
    class NewClass { }
    class NewClassEx extends NewClass { }
    assert.ok(Type.is(new NewClass, NewClass), "");
    assert.ok(Type.is(new NewClassEx, NewClass), "子对象，父构造");
    assert.ok(Type.is(new NewClassEx, Object), "子对象，Object");
});
import * as Type from "Type";
QUnit.test("Type.isArray", assert => {
    let arr: any = [];
    let str: any = "";
    assert.ok(Type.isArray(arr));
    assert.notOk(Type.isArray(str));
});
QUnit.test("Type.isArray支持继承自Array的对象", assert => {
    class MyArr extends Array { }
    assert.ok(Type.isArray(new MyArr));
});
QUnit.test("Type.isObject", assert => {
    let obj: any = {};
    let num: any = 1;
    assert.ok(Type.isObject(obj));
    assert.notOk(Type.isObject(num));
});
import from from "From";

QUnit.test("test", assert => {
    let arr = [1, 2, 3];
    let first = from(arr).first();
    assert.ok(arr[0] === first);
})
QUnit.test("test", assert => {
    let arr = [1, 2, 3];
    let first = from(arr).first(item => item >= 2);
    assert.ok(arr[1] === first);
})
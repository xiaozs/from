import from from "From";

QUnit.test("aggregate 只有1个参数时", assert => {
    let arr = [4, 5, 6, 7];
    let result = from(arr).aggregate((res, current) => {
        return res + current;
    });
    assert.ok(result === 22);


    let oneArr = [1];
    let result2 = from(oneArr).aggregate((res, current) => {
        return res + current;
    });
    assert.ok(result2 === 1);


    let emptyArr: number[] = [];
    assert.throws(function () {
        from(emptyArr).aggregate((res, current) => {
            return res + current;
        })
    })
})
QUnit.test("aggregate 有2个参数时", assert => {
    let arr = [4, 5, 6, 7];
    let result = from(arr).aggregate(10, (res, current) => {
        return res + current;
    });
    assert.ok(result === 32);


    let oneArr = [1];
    let result2 = from(oneArr).aggregate(10, (res, current) => {
        return res + current;
    });
    assert.ok(result2 === 11);


    let emptyArr: number[] = [];
    let result3 = from(emptyArr).aggregate(10, (res, current) => {
        return res + current;
    });
    assert.ok(result3 === 10);
})
QUnit.test("aggregate 有3个参数时", assert => {
    let arr = [4, 5, 6, 7];
    let result = from(arr).aggregate(10, (res, current) => {
        return res + current;
    }, res => res.toString());
    assert.ok(result === "32");


    let oneArr = [1];
    let result2 = from(oneArr).aggregate(10, (res, current) => {
        return res + current;
    }, res => res.toString());
    assert.ok(result2 === "11");


    let emptyArr: number[] = [];
    let result3 = from(emptyArr).aggregate(10, (res, current) => {
        return res + current;
    }, res => res.toString());
    assert.ok(result3 === "10");
})
QUnit.test("all 有0个参数时", assert => {
    let arr = [1, 2, 3];
    let result = from(arr).all();
    assert.ok(result === true);

    let emptyArr: number[] = [];
    let result2 = from(emptyArr).all();
    assert.ok(result2 === true);
})
QUnit.test("all 有1个参数时", assert => {
    let arr = [1, 2, 3];
    let result = from(arr).all(item => item >= 0);
    assert.ok(result === true);

    let emptyArr: number[] = [];
    let result2 = from(emptyArr).all(item => item >= 0);
    assert.ok(result2 === true);

    let arr3: number[] = [-1, -2];
    let result3 = from(arr3).all(item => item >= 0);
    assert.ok(result3 === false);
})
QUnit.test("any 有0个参数时", assert => {
    let arr = [1, 2, 3];
    let result = from(arr).any();
    assert.ok(result === true);

    let emptyArr: number[] = [];
    let result2 = from(emptyArr).any();
    assert.ok(result2 === false);
})
QUnit.test("any 有1个参数时", assert => {
    let arr = [1, 2, 3];
    let result = from(arr).any(item => item >= 0);
    assert.ok(result === true);

    let emptyArr: number[] = [];
    let result2 = from(emptyArr).any(item => item >= 0);
    assert.ok(result2 === false);

    let arr3: number[] = [-1, -2];
    let result3 = from(arr3).any(item => item >= 0);
    assert.ok(result3 === false);

    let arr4: number[] = [-1, -2];
    let result4 = from(arr3).any(item => item <= 0);
    assert.ok(result4 === true);
})
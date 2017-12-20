import from, { From } from "From";

QUnit.test("aggregate 只有1个参数 时", assert => {
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
    assert.throws(() => {
        from(emptyArr).aggregate((res, current) => {
            return res + current;
        })
    })
})
QUnit.test("aggregate 有2个参数 时", assert => {
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
QUnit.test("aggregate 有3个参数 时", assert => {
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
QUnit.test("all 有0个参数 时", assert => {
    let arr = [1, 2, 3];
    let result = from(arr).all();
    assert.ok(result === true);

    let emptyArr: number[] = [];
    let result2 = from(emptyArr).all();
    assert.ok(result2 === true);
})
QUnit.test("all 有1个参数 时", assert => {
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
QUnit.test("any 有0个参数 时", assert => {
    let arr = [1, 2, 3];
    let result = from(arr).any();
    assert.ok(result === true);

    let emptyArr: number[] = [];
    let result2 = from(emptyArr).any();
    assert.ok(result2 === false);
})
QUnit.test("any 有1个参数 时", assert => {
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
QUnit.test("average 有0个参数 时", assert => {
    let arr = [2, 4, 6, 8];
    let result = from(arr).average();
    assert.ok(result === 5);

    let strArr = ["2", "4", "6", "8"];
    assert.throws(() => {
        from(strArr).average();
    })
})
QUnit.test("average 有1个参数 时", assert => {
    let arr = ["2", "4", "6", "8"];
    let result = from(arr).average(item => parseFloat(item));
    assert.ok(result === 5);
})
QUnit.test("concat", assert => {
    let first = [1, 2, 3];
    let second = [4, 5, 6];
    let concatArr = from(first).concat(second).toArray();
    assert.deepEqual(concatArr, [1, 2, 3, 4, 5, 6]);
})
QUnit.test("contains 有1个参数 时", assert => {
    let arr = [1, 2, 3];
    let flag = from(arr).contains(2);
    assert.ok(flag);
})
QUnit.test("contains 有2个参数 时", assert => {
    let arr = ["test1", "test2"];
    let flag = from(arr).contains("test1", (value, item) => {
        return value === item;
    });
    assert.ok(flag);
})
QUnit.test("count 有0个参数 时", assert => {
    let arr = [1, 2, 3];
    let count = from(arr).count();
    assert.ok(count === 3);
})
QUnit.test("count 有1个参数 时", assert => {
    let arr = [1, 2, 3];
    let count = from(arr).count(item => {
        return item >= 2;
    });
    assert.ok(count === 2);
})
QUnit.test("defaultIfEmpty 测试数组不存在元素 时", assert => {
    let arr: number[] = [];
    let from1 = from(arr).defaultIfEmpty(1);
    let newArr = from1.toArray();
    assert.deepEqual(newArr, [1]);
})
QUnit.test("defaultIfEmpty 测试数组存在元素 时", assert => {
    let arr: number[] = [1, 2, 3];
    let from1 = from(arr).defaultIfEmpty(1);
    let newArr = from1.toArray();
    assert.deepEqual(newArr, [1, 2, 3]);
})
QUnit.test("distinct", assert => {
    let arr = [1, 2, 2, 3, 3, 4, 4, 5, 5, 6];
    let newArr = from(arr).distinct().toArray();
    assert.deepEqual(newArr, [1, 2, 3, 4, 5, 6]);
})
QUnit.test("elementAt 有1个参数 且 取存在元素的索引 时", assert => {
    let arr = [1, 2, 3];
    let item = from(arr).elementAt(2);
    assert.ok(item === 3);
})
QUnit.test("elementAt 有1个参数 且 取不存在元素的索引 时", assert => {
    let arr = [1, 2, 3];
    let item = from(arr).elementAt(3);
    assert.ok(item === undefined);
})
QUnit.test("elementAt 有1个参数 且 取存在元素的索引 且 该元素为null 时", assert => {
    let arr = [1, null, 3];
    let item = from(arr).elementAt(1);
    assert.ok(item === null);
})
QUnit.test("elementAt 有2个参数 且 取存在元素的索引 时", assert => {
    let arr = [1, 2, 3];
    let item = from(arr).elementAt(2, 100);
    assert.ok(item === 3);
})
QUnit.test("elementAt 有2个参数 且 取不存在元素的索引 时", assert => {
    let arr = [1, 2, 3];
    let item = from(arr).elementAt(3, 100);
    assert.ok(item === 100);
})
QUnit.test("elementAt 有2个参数 且 取不存在元素的索引 且 默认值为null 时", assert => {
    let arr: any[] = [1, 2, 3];
    let item = from(arr).elementAt(3, null);
    assert.ok(item === null);
})
QUnit.test("except 有1个参数 时", assert => {
    let first = [1, 2, 3, 4, 5, 6];
    let second = [2, 3, 4, 5];
    let newArr = from(first).except(second).toArray();
    assert.deepEqual(newArr, [1, 6]);
})
QUnit.test("except 有2个参数 时", assert => {
    let first = ["a admin", "b admin", "c", "d test"];
    let second = ["admin", "test"];
    let newArr = from(first).except(second, (item1, item2) => {
        return item1.indexOf(item2) !== -1;
    }).toArray();
    assert.deepEqual(newArr, ["c"]);
})
QUnit.test("first 有0个参数 且 不存在元素 时", assert => {
    let arr: any[] = [];
    let res = from(arr).first();
    assert.ok(res === undefined);
})
QUnit.test("first 有0个参数 且 存在元素 时", assert => {
    let arr: any[] = [1, 2, 3];
    let res = from(arr).first();
    assert.ok(res === 1);
})
QUnit.test("first 有1个参数 且 存在元素 且 存在合乎条件元素 时", assert => {
    let arr: any[] = [1, 2, 3];
    let res = from(arr).first(item => {
        return item >= 2;
    });
    assert.ok(res === 2);
})
QUnit.test("first 有1个参数 且 存在元素 且 不存在合乎条件元素 时", assert => {
    let arr: any[] = [1, 2, 3];
    let res = from(arr).first(item => {
        return item >= 4;
    });
    assert.ok(res === undefined);
})
QUnit.test("first 有2个参数 且 存在元素 且 存在合乎条件元素 时", assert => {
    let arr: any[] = [1, 2, 3];
    let res = from(arr).first(item => {
        return item >= 2;
    }, 100);
    assert.ok(res === 2);
})
QUnit.test("first 有2个参数 且 存在元素 且 不存在合乎条件元素 时", assert => {
    let arr: any[] = [1, 2, 3];
    let res = from(arr).first(item => {
        return item >= 4;
    }, 100);
    assert.ok(res === 100);
})
QUnit.test("intersect 有1个参数 时", assert => {
    let first = [1, 2, 3];
    let second = [2, 3, 4];
    let newArr = from(first).intersect(second).toArray();
    assert.deepEqual(newArr, [2, 3]);
})
QUnit.test("intersect 有2个参数 时", assert => {
    let first = [{ value: 1 }, { value: 2 }, { value: 3 }];
    let second = [{ value: 2 }, { value: 3 }, { value: 4 }];
    let newArr = from(first).intersect(second, (item1, item2) => {
        return item1.value === item2.value;
    }).toArray();
    assert.deepEqual(newArr, [{ value: 2 }, { value: 3 }]);
})
QUnit.test("last 有0个参数 且 不存在元素 时", assert => {
    let arr: any[] = [];
    let res = from(arr).last();
    assert.ok(res === undefined);
})
QUnit.test("last 有0个参数 且 存在元素 时", assert => {
    let arr: any[] = [1, 2, 3];
    let res = from(arr).last();
    assert.ok(res === 3);
})
QUnit.test("last 有1个参数 且 存在元素 且 存在合乎条件元素 时", assert => {
    let arr: any[] = [1, 2, 3];
    let res = from(arr).last(item => {
        return item >= 2;
    });
    assert.ok(res === 3);
})
QUnit.test("last 有1个参数 且 存在元素 且 不存在合乎条件元素 时", assert => {
    let arr: any[] = [1, 2, 3];
    let res = from(arr).last(item => {
        return item >= 4;
    });
    assert.ok(res === undefined);
})
QUnit.test("last 有2个参数 且 存在元素 且 存在合乎条件元素 时", assert => {
    let arr: any[] = [1, 2, 3];
    let res = from(arr).last(item => {
        return item >= 2;
    }, 100);
    assert.ok(res === 3);
})
QUnit.test("last 有2个参数 且 存在元素 且 不存在合乎条件元素 时", assert => {
    let arr: any[] = [1, 2, 3];
    let res = from(arr).last(item => {
        return item >= 4;
    }, 100);
    assert.ok(res === 100);
})
QUnit.test("max 有0个参数 时", assert => {
    let arr: any[] = [1, 2, 3];
    let max = from(arr).max();
    assert.ok(max === 3);
})
QUnit.test("min 有0个参数 且 数组元素不为number 时", assert => {
    let arr = [{ value: 1 }, { value: 2 }, { value: 3 }];
    assert.throws(() => {
        let max = from(arr).max();
    })
})
QUnit.test("max 有1个参数 时", assert => {
    let arr: any[] = [{ value: 1 }, { value: 2 }, { value: 3 }];
    let max = from(arr).max(item => {
        return item.value;
    });
    assert.deepEqual(max, { value: 3 });
})
QUnit.test("min 有0个参数 且 数组元素为number 时", assert => {
    let arr: any[] = [1, 2, 3];
    let min = from(arr).min();
    assert.ok(min === 1);
})
QUnit.test("min 有0个参数 且 数组元素不为number 时", assert => {
    let arr = [{ value: 1 }, { value: 2 }, { value: 3 }];
    assert.throws(() => {
        let min = from(arr).min();
    })
})
QUnit.test("min 有1个参数 时", assert => {
    let arr: any[] = [{ value: 1 }, { value: 2 }, { value: 3 }];
    let min = from(arr).min(item => {
        return item.value;
    });
    assert.deepEqual(min, { value: 1 });
})
QUnit.test("ofType", assert => {
    let newArr;

    newArr = from([1, true, 2]).ofType("Boolean").toArray();
    assert.deepEqual(newArr, [true]);

    let date = new Date;
    newArr = from([1, date, 2]).ofType("Date").toArray();
    assert.deepEqual(newArr, [date]);

    let fn = () => { };
    newArr = from([1, fn, 2]).ofType("Function").toArray();
    assert.deepEqual(newArr, [fn]);

    newArr = from(["1", 2, "3"]).ofType("Number").toArray();
    assert.deepEqual(newArr, [2]);

    newArr = from(["1", /^/, "3"]).ofType("RegExp").toArray();
    assert.deepEqual(newArr, [/^/]);

    newArr = from([1, "2", 2]).ofType("String").toArray();
    assert.deepEqual(newArr, ["2"]);

    let NewClass = class { };
    let obj = new NewClass;
    newArr = from([1, obj, 2]).ofType(NewClass).toArray();
    assert.deepEqual(newArr, [obj]);
})
QUnit.test("select", assert => {
    let arr = [{ value: 1 }, { value: 2 }, { value: 3 }];
    let newArr = from(arr).select(item => item.value).toArray();
    assert.deepEqual(newArr, [1, 2, 3]);
})
QUnit.test("selectMany 有1个参数 时", assert => {
    let arr = [{
        innerArr: [1, 2, 3]
    }, {
        innerArr: [4, 5, 6]
    }];
    let newArr = from(arr).selectMany(item => item.innerArr).toArray();
    assert.deepEqual(newArr, [1, 2, 3, 4, 5, 6]);
})
QUnit.test("selectMany 有2个参数 时", assert => {
    let arr = [{
        innerArr: [1, 2, 3]
    }, {
        innerArr: [4, 5, 6]
    }];
    let newArr = from(arr).selectMany(item => item.innerArr, (item, value) => value * value).toArray();
    assert.deepEqual(newArr, [1, 4, 9, 16, 25, 36]);
})
QUnit.test("SequenceEqual 有1个参数 时", assert => {
    let first: number[];
    let second: number[];
    let flag: boolean;

    first = [1, 2, 3, 4];
    second = [1, 2, 3, 4];
    flag = from(first).sequenceEqual(second);
    assert.ok(flag === true);

    first = [1, 2, 3, 4];
    second = [1, 2, 3];
    flag = from(first).sequenceEqual(second);
    assert.ok(flag === false);
})
QUnit.test("SequenceEqual 有2个参数 时", assert => {
    let first: any[];
    let second: any[];
    let flag: boolean;

    first = [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }];
    second = [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }];
    flag = from(first).sequenceEqual(second, (item1, item2) => item1.value === item2.value);
    assert.ok(flag === true);

    first = [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }];
    second = [{ value: 1 }, { value: 2 }, { value: 3 }];
    flag = from(first).sequenceEqual(second, (item1, item2) => item1.value === item2.value);
    assert.ok(flag === false);
})
QUnit.test("single 有0个参数 且 无元素 时", assert => {
    let arr: number[] = [];
    assert.throws(() => {
        let res = from(arr).single();
    })
})
QUnit.test("single 有0个参数 且 有1个元素 时", assert => {
    let arr: number[] = [1];
    let res = from(arr).single();
    assert.ok(res === 1);
})
QUnit.test("single 有0个参数 且 有多个元素 时", assert => {
    let arr: number[] = [1, 2];
    assert.throws(() => {
        let res = from(arr).single();
    })
})
QUnit.test("single 有1个参数 且 无元素 时", assert => {
    let arr: number[] = [];
    assert.throws(() => {
        let res = from(arr).single(item => item === 4);
    })
})
QUnit.test("single 有1个参数 且 无符合元素 时", assert => {
    let arr = [1, 2, 3];
    assert.throws(() => {
        let res = from(arr).single(item => item === 4);
    })
})
QUnit.test("single 有1个参数 且 有单个符合元素 时", assert => {
    let arr = [1, 2, 3, 4];
    let res = from(arr).single(item => item === 4);
    assert.ok(res === 4);
})
QUnit.test("single 有1个参数 且 有多个符合元素 时", assert => {
    let arr = [1, 2, 3, 4, 4];
    assert.throws(() => {
        let res = from(arr).single(item => item === 4);
    })
})
QUnit.test("single 有2个参数 且 无元素 时", assert => {
    let arr: number[] = [];
    let res = from(arr).single(item => item === 4, 100);
    assert.ok(res === 100);
})
QUnit.test("single 有2个参数 且 无符合元素 时", assert => {
    let arr = [1, 2, 3];
    let res = from(arr).single(item => item === 4, 100);
    assert.ok(res === 100);
})
QUnit.test("single 有2个参数 且 有单个符合元素 时", assert => {
    let arr = [1, 2, 3, 4];
    let res = from(arr).single(item => item === 4, 100);
    assert.ok(res === 4);
})
QUnit.test("single 有2个参数 且 有多个符合元素 时", assert => {
    let arr = [1, 2, 3, 4, 4];
    let res = from(arr).single(item => item === 4, 100);
    assert.ok(res === 100);
})
QUnit.test("skip 索引处存在元素 时", assert => {
    let arr = [1, 2, 3, 4];
    let newArr = from(arr).skip(2).toArray();
    assert.deepEqual(newArr, [3, 4]);
})
QUnit.test("skip 索引处不存在元素 时", assert => {
    let arr = [1, 2, 3, 4];
    let newArr = from(arr).skip(10).toArray();
    assert.deepEqual(newArr, []);
})
QUnit.test("skipWhile 不存在元素", assert => {
    let arr: number[] = [];
    let newArr = from(arr).skipWhile(item => item <= 3).toArray();
    assert.deepEqual(newArr, []);
})
QUnit.test("skipWhile 存在合法元素", assert => {
    let arr = [1, 2, 3, 4, 5];
    let newArr = from(arr).skipWhile(item => item <= 3).toArray();
    assert.deepEqual(newArr, [4, 5]);
})
QUnit.test("skipWhile 不存在合法元素", assert => {
    let arr = [1, 2, 3, 4, 5];
    let newArr = from(arr).skipWhile(item => item <= 6).toArray();
    assert.deepEqual(newArr, []);
})
QUnit.test("sum 有0个参数 且 不存在元素 时", assert => {
    let arr: number[] = [];
    let res = from(arr).sum();
    assert.ok(res === 0);
})
QUnit.test("sum 有0个参数 且 存在数字元素 时", assert => {
    let arr = [1, 2, 3];
    let res = from(arr).sum();
    assert.ok(res === 6);
})
QUnit.test("sum 有0个参数 且 存在非数字元素 时", assert => {
    let arr = [{ value: 1 }, { value: 2 }, { value: 3 }];
    assert.throws(() => {
        let res = from(arr).sum();
    })
})
QUnit.test("sum 有1个参数 且 不存在元素 时", assert => {
    let arr: number[] = [];
    let res = from(arr).sum(item => item);
    assert.ok(res === 0);
})
QUnit.test("sum 有1个参数 且 存在数字元素 时", assert => {
    let arr = [1, 2, 3];
    let res = from(arr).sum(item => item);
    assert.ok(res === 6);
})
QUnit.test("sum 有1个参数 且 存在非数字元素 时", assert => {
    let arr = [{ value: 1 }, { value: 2 }, { value: 3 }];
    let res = from(arr).sum(item => item.value);
    assert.ok(res === 6);
})
QUnit.test("take 不超限 时", assert => {
    let arr = [1, 2, 3, 4];
    let newArr = from(arr).take(2).toArray();
    assert.deepEqual(newArr, [1, 2]);
})
QUnit.test("take 超限 时", assert => {
    let arr = [1, 2, 3, 4];
    let newArr = from(arr).take(5).toArray();
    assert.deepEqual(newArr, [1, 2, 3, 4]);
})
QUnit.test("takeWhile 不存在元素", assert => {
    let arr: number[] = [];
    let newArr = from(arr).takeWhile(item => item <= 3).toArray();
    assert.deepEqual(newArr, []);
})
QUnit.test("takeWhile 存在合法元素", assert => {
    let arr = [1, 2, 3, 4, 5];
    let newArr = from(arr).takeWhile(item => item <= 3).toArray();
    assert.deepEqual(newArr, [1, 2, 3]);
})
QUnit.test("takeWhile 不存在合法元素", assert => {
    let arr = [1, 2, 3, 4, 5];
    let newArr = from(arr).takeWhile(item => item <= 0).toArray();
    assert.deepEqual(newArr, []);
})
QUnit.test("toArray", assert => {
    let arr = [1, 2, 3];
    let newArr = from(arr).toArray();
    assert.deepEqual(newArr, [1, 2, 3]);
})
QUnit.test("toList", assert => {
    let arr = [1, 2, 3];
    let newArr = from(arr).toList().toArray();
    assert.deepEqual(newArr, [1, 2, 3]);
})
QUnit.test("union 有1个参数 且 有重复元素 时", assert => {
    let first = [1, 2, 3];
    let second = [1, 2, 3];
    let newArr = from(first).union(second).toArray();
    assert.deepEqual(newArr, [1, 2, 3]);
})
QUnit.test("union 有1个参数 且 有部分重复元素 时", assert => {
    let first = [1, 2, 3];
    let second = [2, 3, 4];
    let newArr = from(first).union(second).toArray();
    assert.deepEqual(newArr, [1, 2, 3, 4]);
})
QUnit.test("union 有1个参数 且 无重复元素 时", assert => {
    let first = [1, 2, 3];
    let second = [4, 5, 6];
    let newArr = from(first).union(second).toArray();
    assert.deepEqual(newArr, [1, 2, 3, 4, 5, 6]);
})
QUnit.test("where", assert => {
    let arr = [1, 2, 3, 4, 5, 6];
    let newArr = from(arr).where(item => item % 2 === 0).toArray();
    assert.deepEqual(newArr, [2, 4, 6]);
})
QUnit.test("where", assert => {
    let arr = [1, 2, 3, 4, 5, 6];
    let newArr = from(arr).where(item => item % 2 === 0).toArray();
    assert.deepEqual(newArr, [2, 4, 6]);
})
QUnit.test("zip 无元素 时", assert => {
    let first: number[] = [];
    let seconde = [4, 5, 6];
    let newArr = from(first).zip(seconde, (item1, item2) => {
        return item1 + item2;
    }).toArray();
    assert.deepEqual(newArr, []);
})
QUnit.test("zip 有同等数量元素 时", assert => {
    let first = [1, 2, 3];
    let seconde = [4, 5, 6];
    let newArr = from(first).zip(seconde, (item1, item2) => {
        return item1 + item2;
    }).toArray();
    assert.deepEqual(newArr, [5, 7, 9]);
})
QUnit.test("zip 有不等数量元素 时", assert => {
    let first = [1];
    let seconde = [4, 5, 6];
    let newArr = from(first).zip(seconde, (item1, item2) => {
        return item1 + item2;
    }).toArray();
    assert.deepEqual(newArr, [5]);

    first = [1, 2, 3];
    seconde = [4];
    newArr = from(first).zip(seconde, (item1, item2) => {
        return item1 + item2;
    }).toArray();
    assert.deepEqual(newArr, [5]);
})
QUnit.test("append", assert => {
    let arr = [1, 2];
    let newArr = from(arr).append(3).toArray();
    assert.deepEqual(newArr, [1, 2, 3]);
})
QUnit.test("prepend", assert => {
    let arr = [2, 3];
    let newArr = from(arr).prepend(1).toArray();
    assert.deepEqual(newArr, [1, 2, 3]);
})
QUnit.test("orderBy 对数字进行排序时", assert => {
    let arr = [2, 1, 3];
    let newArr = from(arr).orderBy(it => it).toArray();
    assert.deepEqual(newArr, [1, 2, 3]);
})
QUnit.test("orderBy 对字符串进行排序时", assert => {
    let arr = ["b", "a", "c"];
    let newArr = from(arr).orderBy(it => it).toArray();
    assert.deepEqual(newArr, ["a", "b", "c"]);
})
QUnit.test("orderByDescending 对数字进行排序时", assert => {
    let arr = [2, 1, 3];
    let newArr = from(arr).orderByDescending(it => it).toArray();
    assert.deepEqual(newArr, [3, 2, 1]);
})
QUnit.test("orderByDescending 对字符串进行排序时", assert => {
    let arr = ["b", "a", "c"];
    let newArr = from(arr).orderByDescending(it => it).toArray();
    assert.deepEqual(newArr, ["c", "b", "a"]);
})
QUnit.test("orderBy 对特定对象进行排序时", assert => {
    let arr = [{ value: 2 }, { value: 1 }, { value: 3 }];
    let newArr = from(arr).orderBy(it => it.value).toArray();
    assert.deepEqual(newArr, [{ value: 1 }, { value: 2 }, { value: 3 }]);
})
QUnit.test("orderByDescending 对特定对象进行排序时", assert => {
    let arr = [{ value: 2 }, { value: 1 }, { value: 3 }];
    let newArr = from(arr).orderByDescending(it => it.value).toArray();
    assert.deepEqual(newArr, [{ value: 3 }, { value: 2 }, { value: 1 }]);
})
QUnit.test("thenBy 对特定对象进行排序时", assert => {
    let arr = [{ value1: 2, value2: 2 }, { value1: 2, value2: 3 }, { value1: 2, value2: 1 }, { value1: 1, value2: 1 }, { value1: 3, value2: 1 }];
    let newArr = from(arr).orderBy(it => it.value1).thenBy(it => it.value2).toArray();
    assert.deepEqual(newArr, [
        { value1: 1, value2: 1 },
        { value1: 2, value2: 1 },
        { value1: 2, value2: 2 },
        { value1: 2, value2: 3 },
        { value1: 3, value2: 1 }
    ]);
})
QUnit.test("thenByDescending 对特定对象进行排序时", assert => {
    let arr = [{ value1: 2, value2: 2 }, { value1: 2, value2: 3 }, { value1: 2, value2: 1 }, { value1: 1, value2: 1 }, { value1: 3, value2: 1 }];
    let newArr = from(arr).orderBy(it => it.value1).thenByDescending(it => it.value2).toArray();
    assert.deepEqual(newArr, [
        { value1: 1, value2: 1 },
        { value1: 2, value2: 3 },
        { value1: 2, value2: 2 },
        { value1: 2, value2: 1 },
        { value1: 3, value2: 1 }
    ]);
})
QUnit.test("reverse", assert => {
    let arr = [1, 2, 3, 4];
    let newArr = from(arr).reverse().toArray();
    assert.deepEqual(newArr, [4, 3, 2, 1]);
})
QUnit.test("join outer项数相同时", assert => {
    let outer = [
        { id: 1, name: "name1" },
        { id: 2, name: "name2" },
        { id: 3, name: "name3" }
    ];
    let inner = [
        { id: 1, age: 1 },
        { id: 2, age: 2 },
        { id: 3, age: 3 }
    ];

    let newArr = from(outer).join(
        inner,
        outerIt => outerIt.id,
        innerIt => innerIt.id,
        (outerIt, innerIt) => {
            return {
                name: outerIt.name,
                age: innerIt.age
            }
        }
    ).toArray();
    assert.deepEqual(newArr, [
        { name: "name1", age: 1 },
        { name: "name2", age: 2 },
        { name: "name3", age: 3 }
    ]);
})
QUnit.test("join outer项数较多时", assert => {
    let outer = [
        { id: 1, name: "name1" },
        { id: 2, name: "name2" },
        { id: 3, name: "name3" },
        { id: 4, name: "name4" }
    ];
    let inner = [
        { id: 1, age: 1 },
        { id: 2, age: 2 },
        { id: 3, age: 3 }
    ];

    let newArr = from(outer).join(
        inner,
        outerIt => outerIt.id,
        innerIt => innerIt.id,
        (outerIt, innerIt) => {
            return {
                name: outerIt.name,
                age: innerIt.age
            }
        }
    ).toArray();
    assert.deepEqual(newArr, [
        { name: "name1", age: 1 },
        { name: "name2", age: 2 },
        { name: "name3", age: 3 }
    ]);
})
QUnit.test("join inner项数较多时", assert => {
    let outer = [
        { id: 1, name: "name1" },
        { id: 2, name: "name2" },
        { id: 3, name: "name3" }
    ];
    let inner = [
        { id: 1, age: 1 },
        { id: 2, age: 2 },
        { id: 3, age: 3 },
        { id: 4, age: 4 }
    ];

    let newArr = from(outer).join(
        inner,
        outerIt => outerIt.id,
        innerIt => innerIt.id,
        (outerIt, innerIt) => {
            return {
                name: outerIt.name,
                age: innerIt.age
            }
        }
    ).toArray();
    assert.deepEqual(newArr, [
        { name: "name1", age: 1 },
        { name: "name2", age: 2 },
        { name: "name3", age: 3 }
    ]);
})
QUnit.test("join 乱序时", assert => {
    let outer = [
        { id: 3, name: "name3" },
        { id: 1, name: "name1" },
        { id: 2, name: "name2" },
    ];
    let inner = [
        { id: 1, age: 1 },
        { id: 2, age: 2 },
        { id: 3, age: 3 },
        { id: 4, age: 4 }
    ];

    let newArr = from(outer).join(
        inner,
        outerIt => outerIt.id,
        innerIt => innerIt.id,
        (outerIt, innerIt) => {
            return {
                name: outerIt.name,
                age: innerIt.age
            }
        }
    ).orderBy(it => it.age).toArray();
    assert.deepEqual(newArr, [
        { name: "name1", age: 1 },
        { name: "name2", age: 2 },
        { name: "name3", age: 3 }
    ]);
})
QUnit.test("join 使用comparer", assert => {
    let outer = [
        { idObj: { hash: "3" }, name: "name3" },
        { idObj: { hash: "1" }, name: "name1" },
        { idObj: { hash: "2" }, name: "name2" },
    ];
    let inner = [
        { idObj: { hash: "1" }, age: 1 },
        { idObj: { hash: "2" }, age: 2 },
        { idObj: { hash: "3" }, age: 3 },
        { idObj: { hash: "4" }, age: 4 },
    ];

    let newArr = from(outer).join(
        inner,
        outerIt => outerIt.idObj,
        innerIt => innerIt.idObj,
        (outerIt, innerIt) => {
            return {
                name: outerIt.name,
                age: innerIt.age
            }
        },
        (outerKey, innerKey) => {
            return outerKey.hash === innerKey.hash
        }
    ).orderBy(it => it.age).toArray();
    assert.deepEqual(newArr, [
        { name: "name1", age: 1 },
        { name: "name2", age: 2 },
        { name: "name3", age: 3 }
    ]);
})







QUnit.test("range", assert => {
    let arr = From.range(1, 5).toArray();
    assert.deepEqual(arr, [1, 2, 3, 4, 5]);
})
QUnit.test("repeat", assert => {
    let arr = From.repeat(1, 5).toArray();
    assert.deepEqual(arr, [1, 1, 1, 1, 1]);
})
QUnit.test("empty", assert => {
    let arr = From.empty().toArray();
    assert.deepEqual(arr, []);
})
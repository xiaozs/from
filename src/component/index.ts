
abstract class BaseNode {
    private _dom?: Node;
    get dom() {
        return this._dom;
    }

    protected abstract $createDom(): Node;
    abstract toString(): string;
    abstract toHtml(): string;
}
abstract class NormalNode extends BaseNode {
    tagName: string;
    abstract toString(): string;
    abstract toHtml(): string;
}
abstract class SelfCloseNode extends NormalNode {
    abstract toString(): string;
    abstract toHtml(): string;
}

function encode(str: string) {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

class TextNode extends BaseNode/* implements String */ {
    constructor(content: string = "") {
        super();
        this._content = content;
        return new Proxy(this, {
            get: function (target, key) {
                if (key in this) {
                    return this[key];
                } else {
                    return this.content[key];
                }
            }
        })
    }
    private _content: string;
    get content() {
        return this._content;
    }
    set content(content) {
        this._content = content;
        if (this.dom) {
            this.dom.nodeValue = content;
        }
    }
    protected $createDom() {
        return document.createTextNode(this.content);
    }
    toString() {
        return this._content;
    }
    toHtml() {
        return encode(this._content);
    }



    *[Symbol.iterator]() {
        for (let key in []) {
            yield "";
        }
    }
    charAt(pos: number): string { return "" }
    charCodeAt(index: number): number { return 0 }
    concat(...strings: string[]): string { return "" }
    indexOf(searchString: string, position?: number): number { return 0 }
    lastIndexOf(searchString: string, position?: number): number { return 0 }
    localeCompare(that: string): number { return 0 }
    match(regexp: string | RegExp): RegExpMatchArray | null { return null }
    replace(searchValue: string | RegExp, replaceValue: string): string;
    replace(searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string;
    replace() { return "" }
    search(regexp: string | RegExp): number { return 0 }
    slice(start?: number, end?: number): string { return "" }
    split(separator: string | RegExp, limit?: number): string[] { return [""] }
    substring(start: number, end?: number): string { return "" }
    toLowerCase(): string { return "" }
    toLocaleLowerCase(): string { return "" }
    toUpperCase(): string { return "" }
    toLocaleUpperCase(): string { return "" }
    trim(): string { return "" }
    substr(from: number, length?: number): string { return "" }
    valueOf(): string { return "" }

    readonly [index: number]: string;
    get length() {
        return this._content.length;
    }
}

abstract class Component {
    append() {

    }
    appendTo() {

    }
    prepend() {

    }
    prependTo() {

    }
    after() {

    }
    before() {

    }
    insertAfter() {

    }
    insertBefore() {

    }
    replaceWith() {

    }
    empty() {

    }
    remove() {

    }
    clone() {

    }
    attr() {

    }
    removeAttr() {

    }
    addClass() {

    }
    removeClass() {

    }
    toggleClass() {

    }

    children() {

    }
    parent() {

    }
    next() {

    }
    nextAll() {

    }
    prev() {

    }
    prevAll() {

    }
    siblings() {

    }
    on() {

    }
    off() {

    }
    one() {

    }
    trigger() {

    }
    width() {

    }
    height() {

    }
    scrollTop() {

    }
    scriollLeft() {

    }
    position() {

    }
    offset() {

    }
    css() {

    }

    toHTML() {

    }
    renderTo() {

    }

    offsetParent() {

    }
}
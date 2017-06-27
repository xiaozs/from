import { encode } from "Utils";
abstract class BaseNode {
    private _dom: Node | null = null;
    get dom() {
        return this._dom;
    }
    private _parent: NormalNode | null = null;
    get parent() {
        return this._parent;
    }
    protected abstract $createDom(): Node;
    abstract toHtml(): string;
}
class TextNode extends BaseNode {
    constructor(content: string = "") {
        super();
        this._content = content;
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
}
abstract class TagNode extends BaseNode {
    readonly tagName: string;
    constructor(tagName: string) {
        super();
        this.tagName = tagName;
    }
    protected $createDom(): Node {
        return document.createElement(this.tagName);
    }
    private _children: Children;
    get children() {
        return this._children;
    }
}
class SelfCloseNode extends TagNode {
    toHtml(): string {
        return `<${this.tagName} />`
    }
}
class NormalNode extends TagNode {
    toHtml(): string {
        let tagName = this.tagName;
        return `<${tagName}>${this.children.toHtml()}</${tagName}>`
    }
}

class Children {
    toHtml(): string {
        return "";
    }
}

function nodeFactory(tagName: string) {
    switch (tagName) {
        case "area":
        case "br":
        case "col":
        case "embed":
        case "hr":
        case "img":
        case "input":
        case "link":
        case "meta":
        case "param":

        case "base":
        case "basefont":
        case "frame":
        case "keygen":
        case "source":
            return new SelfCloseNode(tagName);
        default:
            return new NormalNode(tagName);
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
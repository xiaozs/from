import { encode } from "Utils";
/**
 * 虚拟节点基础类
 */
abstract class BaseNode {
    /**
     * 保存虚拟节点对应的真实的dom
     */
    private _dom: Node | null = null;
    /**
     * 获取虚拟节点对应的真实的dom
     */
    get dom() {
        return this._dom;
    }
    /**
     * 保存虚拟节点的父节点
     */
    private _parent: NormalNode | null = null;
    /**
     * 获取虚拟节点的父节点
     */
    get parent() {
        return this._parent;
    }
    /**
     * 生成虚拟节点的真实dom
     */
    protected abstract $createDom(): Node;
    /**
     * 将虚拟渲染成html字符串
     */
    abstract toHtml(): string;
}
/**
 * Text节点的虚拟节点
 */
class TextNode extends BaseNode {
    /**
     * Text节点的虚拟节点
     * @param content 内容字符串
     */
    constructor(content: string = "") {
        super();
        this._content = content;
    }
    /**
     * 保存节点内容字符串
     */
    private _content: string;
    /**
     * 获取节点内容字符串
     */
    get content() {
        return this._content;
    }
    /**
     * 设置节点内容字符串
     */
    set content(content) {
        this._content = content;
        if (this.dom) {
            this.dom.nodeValue = content;
        }
    }
    /**
     * 生成虚拟节点的真实dom
     */
    protected $createDom() {
        return document.createTextNode(this.content);
    }
    /**
     * 将虚拟渲染成html字符串
     */
    toHtml() {
        return encode(this._content);
    }
}
/**
 * 带标签的虚拟节点
 */
abstract class TagNode extends BaseNode {
    /**
     * 标签名称
     */
    readonly tagName: string;
    /**
     * 命名空间
     */
    readonly namespace: string;
    /**
     * 带标签的虚拟节点
     * @param tagName 标签名称
     * @param namespace 命名空间
     */
    constructor(tagName: string, namespace: string = "") {
        super();
        this.tagName = tagName;
        this.namespace = namespace;
    }
    /**
     * 生成虚拟节点的真实dom
     */
    protected $createDom(): Node {
        if (this.namespace) {
            return document.createAttributeNS(this.tagName, this.namespace);
        } else {
            return document.createElement(this.tagName);
        }
    }
    /**
     * 保存子节点集合
     */
    private _children: Children;
    /**
     * 获取子节点集合
     */
    get children() {
        return this._children;
    }
}
/**
 * 自闭合元素的虚拟节点
 */
class SelfCloseNode extends TagNode {
    toHtml(): string {
        return `<${this.tagName} />`
    }
}
/**
 * 普通元素的虚拟节点
 */
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
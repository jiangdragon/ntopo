/**
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2016/3/25
 */
com.plugin(function (com) {
    var has = "hasOwnProperty";
    var Str = String;
    var SVG_NS = "http://www.w3.org/2000/svg";
    var SVG_XLINK = "http://www.w3.org/1999/xlink";
    var SVG_XA3 = "http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/";
    var is = com.util.is;

    var svg = com.svg = com.svg || {};

    /**
     * @public 属性
     */
    svg.supported = (function () {
        return !!document.createElementNS
            && !!document.createElementNS(SVG_NS, "svg").createSVGRect;
    })();
    /**
     * @public 创建SVG片断
     * @param x
     * @param y
     * @param width
     * @param height
     * @param nsp
     * @param vbx
     * @param vby
     * @param vbw
     * @param vbh
     * @returns {SVGDOM}
     */
    svg.svg = function (x, y, width, height, nsp, vbx, vby, vbw, vbh) {
        var attrs = {};
        if (is(x, "object") && y == null) {
            attrs = x;
        } else {
            if (x != null) {
                attrs.x = x;
            }
            if (y != null) {
                attrs.y = y;
            }
            if (width != null) {
                attrs.width = width;
            }
            if (nsp != null && nsp == true) {
                attrs["xmlns"] = SVG_NS;
                attrs["version"] = "1.1";
                attrs["xmlns:xlink"] = SVG_XLINK;
            }
            if (height != null) {
                attrs.height = height;
            }
            if (vbx != null && vby != null && vbw != null && vbh != null) {
                attrs.viewBox = [vbx, vby, vbw, vbh];
            }
        }
        return svg.el("svg", attrs);
    }
    /**
     * @public 组合
     * @param attr
     */
    svg.group = svg.g = function (attr) {
        if (!is(attr, "object")) {
            attr = {};
        }
        return svg.el("g", attr);
    };
    /**
     * @public 矩形
     * @param x
     * @param y
     * @param w
     * @param h
     * @param rx
     * @param ry
     * @returns {SVGDOM}
     */
    svg.rect = function (x, y, w, h, rx, ry) {
        var attr;
        if (ry == null) {
            ry = rx;
        }
        if (is(x, "object")) {
            attr = x;
        } else if (x != null) {
            attr = {
                x: x,
                y: y,
                width: w,
                height: h
            };
            if (rx != null) {
                attr.rx = rx;
                attr.ry = ry;
            }
        }
        return svg.el("rect", attr);
    };
    /**
     * @public 文本
     * @param text
     * @param x
     * @param y
     * @returns {SVGDOM}
     */
    svg.text = function (text, x, y) {
        var attr = {};
        if (is(text, "object")) {
            attr = text;
        } else if (text != null) {
            attr = {
                x: x,
                y: y,
                text: text || ""
            };
        }
        return svg.el("text", attr);
    };
    /**
     * @public 图片
     * @param src
     * @param x
     * @param y
     * @param width
     * @param height
     * @returns {SVGDOM}
     */
    svg.image = function (src, x, y, width, height) {
        var el = svg.el("image"), attr = {};
        if (is(src, "object")) {
            attr = src;
        } else if (src != null) {
            attr = {
                "xlink:href": src,
                preserveAspectRatio: "none"
            };
            if (x != null && y != null) {
                attr.x = x;
                attr.y = y;
            }
            if (width != null && height != null) {
                attr.width = width;
                attr.height = height;
            }
        }
        return svg.attr(el, attr);
    };
    svg.circle = function (cx, cy, r) {
        var attr = {};
        if (is(cx, "object")) {
            attr = cx;
        } else if (cx != null) {
            attr = {
                cx: cx,
                cy: cy,
                r: r
            };
        }
        return svg.el("circle", attr);
    };
    /**
     * @public 线
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     * @returns {SVGDOM}
     */
    svg.line = function (x1, y1, x2, y2) {
        var attr = {};
        if (is(x1, "object")) {
            attr = x1;
        } else if (x1 != null) {
            attr = {
                x1: x1,
                x2: x2,
                y1: y1,
                y2: y2
            };
        }
        return svg.el("line", attr);
    };
    /**
     * @public 多边线
     * @param id
     * @param points
     * @returns {SVGDOM}
     */
    svg.polyline = function (id, points) {
        var attr = {};
        if (is(id, "object")) {
            attr = id;
        } else if (points != null) {
            attr = {
                id: id,
                points: points
            }
        }
        return svg.el("polyline", attr);
    };
    svg.path = function (d) {
        var attr;
        if (is(d, "object") && !is(d, "array")) {
            attr = d;
        } else if (d) {
            attr = {d: d};
        }
        return svg.el("path", attr);
    };

    /**
     * @public 创建元素接口
     * @param name {String}
     * @param attr {Object}
     * @returns {SVGDOM}
     */
    svg.el = function (name, attr) {
        var el = CRUD(name);

        attr && svg.attr(el, attr);
        return el;
    };
    /**
     * @public 设置元素属性
     * @param el {SVGDOM}
     * @param attr {Object}
     * @returns {SVGDOM}
     */
    svg.attr = function (el, attr) {
        if (!attr) {
            return el;
        }
        //get
        if (!attr) {
            if (el.nodeType != 1) {
                return {
                    text: el.nodeValue
                };
            }
            var attr = node.attributes, out = {};
            for (var i = 0, ii = attr.length; i < ii; i++) {
                out[attr[i].nodeName] = attr[i].nodeValue;
            }
            return out;
        }
        //set(可改为消息触法律)
        var out, value = null;
        for (var key in attr) {
            if (attr[has](key)) {
                value = attr[key];
                if (key == "text") {// 文本
                    if (el.tagName.toLowerCase() == "text") {
                        value = Str(value);
                        var txt = document.createTextNode(value);
                        while (el.firstChild) {
                            el.removeChild(el.firstChild);
                        }
                        el.appendChild(txt);

                    }
                    continue;
                }
                // 其他属性
                out = {};
                out[key] = value;
                CRUD(el, out);
            }
        }
        return el;
    };
    /**
     * @private 创建元素
     * @param el
     * @param attr
     * @returns {*}
     * @constructor
     */
    function CRUD(el, attr) {
        if (attr) {
            if (typeof el == "string") {
                el = CRUD(el);
            }
            // get
            if (typeof attr == "string") {

            }
            // set
            if (el.nodeType == 1) {
                for (var key in attr) {
                    if (attr[has](key)) {
                        var val = Str(attr[key]);
                        if (val) {
                            if (key.substring(0, 6) == "xlink:") {
                                el.setAttributeNS(SVG_XLINK, key.substring(6), val);
                            } else if (key.substring(0, 4) == "xml:") {
                                el.setAttributeNS(SVG_NS, key.substring(4), val);
                            } else {
                                el.setAttribute(key, val);
                            }
                        } else {
                            el.removeAttribute(key);
                        }
                    }
                }
            } else if ("text" in attr) {
                el.nodeValue = attr.text;
            }
        } else {
            el = document.createElementNS(SVG_NS, el);
        }
        return el;
    };
});
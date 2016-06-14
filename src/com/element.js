/**
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2016/4/8
 */
com.plugin(function (com) {

    com.Element = com.Element || {};

    /**
     * @public getElement
     * @returns {Array(DOMElement) or DOMElement}
     */
    com.Element.getElement = function () {
        var elements = [];

        for (var i = 0, len = arguments.length; i < len; i++) {
            var element = arguments[i];
            if (typeof element == 'string') {
                element = document.getElementById(element);
            }
            if (arguments.length == 1) {
                return element;
            }
            elements.push(element);
        }
        return elements;
    };

    com.Element.getElementsByClassName = function (className, tagName, context) {
        var ele = [];
        var pattern = new RegExp('(\\s|^)' + className + '(\\s|$)');
        var all = (context || document).getElementsByTagName(tagName || "*");
        for (var i = 0; i < all.length; i++) {
            if (all[i].className.match(pattern)) {
                ele[ele.length] = all[i];
            }
        }
        return ele;
    };

    com.Element.getOffset = function (element) {
        var left = element.offsetLeft;
        var top = element.offsetTop;
        var parent = element.offsetParent;
        while (parent) {
            left += parent.offsetLeft;
            top += parent.offsetTop;
            parent = parent.offsetParent;
        }
        return {top: top, left: left};
    };

    /**
     * @public isElement
     * @param o {Object} The object to test.
     * @returns {Boolean}
     */
    com.Element.isElement = function (o) {
        return !!(o && o.nodeType === 1);
    };

    /**
     * @public modifyDOMElement
     * @param element
     * @param id
     * @param px
     * @param sz
     * @param position
     * @param border
     * @param overflow
     * @param opacity
     */
    com.Element.modifyDOMElement = function (element, id, px, sz, position, border, overflow, opacity) {
        if (id) {
            element.id = id;
        }
        if (px) {
            element.style.left = px.x + "px";
            element.style.top = px.y + "px";
        }
        if (sz) {
            element.style.width = sz.w + "px";
            element.style.height = sz.h + "px";
        }
        if (position) {
            element.style.position = position;
        }
        if (border) {
            element.style.border = border;
        }
        if (overflow) {
            element.style.overflow = overflow;
        }
        if (parseFloat(opacity) >= 0.0 && parseFloat(opacity) < 1.0) {
            element.style.filter = 'alpha(opacity=' + (opacity * 100) + ')';
            element.style.opacity = opacity;
        } else if (parseFloat(opacity) == 1.0) {
            element.style.filter = '';
            element.style.opacity = '';
        }
    };

    /**
     * @public createDiv 创建DIV
     * @param id
     * @param px
     * @param sz
     * @param imgURL
     * @param position
     * @param border
     * @param overflow
     * @param opacity
     * @returns {DOMElement}
     */
    com.Element.createDiv = function (id, px, sz, imgURL, position, border, overflow, opacity) {
        var dom = com.Element.el('div');

        if (imgURL) {
            dom.style.backgroundImage = 'url(' + imgURL + ')';
        }

        com.Element.modifyDOMElement(dom, id, px, sz, position, border, overflow, opacity);

        return dom;
    };
    /**
     * @public 创建元素
     * @param tag
     * @param id
     * @returns {HTMLElement}
     */
    com.Element.el = function (tag, id) {
        var element = document.createElement(tag);
        if (id) {
            element.id = id;
        }
        return element;
    };


    com.Element.hasClass = function (element, cls) {
        return element.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    };

    com.Element.addClass = function (element, cls) {
        if (!com.Element.hasClass(element, cls)) {
            element.className += " " + cls;
        }
    };

    com.Element.removeClass = function (element, cls) {
        if (com.Element.hasClass(element, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            element.className = element.className.replace(reg, " ");
        }
    };
});
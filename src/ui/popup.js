/**
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2016/4/8
 */
NTopo.plugin(function ($$) {

    function Popup() {
        Popup.prototype.initialize.apply(this, arguments);
    }

    Popup.prototype = {
        defaults: {
            popupClass: "tc01 ls1 lc09 bgc02 ui-popup boxshadow",
            headClass: "head ls1 lc09 bgc09"
        },
        initialize: function (option, node/*, contentSize, contentHTML, closeBox, closeBoxCallback*/) {
            option = com.util.extend({}, option);// 克隆
            this.items = option["item"];
            this.href = option["href"] || "";
            this.titleTxt = option["title"];
            this.width = option["width"];
            this.height = option["height"];
            this.node = node;
            this.closedHand = null;


            this.div = com.Element.createDiv();
            this.div.style.width = this.width + "px";
            this.div.style.height = this.height + "px";
            this.div.className = this.defaults.popupClass;

            this.head = this.initHeader(this.div);// 标题部分
            this.body = this.initBody(this.div);// 内容部分
            this.bottom = this.initBottom(this.div);// 箭头部分(实际为span)
            return this;
        },
        /**
         * @private 初始化标题
         * @param parent
         * @returns {DOMElement}
         */
        initHeader: function (parent) {
            var head = com.Element.createDiv();
            head.className = this.defaults.headClass;
            parent.appendChild(head);

            this.title = com.Element.createDiv();
            this.title.className = "title";//内容
            head.appendChild(this.title);

            var button = com.Element.createDiv();
            button.className = "button";
            button.innerHTML = "<span />";
            var act = com.Function.bind(this.closePopup, this);
            com.Event.addListener(button, "click", act);
            head.appendChild(button);

            return head;
        },
        /**
         * @private 初始化内容
         * @param parent
         * @returns {DOMElement}
         */
        initBody: function (parent) {
            var body = com.Element.createDiv();
            body.className = "popup_body";//内容
            parent.appendChild(body);

            this.content = com.Element.createDiv();
            this.content.style.padding = "2px 11px";
            body.appendChild(this.content);
            return body;
        },
        /**
         * @private 初始化箭头
         * @param parent
         * @returns {*|HTMLElement|SVGDOM}
         */
        initBottom: function (parent) {
            var bottom = com.Element.createDiv();// 箭头部分
            bottom.className = "popup_bottom";
            parent.appendChild(bottom);

            var span = com.Element.el("span");
            bottom.appendChild(span);

            return span;
        },
        /**
         * @private 设置标题内容
         */
        setTitleHTML: function () {
            this.title.innerHTML = this.formatVal(this.titleTxt || "标题", this.node);
        },
        /**
         * @private 设置内容为UL
         * @param items
         * @returns {string}
         */
        setBodyHtml: function (items) {
            var len = items.length, ul;
            if (len.length === 0) {
                return "";
            }
            ul = "<ul>";
            for (var i = 0; i < len; i++) {
                ul += "<li>" + items[i]["label"];
                ul += "<span>" + this.formatVal(items[i]["value"], this.node) + "</span>";
                ul += "</li>";

            }
            return ul + "</ul>";
        },
        /**
         * @private 设置内容为IFrame
         * @param href
         * @returns {string}
         */
        setBodyIFrame: function (href) {
            var subString = href.substr(href.indexOf("?") + 1);
            // 各个参数放到数组里
            var arr = subString.split("&"), index, val;
            for (var i = 0, len = arr.length; i < len; i++) {
                index = arr[i].indexOf("=");
                if (index > 0) {
                    val = arr[i].substr(index + 1);
                    href = href.replace(val, this.formatVal(val, this.node));
                }
            }
            var result = "<iframe frameborder=\"0\" width=\"100%\"";
            result += " height=\"100%\" src=\"" + href + "\" />";

            return result;
        },
        /**
         * @private 设置内容
         */
        setContentHTML: function () {
            var str = this.href ? this.setBodyIFrame(this.href) : this.setBodyHtml(this.items);
            this.content.innerHTML = str;
        },
        /**
         * @private 格式化数据
         * @param val
         * @param node
         * @returns {String}
         */
        formatVal: function (val, node) {
            var data = null;
            if (/^\$/.test(val)) {// EL表达式形式
                val = val.replace(/\$\{|\}$/g, "");
                // 数据属性
                data = node.data();
                if (data && data.hasOwnProperty(val)) {
                    return data[val];
                }
                // 业务属性 and 原始(基本)属性
                data = node.map;
                if (data && data.containsKey(val)) {
                    return data.get(val);
                }
                //data = node[val] ? node : node.data();
                //if (data && data[val]) {
                //    val = com.util.isFunction(data[val]) ? data[val]() : data[val];
                //}
            } else if (/^(RegExp)/i.test(val)) {// 正则表达式形式

            }
            return val;
        },
        /**
         * @private 关闭事件处理
         * @param evt
         */
        closePopup: function (evt) {
            if (this.closedHand) {
                this.closedHand(evt);
                this.closedHand = null;
            }
        },

        /**
         * @public 设置高宽
         */
        setWidthHeight: function () {
            var w = this.div.offsetWidth;
            var h = this.div.offsetHeight;
            var spanW = this.bottom.offsetWidth;
            var spanH = this.bottom.offsetHeight;
            var headH = this.head.offsetHeight;

            this.body.style.height = (h - headH - 2) + "px";// 内容部分
            this.bottom.style.left = (w - spanW) / 2 + "px";// 箭头部分
            this.div.style.top = -(h + spanH) + "px";// 偏移位置
            this.div.style.left = (-w + spanW) / 2 + "px";
        },
        /**
         * @public 设置关闭事处理事件函数
         * @param fun
         */
        setClosedHand: function (fun) {
            this.closedHand = fun;
        },
        /**
         * @public 绘图
         * @returns {DOMElement|*}
         */
        draw: function () {
            this.setTitleHTML();
            this.setContentHTML();
            return this.div;
        },
        toFormatObj: function () {
            return {
                item: this.items,
                href: this.href,
                title: this.titleTxt,
                width: this.width,
                height: this.height
            }
        }
    };

    $$.Popup = Popup;
});
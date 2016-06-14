/**
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2016/4/11
 */
NTopo.plugin(function ($$) {

    function Menu() {
        Menu.prototype.initialize.apply(this, arguments);
    }

    Menu.prototype = {
        defaults: {
            menuClass: "ui-menu ls1 lc07 boxshadow",
            menuULClass: "ls1 lc07 ui-menu-item-wrap boxshadow",
            menuGroupClass: "ui-menu-slave bgc02",
            menuItemClass: "ui-menu-item bgc02",
            menuSeparatorClass: "ls2 lc07 ui-menu-separator",
            onclick: function (item) {
            }
        },
        initialize: function (option, node) {
            this.option = this.markArray(option);
            this.node = node;
            this.displayHandler = null;
            this.menuClientX = 0;
            this.menuClientY = 0;

            this.ul = com.Element.el("ul");
            this.ul.className = this.defaults.menuClass;
            return this;
        },
        /**
         * @private 格式化数组
         * @param item
         * @returns {Array}
         */
        markArray: function (item) {
            if (!item) {
                item = [];
            } else if (!com.util.isArray(item)) {
                item = [item];
            }
            return item;
        },
        /**
         * @private 格式化成item
         * @param item
         * @returns {*}
         */
        formatItem: function (item) {
            var type = item["type"] || "", cItem;
            if (type.toLowerCase() === "separator") {// 分隔线
                item["type"] = "Separator";
                return item;
            }
            if (type.toLowerCase() === "group") {// group
                item["type"] = "group";
                item["items"] = this.markArray(item["item"]);
                return item;
            }
            return item;// item
        },
        addGroup: function (parent) {
            var ul = com.Element.el("ul");
            com.Element.addClass(ul, this.defaults.menuULClass);
            parent.appendChild(ul);

            return ul;
        },
        /**
         * @private 生成菜单项(引用了JQuery)
         * @param parent
         * @param items
         * @returns {*}
         */
        addLi: function (parent, items, graph) {
            var li, htmlStr;
            var wrap = (parent != this.ul) ? this.addGroup(parent) : this.ul;
            for (var i = 0; i < items.length; i++) {
                if (items[i].hasOwnProperty("node")) {
                    items[i]["graph"] = graph;// 连线使用
                }

                li = com.Element.el("li", items[i].id);
                if (items[i].type == "Separator") {// 菜单分隔线
                    com.Element.addClass(li, this.defaults.menuSeparatorClass);
                    li.innerHTML = "<span></span>";
                } else if (items[i].type == "group") {// 菜单组
                    htmlStr = "<span class=\"ui-menu-icon\">&nbsp;</span>";
                    htmlStr += "<span class=\"ui-menu-slave-text\">" + items[i].label + "</span>";
                    htmlStr += "<span class=\"ui-menu-slave-more ui-icon-default ui-icon-triangle-1-e\" ";
                    htmlStr += "style=\"float:right\">&nbsp;</span>";
                    li.innerHTML = htmlStr;
                    com.Element.addClass(li, this.defaults.menuGroupClass);

                    arguments.callee.call(this, li, items[i].items, graph);
                } else {// 菜单项
                    htmlStr = "<span class=\"ui-menu-icon " + items[i].icon + "\">";
                    htmlStr += "</span><span>" + items[i].label + "</span>";

                    com.Element.addClass(li, this.defaults.menuItemClass);
                    $(li).data("id", items[i]);//会更改(去掉jquery)
                    //li.setAttribute("data", items[i]);
                    li.innerHTML = htmlStr;
                }
                wrap.appendChild(li);
            }
            return wrap;
        },

        /**
         * @private 分组注册事件(引用了JQuery)
         */
        menuGroupListener: function () {
            var getEleByClassName = com.Element.getElementsByClassName;
            var ele = getEleByClassName("ui-menu-slave", "li", this.ul);
            ele.each(function (index, obj) {
                // 注册mouseenter事件
                com.Event.addListener(obj, "mouseenter", function () {
                    var span = getEleByClassName("ui-menu-slave-text", "span", this)[0];
                    com.Element.addClass(span, "tc02");

                    com.Element.addClass(this, "bgc04");

                    var offset = $(this).position();//会更改(去掉jquery)
                    var ul = getEleByClassName("ui-menu-item-wrap", "ul", this)[0];
                    ul.style.position = "absolute";
                    ul.style.top = offset.top + "px";
                    ul.style.left = (offset.left + 100) + "px";
                    ul.style.display = "block";
                });
                // 注册mouseleave事件
                com.Event.addListener(obj, "mouseleave", function () {
                    var span = getEleByClassName("ui-menu-slave-text", "span", this)[0];
                    com.Element.removeClass(span, "tc02");

                    com.Element.removeClass(this, "bgc04");

                    var ul = getEleByClassName("ui-menu-item-wrap", "ul", this)[0];
                    ul.style.display = "none";
                });

            });
        },
        /**
         * @private 项注册事件(引用了JQuery)
         */
        menuItemListener: function () {
            var getEleByClassName = com.Element.getElementsByClassName;
            var ele = getEleByClassName("ui-menu-item", "li", this.ul);
            var that = this;
            ele.each(function (index, obj) {
                // 注册click事件
                com.Event.addListener(obj, "click", function () {
                    var data = $(this).data("id");//会更改(去掉jquery)
                    if (that.displayHandler) {
                        that.displayHandler("none");
                        that.displayHandler = null;
                    }
                    var func = data["onclick"] || that.defaults.onclick;
                    // 没配置onclick
                    if (com.util.isFunction(func)) {
                        return func.call(this, data);
                    }
                    // 指定url(可替换参数)
                    if (/^href:/i.test(func)) {
                        func = func.replace(/^href:/i, "");
                        return window.open(func);
                    }
                    // onclick="函数名"
                    if (com.util.isFunction(window[func])) {
                        return window[func].call(this, data);
                    }
                    // javascript
                    func = that.fn(func)();
                    if (com.util.isFunction(func)) {
                        func.call(this, data);
                    }
                });
                // 注册mouseenter事件
                com.Event.addListener(obj, "mouseenter", function () {
                    com.Element.addClass(this, "bgc04 tc02");
                });
                // 注册mouseleave事件
                com.Event.addListener(obj, "mouseleave", function () {
                    com.Element.removeClass(this, "bgc04 tc02");
                });
            });
        },
        /**
         * @private 构造函数
         * @param str
         * @returns {Function}
         */
        fn: function (str) {
            return new Function("return " + str);
        },
        /**
         * @public 设置隐藏
         */
        setDisplay: function (func) {
            this.displayHandler = func;
        },
        /**
         * @public 增加配置(eg:连线)
         * @param item
         */
        addOption: function (item) {
            if (item) {
                this.option.push(item);
            }
        },
        /**
         * @public 记录右键点下的位置
         * @param x
         * @param y
         */
        setMenuClient: function (x, y) {
            this.menuClientX = x;
            this.menuClientY = y;
            return this;
        },
        /**
         * @public 绘图
         * @param graph
         * @returns {DOMElement|*}
         */
        draw: function (graph) {
            this.ul.innerHTML = "";
            var len = this.option.length, items = [];
            //console.log(this.option);
            for (var i = 0; i < len; i++) {
                items.push(this.formatItem(this.option[i]));
            }
            this.addLi(this.ul, items, graph);
            this.menuGroupListener();
            this.menuItemListener();

            return this.ul;
        },
        toFormatObj: function () {
            var result = [], menuItem;
            for (var i = 0, len = this.option.length; i < len; i++) {
                menuItem = this.option[i];
                if (menuItem["id"] && menuItem["id"] == "addLine") {
                    continue;
                }
                result.push(menuItem);
            }
            return result;
        }
    };

    $$.Menu = Menu;
});

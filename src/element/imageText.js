/**
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2016/3/22
 */
NTopo.plugin(function ($$) {
    //var defaultOption = {
    //    bgPadding: 2
    //};
    function ImageText() {
        ImageText.prototype.initialize.apply(this, arguments);
    }

    ImageText.prototype = {
        //nodeType: "NODE",
        initMap: function (option) {
            this.map = new com.Map();
            for (var key in option) {
                if (!option.hasOwnProperty(key)) {
                    continue;
                }
                this.map.put(key, option[key]);
            }
        },
        initialize: function (option) {
            option = com.util.extend({}, option);// 克隆
            this.initMap(option);

            this.elementType = "ImageText";
            this.bgPadding = 2;
            this.icon = option.icon || "";
            this.text = option.text || "node";
            this.id = option.id;
            this.point = new com.geo.Point(option.point || "");
            this.iconSize = new com.geo.Point(option.iconSize || "64,64");
            this.popup = option.popup ? new $$.Popup(option.popup, this) : null;
            this.menu = new $$.Menu(option.menu, this);
            if ("Edit" === "Edit") {// 加入连线
                this.menu.addOption({
                    id: "addLine",
                    label: "连线",
                    onclick: this.drawLine,
                    node: this
                });
            }
            this.component = option.component || [];
            this.component = com.util.isArray(this.component) ? this.component : [this.component];

            this.container = com.svg.g({
                "id": this.id,
                "fill": "white",
                //"stroke": "#9cb6ce",
                "font-size": "12px",
                "font-family": "Arial",
                "text-anchor": "middle"
            });
            this.iconDom = null;
            this.textDom = null;
            this.compDoms = null;
            this.bgDom = null;
            this.layer = null;
            this._data = null;

            this.box = new com.geo.Box().setCenter(this.point, 2, 2);
        },
        formatHref: function (href) {
            var WLH = window.location.href;
            return WLH.replace(/[^\\\/]+$/, href);
        },
        addIcon: function (container) {
            var img = com.svg.image({
                "width": this.iconSize.x,
                "height": this.iconSize.y,
                "xlink:href": this.formatHref(this.icon)
            });

            return container.appendChild(img);
        },
        addText: function (container) {
            var text = com.svg.text({
                "text": this.text,
                "dy": "12"
            });

            return container.appendChild(text);
        },
        addRect: function (container) {
            var rect = com.svg.rect({
                "width": this.iconSize.x + this.bgPadding * 2,
                "height": this.iconSize.y + this.bgPadding * 2,
                "fill": "#9cb6ce",
                "fill-opacity": 0.7,
                "stroke": "none",
                "visibility": "hidden" //visible
            });

            return container.insertBefore(rect, this.iconDom);
        },
        addComponents: function (container) {
            var compDoms = [], comp, compDom;
            for (var i = 0, len = this.component.length; i < len; i++) {
                comp = this.component[i];
                if (comp.type === "circle") {
                    compDom = new $$.Circle(comp, this);
                } else {
                    console.log("other UI component!");
                }

                // 存储
                if (compDom) {
                    container.appendChild(compDom.container);
                    compDoms.push(compDom);
                }
            }
            return compDoms;
        },
        paint: function () {
            if (!this.iconDom) {
                this.iconDom = this.addIcon(this.container);
                this.iconDom.instance = this;

                this.addListener(this.iconDom, "mouseover", this.mouseOver);
                this.addListener(this.iconDom, "mouseout", this.mouseout);
            }
            if (!this.textDom) {
                this.textDom = this.addText(this.container);// 文字
            }
            if (!this.compDoms) {
                this.compDoms = this.addComponents(this.container);// 组件
            }
            if (!this.bgDom) {
                this.bgDom = this.addRect(this.container);
            }

            this.moveTo(this.point.x, this.point.y);
        },
        /**
         * @private 绑定事件
         * @param obj
         * @param target
         * @param act
         */
        addListener: function (obj, target, act) {
            act = com.Function.bind(act, this);
            com.Event.addListener(obj, target, act);
        },
        mouseOver: function (evt) {
            this.iconDom.setAttribute("style", "cursor:pointer");
            this.bgDom.setAttribute("visibility", "visible");
        },
        mouseout: function (evt) {
            this.iconDom.setAttribute("style", "cursor:hander");
            this.bgDom.setAttribute("visibility", "hidden");
        },
        /**
         * @private 右键菜单中连线处理
         * @param data
         */
        drawLine: function (data) {
            var node = data["node"];
            var graph = data["graph"];
            if (graph && node) {
                graph.setHandler("drawLineHandler", {
                    startFlag: true,
                    id: node.id,
                    sx: node.point.x,
                    sy: node.point.y
                });
            }
        },

        /**
         * @public 数据更新
         * @return {data}
         */
        data: function (data) {
            if (arguments.length === 0) {// get
                return this._data;
            }
            if (arguments.length === 1 && data === undefined) {// set
                return this;
            }
            // 值未发生变化
            if (this._data == data) {
                return this;
            }
            this._data = data;

            return this;
        },
        /**
         * @public 偏移
         * @param xx
         * @param yy
         */
        move: function (xx, yy) {
            this.moveTo(this.point.x + xx, this.point.y + yy);
        },
        /**
         * @public 移动到指定位置
         * @param x
         * @param y
         */
        moveTo: function (x, y) {
            // 图形
            this.iconDom.setAttribute("x", x - this.iconSize.x / 2);
            this.iconDom.setAttribute("y", y - this.iconSize.y / 2);

            this.bgDom.setAttribute("x", x - this.iconSize.x / 2 - this.bgPadding);
            this.bgDom.setAttribute("y", y - this.iconSize.y / 2 - this.bgPadding);
            // 文字
            this.textDom.setAttribute("x", x);
            this.textDom.setAttribute("y", y + this.iconSize.y / 2);
            // 组件
            for (var i = 0, len = this.compDoms.length; i < len; i++) {
                this.compDoms[i].moveTo(x, y);
            }
        },
        toFormatObj: function () {
            var result = {}, that = this;
            // point iconSize popup menu component
            this.map.each(function (key, val, index) {
                if (key == "point" || key == "iconSize") {
                    val = that[key].toString();
                } else if (key == "popup") {
                    val = [that[key].toFormatObj()];
                } else if (key == "menu") {
                    val = that[key].toFormatObj();
                } else if (key == "component") {
                    var component = that[key], val = [], temp;
                    for (var i = 0; i < component.length; i++) {
                        temp = com.util.extend({}, component[i]);
                        if (temp["match"] && !com.util.isArray(temp["match"])) {
                            temp["match"] = [temp["match"]];
                        }
                        val[i] = temp;
                    }
                } else {
                    val = that[key] ? that[key] : val;
                }
                // 取值
                result[key] = val;
            });
            //console.log(this.component);
            return result;
        }
    }

    $$.ImageText = ImageText;
});
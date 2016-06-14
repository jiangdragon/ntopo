/**
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2016/4/8
 */
NTopo.plugin(function ($$) {

    function DivLayer() {
        DivLayer.prototype.initialize.apply(this, arguments);
    }

    DivLayer.prototype = {
        initialize: function (id, graph) {
            var div = com.Element.createDiv(id);
            div.style.position = "absolute";
            div.style.zIndex = "1000";
            div.style.backgroundColor = "#718BB7";
            div.style.display = "none";
            // 注册事件
            var act = function (evt) {
                com.Event.stopImmediatePropagation(evt);
            };
            com.Event.addListener(div, "click", act);
            com.Event.addListener(div, "mousedown", act);
            com.Event.addListener(div, "contextmenu", act);

            this.id = id;
            this.elementType = "Tooltip";
            this.container = div;

            this.addTo(graph);
        },
        addTo: function (graph) {
            if (null != graph && this.graph !== graph) {
                this.graph = graph;
                this.graph.addLayer(this);
            }
        },
        getOffset: function (target) {
            var left = target.offsetLeft;
            var top = target.offsetTop;
            var parent = target.offsetParent;
            while (parent) {
                left += parent.offsetLeft;
                top += parent.offsetTop;
                parent = parent.offsetParent;
            }
            return {top: top, left: left};

        },
        /**
         * @public 添加弹出框
         * @param popup
         */
        addPopup: function (popup, x, y) {
            //popup.map = this;
            var offset = this.getOffset(this.container.parentNode);
            this.container.innerHTML = "";
            this.container.style.left = (x - offset.left - 1) + "px";
            this.container.style.top = (y - offset.top - 1) + "px";
            var popupDiv = popup.draw(), that = this;
            if (popupDiv) {
                this.container.appendChild(popupDiv);
                this.display("block");
                popup.setWidthHeight();
                /* ==========================绑定关闭事件========================== */
                popup.setClosedHand(function () {
                    that.display("none");
                });
                /*********************** document注册事件 *************************/
                this.oneHandler(document, "mousedown", function (evt) {
                    that.display("none");
                });
            }
        },
        /**
         * @public 添加右键菜单
         * @param menu
         * @param x
         * @param y
         */
        addMenu: function (menu, x, y) {
            var offset = this.getOffset(this.container.parentNode);
            this.container.innerHTML = "";
            this.container.style.left = (x - offset.left - 1) + "px";
            this.container.style.top = (y - offset.top - 1) + "px";

            var menuUL = menu.draw(this.graph), that = this;
            if (menuUL) {
                this.container.appendChild(menuUL);
                this.display("block");
                /* ==========================set隐藏处理========================== */
                menu.setDisplay(com.Function.bind(this.display, this));
                /*********************** document注册事件 *************************/
                this.oneHandler(document, "click", function (evt) {
                    that.display("none");
                });
            }

        },
        /**
         * @public 清空图层数据
         */
        clear: function () {
            this.container.innerHTML = "";
            this.display("none");
        },
        /**
         * @private 注册一次事件
         * @param obj
         * @param target
         * @param func
         */
        oneHandler: function (obj, target, func) {
            var act = function () {
                com.Event.removeListener(obj, target, act);
                func.apply(this, arguments);
            };
            com.Event.addListener(obj, target, act);
        },
        /**
         * @public tooltip显示与隐藏
         * @param display
         */
        display: function (display) {
            this.container.style.display = display;
        }

    };

    $$.DivLayer = DivLayer;
});
/**
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2016/4/7
 */
NTopo.plugin(function ($$) {
    var extend = com.util.extend;

    function PanHandler() {
        this.graph = null;
        this.down = false;
        this.startX = 0;
        this.startY = 0;
        this.mouseWheelData = 0;// 鼠标滑轮标记
        PanHandler.prototype.initialize.apply(this, arguments);
    }

    var pro = extend({}, $$.Handler);
    PanHandler.prototype = extend(pro, {
        initialize: function (graph) {
            this.graph = graph;
        },
        mouseDown: function (evt) {
            //console.log("========PanHandler.mouseDown==========");
            this.down = true;
            this.startX = evt.clientX;
            this.startY = evt.clientY;
            com.Event.setCapture(this.graph.container);
            return true;
        },
        mouseMove: function (evt) {
            //console.log("========PanHandler.mouseMove==========");
            if (this.down == false) {
                return false;
            }
            //var vx = this.graph.viewBoxX;
            //var vy = this.graph.viewBoxY;
            var offsetX = this.graph.screenToSVG(evt.clientX - this.startX);
            var offsetY = this.graph.screenToSVG(evt.clientY - this.startY);
            this.graph.move(offsetX, offsetY);
        },
        mouseUp: function (evt) {
            //console.log("========PanHandler.mouseUp==========");
            if (this.down == false) {
                return false;
            }

            com.Event.releaseCapture(this.graph.container);
            var offsetX = this.graph.screenToSVG(evt.clientX - this.startX);
            var offsetY = this.graph.screenToSVG(evt.clientY - this.startY);
            var vx = this.graph.viewBoxX - offsetX;
            var vy = this.graph.viewBoxY - offsetY;

            this.graph.moveTo(vx, vy);
            this.graph.setViewBoxXY(vx, vy);
            this.down = false;
            return true;
        },
        mouseWheel: function (evt) {
            //console.log("========PanHandler.mouseWheel==========");
            var delta = 0;
            if (!evt) {// IE
                evt = window.event;
            }

            if (evt.wheelDelta) {// IE|Opera
                delta = event.wheelDelta / 120;
                // 在Opera9中，事件处理不同于IE
                if (window.opera) {
                    delta = -delta;
                }
            } else if (evt.detail) {// Mozilla
                delta = -evt.detail / 3;
            }

            // 如果增量不等于0则触发;测试滚轮向上滚或者是向下;
            if (delta) {
                this.zoom(delta);
            }
        },
        /**
         * @private zoom操作SVG
         * @param delta:大于0滑轮向上(放大)|小于0滑轮向下(缩小)
         */
        zoom: function (delta) {
            if ((this.mouseWheelData++) > 1) {
                return;
            }
            if (delta < 0) {
                this.graph.zoomOut();// 缩小
            } else {
                this.graph.zoomIn();// 放大
            }

            var func = com.Function.bind(this.clearTimer, this);
            setTimeout(func, 500);
        },
        /**
         * @private clearTimer定时器(清除鼠标滑轮标记)
         */
        clearTimer: function () {
            this.mouseWheelData = 0;
        }
    });

    $$.PanHandler = PanHandler;
});
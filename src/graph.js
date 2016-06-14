/**
 * @author 傻大
 * @require [com/svg.js、com/fun.js、dragHandler.js]
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2016/3/22
 */
NTopo.plugin(function ($$) {

    function Graph() {
        Graph.prototype.initialize.apply(this, arguments);
    }

    Graph.prototype = {
        initialize: function (root) {
            root.style["-webkit-tap-highlight-color"] = "transparent";
            root.style["-webkit-user-select"] = "none";
            root.style["user-select"] = "none";
            root.style["-webkit-touch-callout"] = "none";
            root.innerHTML = "";
            this.width = root.offsetWidth;// 宽，缓存记录
            this.height = root.offsetHeight;// 高，缓存记录

            // create relative div dom
            var domRoot = document.createElement("div");
            this._domRoot = domRoot;
            domRoot.style.position = "relative";
            domRoot.style.overflow = "hidden";
            domRoot.style.width = this.width + "px";
            domRoot.style.height = this.height + "px";
            root.appendChild(domRoot);

            this.layers = {};
            this.viewBoxX = 0;
            this.viewBoxY = 0;
            //this.baseScale = 1;// svg初始缩放比
            this.zoom = 3;// 缩放序列
            this.scales = [0.25, 0.5, 1, 1.5, 2, 2.5, 3];// 缩放比率
            this.container = com.svg.svg(null, null, this.width, this.height, true);
            domRoot.appendChild(this.container);

            //var ctm = this.container.getScreenCTM();
            //console.log(ctm);
            // eagle鹰眼
            //this.eagle = document.createElement("canvas");
            //this.eagle.style.position = "absolute";
            //this.eagle.style.border = "1px solid #919191";
            //
            //this.eagle.width = "200";
            //this.eagle.height = "150";
            //this.eagle.style.bottom = "0px";
            //this.eagle.style.right = "0px";
            //domRoot.appendChild(this.eagle);

            // initEvent
            this.initEvent();
        },
        drawEagle: function () {
            var layer = this.getLayer($$.zIndex_Eagle);
            if (layer) {
                layer.drawEagle();
            }
        },
        test: function () {// 测试膺眼------------------start
            var layer = this.getLayer($$.zIndex_Link);
            var svgScale = this.getScale();
            if (!layer) {
                return;
            }
            var test = com.svg.rect({// svg区域
                "x": 0,
                "y": 0,
                "width": 1038.7304721030043,
                "height": 904.2,
                "fill": "none",
                "stroke": "red"
            });
            var view = com.svg.rect({// 当前视窗
                "x": 0,
                "y": 0,
                "width": 803 / svgScale,
                "height": 699 / svgScale,
                "fill": "none",
                "stroke": "#9cb600"
            });
            layer.container.appendChild(test);
            layer.container.appendChild(view);
        },
        drawEagleRect: function () {
            // 测试膺眼------------------start
            //this.test();
            // 测试膺眼------------------end
            var ctx = this.eagle.getContext("2d");
            var box = this.getBox(), scale = 1.1;
            var svgScale = this.getScale();

            // 取得视窗等比例放大的vw vh并扩大scale
            var vbw = Math.max(box.width(), this.width), vbh = Math.max(box.height(), this.height);
            var svb = Math.max(vbw / this.width, vbh / this.height) * scale;
            vbw = this.width * svb;
            vbh = this.height * svb;

            // 计算svg区域到鹰眼200*150的缩放
            var xRatio = vbw / 200, yRatio = vbh / 150;
            var ratio = Math.max(xRatio, yRatio);// [谁大谁铺满]
            var scaleWidth = xRatio == ratio ? 200 : null;
            var scaleHeight = xRatio == ratio ? null : 150;
            var offsetX = (200 * ratio - vbw) / (2 * svb);
            var offsetY = (150 * ratio - vbh) / (2 * svb);
            //console.log("=================================");
            //console.log("svgScale:" + svgScale);
            //console.log("vbw:" + vbw + ";vbh:" + vbh + ";svb" + svb);
            //console.log("this.width:" + this.width + ";this.height:" + this.height);
            //console.log("ratio:" + ratio + ";xRatio:" + xRatio + ";yRatio:" + yRatio);
            //console.log("scaleWidth:" + scaleWidth + ";scaleHeight:" + scaleHeight);
            //console.log("offsetX:" + offsetX + ";offsetY:" + offsetY);

            // 计算鹰眼视窗框
            var cx = (this.viewBoxX + offsetX * svb) * svgScale / ratio;
            var cy = (this.viewBoxY + offsetY * svb) * svgScale / ratio;
            var cw = scaleWidth ? this.width * scaleWidth / vbw : this.width * scaleHeight / vbh;
            var ch = scaleWidth ? this.height * scaleWidth / vbw : this.height * scaleHeight / vbh;

            // 全视图(缩小svg)
            var content = this.container.outerHTML;
            var viewBox = "viewBox=\"" + [0, 0, vbw, vbh].join(" ") + "\"";
            content = content.replace(/viewBox=\"[-.0-9 ]+\"/g, viewBox);
            //console.log("content:" + content);

            canvg(this.eagle, content, {
                ignoreMouse: true,
                ignoreAnimation: true,
                ignoreDimensions: true,
                ignoreClear: false,
                scaleWidth: scaleWidth,
                scaleHeight: scaleHeight,
                offsetX: offsetX,
                offsetY: offsetY,
                backgroundColor: "#2C2C2C",
                renderCallback: function () {
                    // 绘矩开框
                    ctx.strokeStyle = "#0066CC";
                    ctx.strokeRect(cx / svgScale, cy / svgScale, cw / svgScale, ch / svgScale);
                    ctx.fillStyle = "rgba(88,149,182,0.3)";
                    ctx.fillRect(cx / svgScale, cy / svgScale, cw / svgScale, ch / svgScale);
                }
            });
        },
        /**
         * @private 初始化事件
         */
        initEvent: function () {
            this.handlers = {
                "panHandler": new $$.PanHandler(this),
                "dragHandler": new $$.DragHandler(this),
                "editHandler": new $$.EditHandler(this),
                "drawLineHandler": new $$.DrawLineHandler(this)
            };
            // 默认事件处理器
            this.svgHandler = this.handlers["dragHandler"];// 默认事件
            //this.svgHandler = this.handlers["editHandler"];// 默认事件
            // 注册事件
            this.addListener(this.container, "mousedown", this.mouseDown);
            this.addListener(this.container, "mousemove", this.mouseMove);
            this.addListener(this.container, "mouseup", this.mouseUp);
            this.addListener(document, "mousewheel", this.mouseWheel);

            this.addListener(this.container, "contextmenu", this.menuHander);
        },
        /**
         * @private 添加监听
         * @param obj
         * @param target
         * @param act
         */
        addListener: function (obj, target, act) {
            act = com.Function.bind(act, this);
            if (target == "mousewheel") {
                if (obj == null || obj == document) {
                    obj = obj || document;
                    // Mozilla
                    if (window.addEventListener) {
                        com.Event.addListener(window, "DOMMouseScroll", act);
                    }
                    // IE/Opera
                    window.onmousewheel = obj.onmousewheel;
                }
            }
            com.Event.addListener(obj, target, act);
        },
        /**
         * @private 鼠标按下
         * @param evt
         */
        mouseDown: function (evt) {
            if (this.checkEvent() && com.Event.isRightClick(evt)) {
                this.svgHandler.menuHandler(evt);
            } else if (!this.checkEvent() || !this.svgHandler.mouseDown(evt)) {
                this.handlers["panHandler"].mouseDown(evt);
            }
        },
        /**
         * @private 鼠标移动
         * @param evt
         */
        mouseMove: function (evt) {
            if (!this.checkEvent() || !this.svgHandler.mouseMove(evt)) {
                this.handlers["panHandler"].mouseMove(evt);
            }
        },
        /**
         * @private 鼠标弹起
         * @param evt
         */
        mouseUp: function (evt) {
            if (!this.checkEvent() || !this.svgHandler.mouseUp(evt)) {
                this.handlers["panHandler"].mouseUp(evt);
            }

            this.drawEagle();
        },
        /**
         * @private 鼠标滑轮
         * @param evt
         */
        mouseWheel: function (evt) {
            if (this.checkEvent()) {
                this.handlers["panHandler"].mouseWheel(evt);
            }
            this.drawEagle();
        },
        /**
         * @private 鼠标右键
         * @param evt
         */
        menuHander: function (evt) {
            com.Event.stopImmediatePropagation(evt);
        },
        /**
         * @private 事件是否为空
         * @returns {boolean}
         */
        checkEvent: function () {
            return this.svgHandler != null;
        },

        /**
         * @public 设置Handler
         * @param handler
         * @param option
         */
        setHandler: function (handler, option) {
            var handler = this.handlers[handler];
            handler && handler.setOption(option);

            this.svgHandler = handler;
        },
        /**
         * @public 添加图层
         * @param layer
         * @returns {boolean}
         */
        addLayer: function (layer) {
            for (var index in this.layers) {
                if (this.layers[index] == layer) {
                    return false;
                }
            }
            if (layer.elementType == "SvgLayer") {
                this.container.appendChild(layer.container);
            } else {
                this._domRoot.appendChild(layer.container);
            }
            this.layers[layer.id] = layer;
        },
        /**
         * @public 取图层
         * @param zIndex
         * @returns {*}
         */
        getLayer: function (zIndex) {
            for (var index in this.layers) {
                var layer = this.layers[index];
                if (layer.zIndex == zIndex) {
                    return layer;
                }
            }
            return null;
        },
        getScale: function () {
            return this.scales[this.zoom - 1];
        },
        /**
         * @public 屏幕转SVG
         * @param x 屏幕距离
         */
        screenToSVG: function (x) {
            return x / this.getScale();
        },
        /**
         * @public 设置ViewBox[x y]
         * @param vx
         * @param vy
         */
        setViewBoxXY: function (vx, vy) {
            this.viewBoxX = vx;
            this.viewBoxY = vy;
        },
        /**
         * @public 移动图层
         * @param x
         * @param y
         */
        move: function (x, y) {
            x = this.viewBoxX - x;
            y = this.viewBoxY - y;
            this.moveTo(x, y);
        },
        /**
         * @public 移动图层到指定
         * @param x screenToSVG
         * @param y screenToSVG
         */
        moveTo: function (x, y) {
            var scale = this.getScale();
            var vWidth = this.width / scale;
            var vHeight = this.height / scale;
            for (var index in this.layers) {
                var layer = this.layers[index];
                if (layer.elementType != "Tooltip") {
                    layer.setViewBox(x, y, vWidth, vHeight);
                }
            }
        },
        /**
         * @public 缩小
         */
        zoomOut: function () {
            var currentIndex = this.zoom;
            var max = this.scales.length;
            if (currentIndex < (1 + 1) || currentIndex > max) {
                return;
            }

            this.zoomTo(currentIndex - 1);
        },
        /**
         * @public 放大
         */
        zoomIn: function () {
            var currentIndex = this.zoom;
            var max = this.scales.length - 1;
            if (currentIndex < 1 || currentIndex > max) {
                return;
            }

            this.zoomTo(currentIndex + 1);
        },
        /**
         * @public 缩放
         * @param zoom
         * @param xy
         */
        zoomTo: function (zoom, xy) {
            var vx = xy ? xy.x : this.viewBoxX;
            var vy = xy ? xy.y : this.viewBoxY;
            this.zoom = zoom;
            this.moveTo(vx, vy);
        },
        /**
         * @public 添加弹出框
         * @param popup
         * @param x
         * @param y
         */
        addPopup: function (popup, x, y) {
            for (var index in this.layers) {
                var layer = this.layers[index];
                if (layer.elementType != "Tooltip") {
                    continue;
                }
                layer.addPopup(popup, x, y);
            }
        },
        addMenu: function (menu, x, y) {
            for (var index in this.layers) {
                var layer = this.layers[index];
                if (layer.elementType != "Tooltip") {
                    continue;
                }
                layer.addMenu(menu, x, y);
            }
        },
        /**
         * @public 清空图层数据
         */
        clear: function () {
            for (var index in this.layers) {
                this.layers[index].clear();
            }
        },
        /**
         * @public 取得画布大小
         */
        getBox: function () {
            var layer = this.getLayer($$.zIndex_Node), box;
            var newBox = new com.geo.Box(0, 0, this.width, this.height);
            if (!layer) {
                return newBox;
            }

            for (var i = 0; i < layer.childs.length; i++) {
                box = layer.childs[i].box;// 位置
                if (box.minX < newBox.minX) {
                    newBox.minX = box.minX;
                }
                if (box.minY < newBox.minY) {
                    newBox.minY = box.minY
                }
                if (box.maxX > newBox.maxX) {
                    newBox.maxX = box.maxX;
                }
                if (box.maxY > newBox.maxY) {
                    newBox.maxY = box.maxX;
                }
            }
            return newBox;
        },
        viewToSVG: function (x, y) {
            var ctm = this.container.getScreenCTM();
            var cx = this.screenToSVG(x - parseInt(ctm.e)) + this.viewBoxX;
            var cy = this.screenToSVG(y - parseInt(ctm.f)) + this.viewBoxY;

            return new com.geo.Point(cx, cy);
        }

    };
    $$.Graph = Graph;
})
;
/**
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2016/5/3
 */
NTopo.plugin(function ($$) {

    function CanvasLayer() {
        CanvasLayer.prototype.initialize.apply(this, arguments);
    }

    CanvasLayer.prototype = {
        initialize: function (id, graph, zIndex) {
            var canvas = document.createElement("canvas");
            canvas.style.position = "absolute";
            canvas.style.border = "1px solid #919191";

            canvas.width = "200";
            canvas.height = "150";
            canvas.style.bottom = "0px";
            canvas.style.right = "0px";
            canvas.style.zIndex = "1100";
            // 注册事件
            //var act = function (evt) {
            //    com.Event.stopImmediatePropagation(evt);
            //};
            //com.Event.addListener(div, "click", act);
            //com.Event.addListener(div, "mousedown", act);
            //com.Event.addListener(div, "contextmenu", act);

            this.id = id;
            this.elementType = "Canvas";
            this.container = canvas;
            this.zIndex = zIndex || 4;
            this.visible = false;

            this.addTo(graph);
            // 膺眼绘制
            this.drawEagle();
        },
        addTo: function (graph) {
            if (null != graph && this.graph !== graph) {
                this.graph = graph;
                this.graph.addLayer(this);
            }
        },
        setViewBox: function (vbx, vby, vbw, vbh) {
        },
        /**
         * 绘制鹰眼
         */
        drawEagle: function () {
            if (!this.visible) {
                this.container.style.display = "none";
                return;
            } else {
                this.container.style.display = "block";
            }

            var ctx = this.container.getContext("2d");
            var box = this.graph.getBox(), scale = 1.1;
            var width = this.graph.width, height = this.graph.height;
            var viewBoxX = this.graph.viewBoxX, viewBoxY = this.graph.viewBoxY;
            var svgScale = this.graph.getScale();

            // 取得视窗等比例放大的vw vh并扩大scale
            var vbw = Math.max(box.width(), width), vbh = Math.max(box.height(), height);
            var svb = Math.max(vbw / width, vbh / height) * scale;
            vbw = width * svb;
            vbh = height * svb;

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
            //console.log("width:" + width + ";height:" + height);
            //console.log("ratio:" + ratio + ";xRatio:" + xRatio + ";yRatio:" + yRatio);
            //console.log("scaleWidth:" + scaleWidth + ";scaleHeight:" + scaleHeight);
            //console.log("offsetX:" + offsetX + ";offsetY:" + offsetY);

            // 计算鹰眼视窗框
            var cx = (viewBoxX + offsetX * svb) * svgScale / ratio;
            var cy = (viewBoxY + offsetY * svb) * svgScale / ratio;
            var cw = scaleWidth ? width * scaleWidth / vbw : width * scaleHeight / vbh;
            var ch = scaleWidth ? height * scaleWidth / vbw : height * scaleHeight / vbh;

            // 全视图(缩小svg)
            var content = this.graph.container.outerHTML;
            var viewBox = "viewBox=\"" + [0, 0, vbw, vbh].join(" ") + "\"";
            content = content.replace(/viewBox=\"[-.0-9 ]+\"/g, viewBox);
            //console.log("content:" + content);

            canvg(this.container, content, {
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
         * @public 清空图层数据
         */
        clear: function () {
            var ctx = this.container.getContext("2d");
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
    };

    $$.CanvasLayer = CanvasLayer;
});
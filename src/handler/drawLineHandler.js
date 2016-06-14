/**
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2016/4/13
 */
NTopo.plugin(function ($$) {
    var extend = com.util.extend;

    function DrawLineHandler() {
        DrawLineHandler.prototype.initialize.apply(this, arguments);
    }

    var pro = extend({}, $$.Handler);
    DrawLineHandler.prototype = extend(pro, {
        initialize: function (graph) {
            this.graph = graph;

            this.startFlag = false;
            this.down = false;
            this.id = "";
            this.sx = 0;
            this.sy = 0;
            this.line = null;
        },
        setOption: function (option) {
            this.startFlag = option.startFlag;
            this.id = option.id;
            this.sx = option.sx;
            this.sy = option.sy;
        },
        /**
         * @private (未处理双击)
         * @param evt
         * @returns {boolean}
         */
        mouseDown: function (evt) {
            var ele = evt.target, node = ele.instance;
            if (!node || node.elementType === "Line") {// 非节点、线条事件
                return false;
            }
            if (node.id === this.id) {
                return false;
            }
            return this.down = true;
        },
        mouseMove: function (evt) {
            var point = this.graph.viewToSVG(evt.clientX, evt.clientY);
            //console.log("x:" + point.x + ";y:" + point.y);
            if (!this.line) {
                this.line = this.createLine(this.id);
            }

            if (this.startFlag) {
                this.drawDynLine(this.sx, this.sy, point.x, point.y);
            }
            return true;
        },
        mouseUp: function (evt) {
            var ele = evt.target, node = ele.instance, layer;
            if (this.down) {
                layer = this.graph.getLayer($$.zIndex_Link);
                if (layer.containsNode(node)) {
                    layer.removeNode(node);
                } else {
                    this.line.id = [this.id, node.id].join("_");
                    this.line.end = node.id;
                    this.line.paint();
                }
                this.graph.setHandler("dragHandler");
                this.down = false;
                this.startFlag = false;
                this.line = null;
            }
            return true;
        },
        createLine: function (id) {
            var line = new $$.Line({"start": id});
            var layer = this.graph.getLayer($$.zIndex_Link);
            layer.addNode(line);

            return line;
        },
        drawDynLine: function (sx, sy, ex, ey) {
            var sp = [sx, sy].join(",");
            var ep = [ex, ey].join(",");

            this.line.updateGeometry([sp, ep].join(" "));
        }
    });

    $$.DrawLineHandler = DrawLineHandler;
});
/**
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2016/4/6
 */
NTopo.plugin(function ($$) {
    var extend = com.util.extend;

    function DragHandler() {
        this.graph = null;
        this.down = false;
        this.move = false;
        this.startX = 0;
        this.startY = 0;
        DragHandler.prototype.initialize.apply(this, arguments);
    }

    var pro = extend({}, $$.Handler);
    DragHandler.prototype = extend(pro, {
        initialize: function (graph) {
            this.graph = graph;
        },
        mouseDown: function (evt) {
            var ui = evt.target, node;
            this.node = ui.instance;
            if (!this.node || this.node.elementType === "Line") {
                return false;// 非节点事件
            }

            // 节点平移(加入权限控制)
            this.down = true;
            this.startX = evt.clientX;
            this.startY = evt.clientY;
            com.Event.setCapture(this.graph.container);

            return true;
        },
        mouseMove: function (evt) {
            if (this.down == false) {
                return false;
            }

            // 临时移动node位置
            this.move = true;
            var offsetX = this.graph.screenToSVG(evt.clientX - this.startX);
            var offsetY = this.graph.screenToSVG(evt.clientY - this.startY);

            this.node.move(offsetX, offsetY);
            // 相应连线更新
            var lines = this.getLines(this.node.id);
            for (var i = 0; i < lines.length; i++) {
                lines[i].move(offsetX, offsetY, this.node.id);
            }
            return true;
        },
        mouseUp: function (evt) {
            if (this.down == false) {
                return (this.down = this.move = false);
            }

            com.Event.releaseCapture(this.graph.container);
            if (this.move == true) {// 移动
                var offsetX = this.graph.screenToSVG(evt.clientX - this.startX);
                var offsetY = this.graph.screenToSVG(evt.clientY - this.startY);
                this.node.move(offsetX, offsetY);
                this.node.point.move(offsetX, offsetY);
                // 相应连线更新
                var lines = this.getLines(this.node.id);
                for (var i = 0; i < lines.length; i++) {
                    lines[i].paint();
                }
            } else {// popup
                var popup = this.node.popup;
                if (popup) {
                    this.graph.addPopup(popup, evt.clientX, evt.clientY);
                }
                com.Event.stopImmediatePropagation(evt);
            }
            this.down = this.move = false;
            return true;
        },
        // 右键
        menuHandler: function (evt) {
            var ui = evt.target, node = ui.instance;
            if (!node || node.elementType === "Line") {
                return false;// 非节点事件
            }
            var menu = node.menu;
            if (menu) {
                this.graph.addMenu(menu, evt.clientX, evt.clientY);
            }
            return true;
        },
        getLines: function (id) {
            var layer = this.graph.getLayer($$.zIndex_Link), lines = [], line;
            if (!layer) {
                return lines;
            }
            for (var i = 0; i < layer.childs.length; i++) {
                line = layer.childs[i];
                if ((line.id).indexOf(id) >= 0) {
                    lines.push(line);
                }
            }
            return lines;
        }
    });

    $$.DragHandler = DragHandler;
});
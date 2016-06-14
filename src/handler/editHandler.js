/**
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2016/4/15
 */
NTopo.plugin(function ($$) {
    var extend = com.util.extend;

    function EditHandler() {
        EditHandler.prototype.initialize.apply(this, arguments);
    }

    var pro = extend({}, $$.Handler);
    EditHandler.prototype = extend(pro, {
        initialize: function (graph) {
            this.graph = graph;
            this.down = false;
            this.selectNode = null;
            this.selectCP = null;
        },
        mouseDown: function (evt) {
            var nodeDom = evt.target, node = nodeDom.instance;
            if (node && node.elementType === "Line") {// 线节点选中
                node.setSelected(true);
            } else {// 其它节点(清除选中状态,控点是例外)
                var point = this.graph.viewToSVG(evt.clientX, evt.clientY);
                var layer = this.graph.getLayer($$.zIndex_Link)/*, selectNode*/;
                this.selectNode = null;
                for (var i = 0; i < layer.childs.length; i++) {
                    node = layer.childs[i];
                    if (node.hitTest(point.x, point.y) > -1) {
                        this.selectNode = node;
                        this.selectCP = nodeDom;
                        this.down = true;
                    }
                    node.setSelected(this.selectNode && this.selectNode == node);
                }
                return this.selectNode ? true : false;
            }
            return true;
        },
        mouseMove: function (evt) {
            if (this.down == true) {
                var point = this.graph.viewToSVG(evt.clientX, evt.clientY);
                //this.selectNode.controlPointMove(point, evt.target);
                this.selectNode.controlPointMove(point, this.selectCP);
            }
            return this.down;
        },
        mouseUp: function (evt) {
            if (this.down == true) {
                this.down = false;
            }
            return this.down;
        },
        // 右键
        menuHandler: function (evt) {
            var nodeDom = evt.target, node = nodeDom.instance, menu;
            if (node && node.elementType === "Line") {// 线节点
                if (menu = node.menu) {
                    var point = this.graph.viewToSVG(evt.clientX, evt.clientY);
                    menu.setMenuClient(point.x, point.y);
                    this.graph.addMenu(menu, evt.clientX, evt.clientY);
                }
                return true;
            }
            return false;
        }
    });

    $$.EditHandler = EditHandler;
});
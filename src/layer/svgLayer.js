/**
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2016/3/22
 */
NTopo.plugin(function ($$) {
    var is = com.util.is;

    function SvgLayer() {
        SvgLayer.prototype.initialize.apply(this, arguments);
    }

    SvgLayer.prototype = {
        initialize: function (id, graph, zIndex) {
            var scale = graph.getScale();
            var vbw = graph.width / scale;
            var vbh = graph.height / scale;
            this.elementType = "SvgLayer";
            this.id = id;
            this.container = com.svg.svg({
                "id": this.id,
                "viewBox": this.toViewBox(vbw, vbh)
            });

            this.zIndex = zIndex || -1;
            this.childs = [];
            this.addTo(graph);
        },
        addTo: function (graph) {
            if (null != graph && this.graph !== graph) {
                this.graph = graph;
                this.graph.addLayer(this);
            }
        },
        setViewBox: function (vbx, vby, vbw, vbh) {
            com.svg.attr(this.container, {
                "viewBox": this.toViewBox(vbx, vby, vbw, vbh)
            });
        },
        toViewBox: function (vbx, vby, vbw, vbh) {
            switch (arguments.length + "") {
                case "4":
                    return [vbx, vby, vbw, vbh].join(" ");
                case "2":
                    return [0, 0, vbx, vby].join(" ");
                case "1":
                    return [0, 0, vbx, vbx].join(" ");
            }
        },
        containsNode: function (node) {
            return this.childs.indexOf(node) != -1;
        },
        addNode: function (node) {
            if (node == null && this.containsNode(node)) {
                return false;
            }
            if (null != this.graph) {
                this.childs.push(node);

                this.container.appendChild(node.container);
                node.layer = this;
                node.paint();
                // 膺眼绘制
                this.graph.drawEagle();
            }
        },
        getNode: function (id) {
            var node;
            for (var i = 0; i < this.childs.length; i++) {
                node = this.childs[i];
                if (node.id == id) {
                    return node;
                }
            }
            return null;
        },
        removeNode: function (node) {
            node = is(node, "string") ? this.getNode(node) : node;
            if (node != null) {
                this.container.removeChild(node.container);
                this.childs.splice(this.childs.indexOf(node), 1);
                node = null;// 销毁
            }
        },
        repaint: function () {

        },
        /**
         * @public 清空图层数据
         */
        clear: function () {
            this.childs = [];
            this.container.innerHTML = "";
        }
    };

    $$.SvgLayer = SvgLayer;
});
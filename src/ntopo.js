/**
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2016/3/22
 * 本版[元素节点只提供原始属性、数据属性,暂少业务属性]
 */
(function (window, $) {
    var NTopo = {
        version: "0.1.0",
        zIndex_Container: 1,// root
        zIndex_Link: 2,// 中间层
        zIndex_Node: 3,// 最上层
        zIndex_Eagle: 4,// 鹰眼
        plugin: function (f) {
            f(NTopo);
        }
    };

    $.fn.nTopo = $.fn.NTopo = function (options) {
        return new $.nTopo(this, options);
    };
    $.nTopo = function (ele, options) {
        if (!com.svg.supported) {
            var $img = $("<IMG/>").appendTo(ele);
            $img.width("600px").height("249px");
            $img.attr("src", "./theme/img/forie.png");
        } else {
            ele = ele instanceof jQuery ? ele[0] : ele;
            this.graph = new NTopo.Graph(ele);

            this.tooltip = new NTopo.DivLayer("tooltip", this.graph);
            this.lineLayer = new NTopo.SvgLayer("graph_line", this.graph, NTopo.zIndex_Link);
            this.nodeLayer = new NTopo.SvgLayer("graph_node", this.graph, NTopo.zIndex_Node);
            this.eagleLayer = new NTopo.CanvasLayer("eagle", this.graph, NTopo.zIndex_Eagle);
            if (options && options.eagle == "show") {
                this.eagleLayer.visible = true;
            }
        }
        return this;
    };

    $.nTopo.prototype = {
        addNode: function (option) {
            var layer = this.nodeLayer, node, path;
            if (layer) {
                path = "NTopo." + com.util.toFirstUpperCase(option["shape"]);
                node = com.util.getInstance(path, $.extend({}, option));
                layer.addNode(node);
            }
        },
        addLine: function (option) {
            var layer = this.lineLayer, line, path;
            if (layer) {
                path = "NTopo." + com.util.toFirstUpperCase(option["shape"]);
                line = com.util.getInstance(path, $.extend({}, option));
                layer.addNode(line);
            }
        },
        clear: function () {
            this.graph.clear();
        },
        /**
         * @public 导入XML数据
         * @param xmlStr
         */
        importFromXML: function (xmlStr) {
            this.clear();
            if (xmlStr && xmlStr.replace(/(^\s*)|(\s*$)/g, "") != "") {
                //var xmlHead = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
                this.loadXML("<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + xmlStr);
            }
        },
        showEagle: function (visible) {
            this.eagleLayer.visible = visible;
            if (visible) {
                this.graph.drawEagle();
            }
        },
        /**
         * 导出XML数据
         * @return xml
         */
        exportToXML: function () {
            var XmlUtil = com.XmlUtil;
            // 创建XML
            var topo = XmlUtil.createElement("topo"), item;
            /************ nodes ******************/
            var nodes = XmlUtil.createElement("nodes");
            var nodeList = this.nodeLayer.childs;// Array
            for (var i = 0; i < nodeList.length; i++) {
                item = nodeList[i].toFormatObj();
                item = XmlUtil.ObjectToXml("node", item);
                //console.log(XmlUtil.xmlToString(item));
                nodes.appendChild(item);
            }
            topo.appendChild(nodes);
            /************ lines ******************/
            var lines = XmlUtil.createElement("lines");
            var lineList = this.lineLayer.childs;// Array
            for (var i = 0; i < lineList.length; i++) {
                item = lineList[i].toFormatObj();
                item = XmlUtil.ObjectToXml("line", item);
                //console.log(XmlUtil.xmlToString(item));
                lines.appendChild(item);
            }
            topo.appendChild(lines);
            /************ types ******************/
            var types = XmlUtil.createElement("types");
            var typeList = this.types;// Array or null
            if (typeList) {
                typeList = $.isArray(typeList) ? typeList : [typeList];
                for (var i = 0; i < typeList.length; i++) {
                    item = typeList[i];
                    item = XmlUtil.ObjectToXml("type", item);
                    //console.log(XmlUtil.xmlToString(item));
                    types.appendChild(item);
                }
            }
            topo.appendChild(types);

            //console.log(XmlUtil.xmlToString(topo));
            return XmlUtil.xmlToString(topo);
        },
        /**
         * @private 加载xml字符串
         * @param xml
         */
        loadXML: function (xml) {
            var data = com.XmlUtil.xmlToJson(xml);
            if (this.nodeLayer && this.lineLayer) {
                var that = this, option = null;
                var types = data.types ? data.types.type : null;
                var nodes = data.nodes ? data.nodes.node : null;
                var lines = data.lines ? data.lines.line : null;
                // node
                if (nodes) {
                    nodes = $.isArray(nodes) ? nodes : [nodes];
                    $.each(nodes, function (i, item) {
                        option = that.getTypeByName(types, item["type"]);
                        option = option ? $.extend(true, {}, option, item) : item;
                        that.addNode(option);
                    });
                }
                // line
                if (lines) {
                    lines = $.isArray(lines) ? lines : [lines];
                    $.each(lines, function (i, item) {
                        option = that.getTypeByName(types, item["type"]);
                        option = option ? $.extend(true, {}, option, item) : item;
                        that.addLine(option);
                    });
                }

                // 保存type
                this.types = types;
            }
        },
        /**
         * @private 获取type
         * @param types
         * @param val
         * @return {}
         */
        getTypeByName: function (types, val) {
            if (types) {
                types = $.isArray(types) ? types : [types];
                var i = 0, type = null;
                for (; i < types.length; i++) {
                    type = types[i];
                    if (type["name"] && type["name"] == val) {
                        return type;
                    }
                }
            }
            return null;
        },
        /**
         * @private xml转option
         * @param nodeXml
         * @param typeList
         */
        markOption: function (nodeXml, typeList) {
            var option = this.xmlToObj(nodeXml), supOption;
            // 处理type(父类),多个要each合并(未处理)
            if (option.type && typeList) {
                for (var i = 0, len = typeList.length; i < len; i++) {
                    var typeXml = typeList[i];
                    if (com.XmlUtil.attribute(typeXml, "name") !== option.type) {
                        continue;
                    }

                    supOption = this.xmlToObj(typeXml, true);
                    if (supOption["component"] && option["component"]) {
                        option["component"] = option["component"].concat(supOption["component"]);
                    }
                    option = $.extend(supOption, option);
                }
            }
            return option;
        },
        /**
         * @private xml转化为对象
         * @param nodeXml xml数据
         * @param isSuper 是否为super
         * @returns {*}
         */
        xmlToObj: function (nodeXml, isSuper) {
            isSuper = isSuper ? isSuper : false;
            // 子节点property合并为attribute
            var option = this.childConvertAttr({}, nodeXml, "property", "key");
            // 子节点component处理
            option = this.childCompAttr(option, nodeXml, isSuper);
            // 节点attribute与合并的attribute覆盖
            $.extend(option, com.XmlUtil.attribute(nodeXml));

            return option;
        },
        childConvertAttr: function (target, xml, tagName, attrName) {
            var list, child, attrs, key;
            target = arguments[0] || {};
            list = com.XmlUtil.getNodesByTagName(xml, tagName);
            for (var i = 0, len = list.length; i < len; i++) {
                child = list[i];
                attrs = com.XmlUtil.attribute(child);
                if (child.hasChildNodes()
                    && child.firstChild.nodeType === 3) {// 文本节点
                    val = child.firstChild.nodeValue || "";
                } else {
                    val = attrs["value"] ? attrs["value"] : "";
                }
                key = attrs[attrName];
                target[key] = val;
            }
            return target;
        },
        childCompAttr: function (target, xml, isSuper) {
            var list = com.XmlUtil.getNodesByTagName(xml, "component");
            for (var i = 0; i < list.length; i++) {
                var option = com.XmlUtil.xmlToObject(list[i]);
                if (option.type === "popup") {
                    delete option["type"];
                    target["popup"] = option;
                } else if (option.type === "menu") {
                    delete option["type"];
                    target["menu"] = option["item"];
                } else {
                    if (!target["component"]) {
                        target["component"] = [];
                    }
                    if (isSuper) {
                        option["isSuper"] = "true";
                    }
                    target["component"].push(option);
                }
            }
            return target;
        }

    };


    window.NTopo = NTopo;
})
(window, jQuery);

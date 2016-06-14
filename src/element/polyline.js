/**
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2016/4/14
 */
NTopo.plugin(function ($$) {
    var is = com.util.is;

    function Polyline() {
        Polyline.prototype.initialize.apply(this, arguments);
    }

    Polyline.prototype = {
        initialize: function (option) {
            option = com.util.extend({}, option);// 克隆

            this.elementType = "Line";
            this.id = option.id || "";
            this.start = option.start || "";
            this.end = option.end || "";
            this.points = option.points || "";
            this.stroke = option.stroke || "white";
            this.strokeWidth = option.strokeWidth || 2;
            this.strokeDasharray = option.strokeDasharray;
            this.startText = option.sText || "";
            this.text = option.text || "";
            this.endText = option.eText || "";
            this.markerEnd = option.markerEnd || "ARROW";
            this.cpSize = 8;
            this.select = false;

            this.menu = ("Edit" == "Edit") ? new $$.Menu([{
                id: "addPoint",
                label: "添加控点",
                onclick: this.menuItemHander,
                node: this
            }], this) : null;

            this.delMenu = ("Edit" == "Edit") ? new $$.Menu([{
                id: "delPoint",
                label: "删除控点",
                onclick: this.menuItemHander,
                node: this
            }], this) : null;

            this.container = com.svg.g({
                "fill": "white",
                "stroke": "white",
                "stroke-dasharray": "",
                "stroke-linejoin": "bevel",
                "stroke-linecap": "round",
                "font-size": "12px",
                "font-family": "Arial",
                "text-anchor": "middle"
            });
            this.lineDom = null;
            this.cPointDom = [];
            this.sTextDom = null;
            this.textDom = null;
            this.eTextDom = null;
            this.markerEndDom = null;
            this.layer = null;
            this._data = null;
        },
        addLine: function (container) {
            var line = com.svg.polyline({
                "fill": "none",
                "stroke": this.stroke,
                "stroke-width": this.strokeWidth,
                "stroke-dasharray": this.strokeDasharray
            });
            container.appendChild(line);

            return line;
        },
        addText: function (container, text) {
            var text = com.svg.text({
                "text": text,
                "stroke": "none",
                "fill": this.stroke
            });
            container.appendChild(text);

            return text;
        },
        addMarker: function (container, marker) {
            var path;
            if (marker === "ARROW") {
                var per = this.strokeWidth / 2;
                var d = "M0,0L" + 5 * per * 2 + "," + 5 * per + "L0," + 5 * per * 2 + "Z";
                path = com.svg.path({
                    "d": d,
                    "stroke": "none",
                    "fill": this.stroke
                });
            }

            return path ? container.appendChild(path) : null;
        },
        /**
         * @private 添加控点DOM(drawControlPoint)
         * @param container
         * @return cpDom
         */
        addCPDom: function (container) {
            var fill = com.color.reverse(this.stroke || "white");
            var rectDom = com.svg.rect({
                "width": this.cpSize,
                "height": this.cpSize,
                "fill": fill,
                "stroke": "none",
                "style": "cursor:pointer"
            });
            com.Event.addListener(rectDom, "mousedown", com.Function.bind(this.cpDownHander, this));
            com.Event.addListener(rectDom, "contextmenu", com.Function.bind(this.contextMenuHander, this));
            return container.appendChild(rectDom);
        },
        /**
         * @private 删除控点DOM(drawControlPoint)
         * @param container
         * @param cpDom
         */
        delCPDom: function (container, cpDom) {
            if (cpDom) {
                com.Event.removeListener(cpDom, "mousedown", com.Function.bind(this.cpDownHander, this));
                com.Event.removeListener(cpDom, "contextmenu", com.Function.bind(this.contextMenuHander, this));
                container.removeChild(cpDom);
            }
        },
        /**
         * @private 控点右键事件
         * @param evt
         */
        cpDownHander: function (evt) {
            var graph = this.layer.graph;
            if (com.Event.isRightClick(evt)) {
                if (this.delMenu) {
                    graph.addMenu(this.delMenu, evt.clientX, evt.clientY);
                }
                com.Event.stopImmediatePropagation(evt);
            }
        },
        /**
         * @private 右键事件
         * @param evt
         */
        contextMenuHander: function (evt) {
            com.Event.stopImmediatePropagation(evt);
        },
        setCPVisible: function (visible) {
            var cp = this.cPointDom || [];
            for (i = 0; i < this.cPointDom.length; i++) {
                com.svg.attr(this.cPointDom[i], {
                    "visibility": visible ? "visible" : "hidden"
                });
            }
        },
        /**
         * @private 添加控点菜单事件
         * @param data
         */
        menuItemHander: function (data) {
            var line = data["node"];
            var id = data["id"];
            if (line && line[id]) {
                line[id](line.menu.menuClientX, line.menu.menuClientY);
            }
        },
        /**
         * @private 生成控点DOM
         */
        drawControlPoint: function (container) {
            if ("edit" == "edit" && this.select == true) {// 显示
                var points = this.points.split(" "), i = 0;
                for (len = points.length; i < len; i++) {
                    if (!this.cPointDom[i]) { // 加入
                        this.cPointDom[i] = this.addCPDom(container);
                    }
                }
                // 截断多余
                for (len = this.cPointDom.length; i < len; i++) {
                    this.delCPDom(container, this.cPointDom[i]);
                }
                this.cPointDom.length = points.length;
                this.setCPVisible(true);
            } else {// 隐藏
                this.setCPVisible(false);
            }
        },
        /**
         * @public 设置选中状态
         * @param select
         */
        setSelected: function (select) {
            this.select = select;
            if (this.points != "") {
                this.drawControlPoint(this.container);
                this.paint();
            }
        },
        /**
         * @public 改变控点位置并设置points
         * @param point
         * @param cp
         */
        controlPointMove: function (point, cp) {
            var box = cp.getBBox(), points, p;
            box = new com.geo.Box(box.x, box.y, box.x + box.width, box.y + box.height);
            points = this.points.split(" ");// points存在
            for (var i = 0; i < points.length; i++) {
                p = new com.geo.Point(points[i]);
                if (box.isContain(p.x, p.y)) {
                    points[i] = point.toString();
                    break;
                }
            }

            this.points = points.join(" ");
            this.paint();
        },
        /**
         * @private 构建box
         * @param point
         * @param cpSize
         * @returns {NTopo.Geometry.Box}
         */
        buildBox: function (point, cpSize) {
            cpSize = cpSize || this.cpSize;
            var x1 = point.x - cpSize / 2;
            var y1 = point.y - cpSize / 2;
            var x2 = point.x + cpSize / 2;
            var y2 = point.y + cpSize / 2;
            return new com.geo.Box(x1, y1, x2, y2);
        },
        /**
         * @public 测试包含控点
         * @param x
         * @param y
         * @returns {number}
         */
        hitTest: function (x, y) {
            var points = (this.points != "") ? this.points.split(" ") : [];
            for (var i = 0, len = points.length; i < len; i++) {
                var point = new com.geo.Point(points[i]);
                var bounds = this.buildBox(point);
                if (bounds.isContain(x, y)) {
                    return i;
                }
            }
            return -1;
        },
        /**
         * @public 添加控点
         * @param x
         * @param y
         */
        addPoint: function (x, y) {
            var point = new com.geo.Point(x, y);
            if (this.points == "") {
                this.points = point.toString();
            } else {
                var points = (this.points != "") ? this.points.split(" ") : [], node;
                if (node = this.getNode(this.start, $$.zIndex_Node)) {
                    points.unshift(node.point.toString());
                }
                if (node = this.getNode(this.end, $$.zIndex_Node)) {
                    points.push(node.point.toString());
                }
                for (var i = 0, len = points.length; i < len - 1; i++) {
                    var start = new com.geo.Point(points[i]);
                    var end = new com.geo.Point(points[i + 1]);
                    if (com.util.isPointInLine(point, start, end)) {
                        points.splice(i + 1, 0, point.toString());
                        break;
                    }
                }
                points.shift();
                points.pop();
                this.points = points.join(" ");
            }

            this.select = true;
            this.paint();
        },
        /**
         * @public 移除控点
         * @param x
         * @param y
         */
        delPoint: function (x, y) {
            var points = this.points.split(" "), tempPoints = [], point;
            for (var i = 0; i < points.length; i++) {
                point = new com.geo.Point(points[i]);
                var bounds = this.buildBox(point);
                if (bounds.isContain(x, y)) {
                    continue;
                }
                tempPoints.push(points[i]);
            }

            this.points = tempPoints.length > 0 ? tempPoints.join(" ") : "";
            this.paint();
        },
        /**
         * @public 绘制
         */
        paint: function () {
            if (!this.lineDom) {
                this.lineDom = this.addLine(this.container);
                this.lineDom.instance = this;
            }
            if (!this.sTextDom && this.startText != "") {
                this.sTextDom = this.addText(this.container, this.formatVal(this.startText, this._data));// 文字
            }
            if (!this.textDom && this.text != "") {
                this.textDom = this.addText(this.container, this.formatVal(this.text, this._data));// 文字
            }
            if (!this.eTextDom && this.endText != "") {
                this.eTextDom = this.addText(this.container, this.formatVal(this.endText, this._data));// 文字
            }
            if (!this.markerEndDom && this.markerEnd != "") {
                this.markerEndDom = this.addMarker(this.container, this.markerEnd);
            }
            // 绘控点
            if (this.points != "") {
                this.drawControlPoint(this.container);
            }
            this.move();
        },
        getNode: function (id, zIndex) {
            var graph = this.layer.graph;
            var layer = zIndex ? graph.getLayer(zIndex) : this.layer;

            return layer ? layer.getNode(id) : null;
        },
        textPoint: function (geometry, per) {
            var points = geometry != "" ? geometry.split(" ") : [];

            // String格式化为Point,并初始化长度数组
            var lds, total, curTotal, dis, st, end;
            for (var i = 0; i < points.length; i++) {
                points[i] = new com.geo.Point(points[i]);
                if (i == 0) {
                    lds = [];
                    total = 0;
                } else {
                    dis = com.util.distance(points[i - 1], points[i]);
                    lds[i - 1] = dis;
                    total += dis;
                }
            }
            // 计算比率坐标
            curTotal = total * per;
            for (var i = 0; i < lds.length; i++) {
                if ((dis = lds[i]) >= curTotal) {
                    per = curTotal / dis;
                    st = points[i];
                    end = points[i + 1];
                    break;
                } else {
                    curTotal -= dis;
                }
            }

            return {x: per * (end.x - st.x) + st.x, y: per * (end.y - st.y) + st.y};
        },
        pathTransform: function (st, end) {
            // ARROW
            var offY = this.strokeWidth / 2 * 5;
            var vect = {x: end.x - st.x, y: end.y - st.y};
            var len = Math.sqrt(vect.x * vect.x + vect.y * vect.y);
            var per = 1 - (14 + offY * 2) / len;
            var tx = st.x + vect.x * per;
            var ty = st.y + vect.y * per;

            var angle = Math.acos(vect.x / len);
            angle = 360 * angle / (2 * Math.PI);// 0--180
            if (vect.y < 0) {// 判断象限
                angle = 360 - angle;
            }

            return "translate(" + tx + "," + (ty - offY) + ") rotate (" + angle + " 0 " + offY + ")";
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
            // 更改线上文本
            this.updateText(data);

            return this;
        },
        /**
         * @private 格式化数据
         * @param val
         * @param node
         * @returns {String}
         */
        formatVal: function (val, data) {
            if (data) {
                for (var key in data) {
                    var reg = RegExp("\\\$\\{" + key + "\\}+?");
                    varl = val.replace(reg, data[key]);
                }
            }
            return val;
        },
        /**
         * @private 更新线上文本
         * @param data
         */
        updateText: function (data) {
            if (this.sTextDom) {
                com.svg.attr(this.sTextDom, {"text": this.formatVal(this.startText, data)});
            }
            if (this.textDom) {
                com.svg.attr(this.textDom, {"text": this.formatVal(this.text, data)});
            }
            if (this.endText) {
                com.svg.attr(this.endText, {"text": this.formatVal(this.endText, data)});
            }
        },
        /**
         * @public 更新(drawLineHandler.js)
         * @param geometry
         */
        updateGeometry: function (geometry) {
            if (geometry && geometry != "") {
                geometry = is(geometry, "string") ? geometry : geometry.getGeometryString();
                geometry = com.util.startReplaceWith(geometry, "Line");
                // 更新文字
                if (this.sTextDom) {
                    com.svg.attr(this.sTextDom, this.textPoint(geometry, .3));
                }
                if (this.textDom) {
                    com.svg.attr(this.textDom, this.textPoint(geometry, .5));
                }
                if (this.eTextDom) {
                    com.svg.attr(this.eTextDom, this.textPoint(geometry, .7));
                }
                // 更新线
                com.svg.attr(this.lineDom, {"points": geometry});
                // 更新控点
                var points = geometry.split(" "), len = points.length, point, cp;
                for (var i = 1; i < len - 1; i++) {
                    point = new com.geo.Point(points[i]);
                    if (cp = this.cPointDom[i - 1]) {
                        com.svg.attr(cp, {
                            "x": (point.x - this.cpSize / 2),
                            "y": (point.y - this.cpSize / 2)
                        });
                    }
                }
                // 箭头
                if (len > 1 && this.markerEndDom) {
                    var st = new com.geo.Point(points[len - 2]);
                    var end = new com.geo.Point(points[len - 1]);
                    com.svg.attr(this.markerEndDom, {"transform": this.pathTransform(st, end)});
                }
            }
        },
        /**
         * @public 移动线端/末
         * @param x
         * @param y
         * @param str 开端/末字符串
         */
        move: function (x, y, str) {
            if (this.start && this.end) {
                var sNode = this.getNode(this.start, $$.zIndex_Node);
                var eNode = this.getNode(this.end, $$.zIndex_Node);
                if (sNode && eNode) {
                    var geometry = [], point = sNode.point;
                    // 开端
                    if (this.start == str) {
                        geometry.push([point.x + x, point.y + y].join(","));
                    } else {
                        geometry.push(point.toString());
                    }
                    // 中端
                    if (this.points) {
                        geometry.push(this.points);
                    }
                    // 末端
                    point = eNode.point;
                    if (this.end == str) {
                        geometry.push([point.x + x, point.y + y].join(","));
                    } else {
                        geometry.push(point.toString());
                    }

                    this.updateGeometry(geometry.join(" "));
                }
            }
        },
        toFormatObj: function () {
            var result = {
                id: this.id,
                start: this.start,
                end: this.end
            };
            // 加入非默认属性
            if (this.points) {
                result["points"] = this.points;
            }
            if (this.stroke != "white") {
                result["stroke"] = this.stroke;
            }
            if (this.strokeDasharray) {
                result["strokeDasharray"] = this.strokeDasharray;
            }
            if (this.strokeWidth != 2) {
                result["strokeWidth"] = this.strokeWidth;
            }
            if (this.startText) {
                result["sText"] = this.startText;
            }
            if (this.text) {
                result["text"] = this.text;
            }
            if (this.endText) {
                result["eText"] = this.endText;
            }
            if (this.markerEnd != "ARROW") {
                result["markerEnd"] = this.markerEnd;
            }
            return result;
        }
    };

    $$.Polyline = Polyline;
})
;
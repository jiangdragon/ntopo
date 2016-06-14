/**
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2016/4/19
 */
NTopo.plugin(function ($$) {
    var is = com.util.is;

    function Line() {
        Line.prototype.initialize.apply(this, arguments);
    }

    Line.prototype = {
        initialize: function (option) {
            option = com.util.extend({}, option);// 克隆

            this.elementType = "Line";
            this.id = option.id || "";
            this.start = option.start || "st";
            this.end = option.end || "";
            this.stroke = option.stroke || "white";
            this.strokeDasharray = option.strokeDasharray;
            this.strokeWidth = option.strokeWidth || 2;
            this.startText = option.sText || "";
            this.text = option.text || "";
            this.endText = option.eText || "";
            this.markerEnd = option.markerEnd || "ARROW";

            this.menu = null;
            this.lineDom = null;
            this.sTextDom = null;
            this.textDom = null;
            this.eTextDom = null;
            this.markerEndDom = null;
            this.layer = null;
            this._data = null;

            this.container = com.svg.g({
                "fill": "white",
                "stroke": "white",
                "stroke-dasharray": this.strokeDasharray,
                "stroke-linejoin": "bevel",
                "stroke-linecap": "butt",
                "font-size": "12px",
                "font-family": "Arial",
                "text-anchor": "left"
            });
        },
        /**
         * @private 添加线
         * @param container
         * @returns {*|SVGDOM}
         */
        addLine: function (container) {
            var line = com.svg.line({
                "fill": "none",
                "stroke": this.stroke,
                "stroke-width": this.strokeWidth
            });
            container.appendChild(line);

            return line;
        },
        /**
         * @private 添加文本
         * @param container
         * @param text
         * @returns {*}
         */
        addText: function (container, text) {
            var text = com.svg.text({
                "text": text,
                "stroke": "none",
                "fill": this.stroke
            });

            return container.appendChild(text);
        },
        addMarker: function (container, marker) {
            var path;
            if (marker === "ARROW") {
                var per = this.strokeWidth / 2;
                var d = "M0,0L" + 5 * per * 2 + "," + 5 * per + "L0," + 5 * per * 2 + "Z";
                path = com.svg.path({
                    //"d": "M0,0L20,5L0,10Z",
                    "d": d,
                    "stroke": "none",
                    "fill": this.stroke
                });
            }

            return path ? container.appendChild(path) : null;
        },
        /**
         * @private 格式化文本内容
         * @param val
         * @param data
         * @returns {*}
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
         * @private 计算文本位置
         * @param geometry
         * @param per
         * @returns {{x: *, y: *}}
         */
        textPoint: function (geometry, per) {
            var points = geometry != "" ? geometry.split(" ") : [];
            if (points.length > 1) {
                var st = new com.geo.Point(points[0]);
                var end = new com.geo.Point(points[1]);
                return {x: per * (end.x - st.x) + st.x, y: per * (end.y - st.y) + st.y};
            }
            return {x: 0, y: 0};
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
         * @public 重绘
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
            // 不存在控点
            this.move();
        },
        /**
         * @public 移动
         * @param x
         * @param y
         * @param str
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
        getNode: function (id, zIndex) {
            var graph = this.layer.graph;
            var layer = zIndex ? graph.getLayer(zIndex) : this.layer;

            return layer ? layer.getNode(id) : null;
        },
        setSelected: function (select) {
            //this.select = true;
        },
        /**
         * @public 测试包含控点
         * @param x
         * @param y
         * @returns {number}
         */
        hitTest: function (x, y) {
            return -1;
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
                var points = geometry.split(" ");
                if (points.length > 1) {
                    var st = new com.geo.Point(points[0]);
                    var end = new com.geo.Point(points[1]);
                    com.svg.attr(this.lineDom, {x1: st.x, y1: st.y, x2: end.x, y2: end.y});
                    if (this.markerEndDom) {
                        com.svg.attr(this.markerEndDom, {"transform": this.pathTransform(st, end)});
                    }
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
            if (this.markerEnd && this.markerEnd != "ARROW") {
                result["markerEnd"] = this.markerEnd;
            }
            return result;
        }
    };

    $$.Line = Line;
});
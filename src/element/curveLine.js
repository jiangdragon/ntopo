/**
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2016/4/19
 */
NTopo.plugin(function ($$) {
    var is = com.util.is;
    var extend = com.util.extend;

    function CurveLine() {
        CurveLine.prototype.initialize.apply(this, arguments);
    }

    var pro = extend({}, $$.Line.prototype);
    CurveLine.prototype = extend(pro, {
        initialize: function () {
            $$.Line.prototype.initialize.apply(this, arguments);
            this.markerEnd = "";
        },
        /**
         * @private 添加线
         * @param container
         * @returns {*|SVGDOM}
         */
        addLine: function (container) {
            var path = com.svg.path({
                "fill": "none",
                "stroke": this.stroke,
                "stroke-width": this.strokeWidth
            });

            return container.appendChild(path);
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
                    var cx = (st.x + end.x) / 2;
                    var cy = end.y;
                    var d = "M " + st.toString() + " Q " + [cx, cy].join(",");
                    com.svg.attr(this.lineDom, {d: d + " " + end.toString()});
                    if (this.markerEndDom) {
                        com.svg.attr(this.markerEndDom, {"transform": this.pathTransform(st, end)});
                    }
                }
            }
        }
    });

    $$.CurveLine = CurveLine;
});
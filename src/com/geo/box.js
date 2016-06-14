/**
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2016/4/20
 */
com.plugin(function (com) {
    var is = com.util.is;

    function Box() {
        this.minX = this.minY = this.maxX = this.maxY = 0;
        Box.prototype.initialize.apply(this, arguments);
    }

    // 原型链
    Box.prototype = {
        constructor: Box,
        initialize: function (x1, y1, x2, y2) {
            var len = arguments.length;
            if (len == 0) {
                x1 = y1 = x2 = y2 = 0;
            } else if (len == 1 && !x1) {
                if (is(x1, "string")) {
                    x1 = x1.split(",")
                }
                if (is(x1, "array")) {
                    y1 = x1[1] || 0;
                    x2 = x1[2] || 0;
                    y2 = x1[3] || 0;
                    x1 = x1[0] || 0;
                }
            } else if (len == 3) {
                throw new Error("args must be four !");
            }
            this.minX = parseFloat(x1);
            this.minY = parseFloat(y1);
            this.maxX = parseFloat(x2);
            this.maxY = parseFloat(y2);

            return this;
        },
        width: function (width) {
            if (arguments.length === 0) {
                return this.maxX - this.minX;
            }

            this.maxX = this.minX + parseFloat(width);
            return this;
        },
        height: function (height) {
            if (arguments.length === 0) {
                return this.maxY - this.minY;
            }

            this.maxY = this.minY + parseFloat(height);
            return this;
        },
        isContain: function (x, y) {
            if (this.minX <= x && x <= this.maxX) {
                if (this.minY <= y && y <= this.maxY) {
                    return true;
                }
            }
            return false;
        },
        setCenter: function (point, width, height) {
            return this.centerAt(point.x, point.y, width, height);
        },
        centerAt: function (cx, cy, width, height) {
            cx = parseFloat(cx);
            cy = parseFloat(cy);
            width = width ? parseFloat(width) : (this.maxX - this.minX) / 2;
            height = height ? parseFloat(height) : (this.maxY - this.minY) / 2;

            this.minX = cx - width;
            this.maxX = cx + width;
            this.minY = cy - height;
            this.maxY = cy + height;

            return this;
        },
        getGeometryString: function () {
            return "Box:" + this.minX + "," + this.minY + "," + this.maxX + "," + this.maxY;
        }
    };

    com.geo = com.geo || {};
    com.geo.Box = Box;
});
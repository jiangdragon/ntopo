/**
 * com.geo.Point
 * @require [com.util.js]
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2016/3/25
 */
com.plugin(function (com) {
    var is = com.util.is;

    function Point() {
        this.x = 0;
        this.y = 0;
        Point.prototype.initialize.apply(this, arguments);
    }

    // 原型链
    Point.prototype = {
        constructor: Point,
        initialize: function (x, y) {
            var len = arguments.length;
            if (len == 0) {
                return this;
            }
            if (len == 1) {
                if (!x) {
                    return this;
                }
                if (is(x, "string")) {
                    x = x.split(",")
                }
                if (is(x, "array")) {
                    y = x[1];
                    x = x[0];
                }
            }

            return this.setXY(x, y);
        },
        setXY: function (x, y) {
            return this.setX(x).setY(y);
        },
        setX: function (x) {
            if (x != null) {
                this.x = parseFloat(x);
            }
            return this;
        },
        setY: function (y) {
            if (y != null) {
                this.y = parseFloat(y);
            }
            return this;
        },
        move: function (x, y) {
            this.x += parseFloat(x);
            this.y += parseFloat(y);
        },
        clone: function () {
            return new Point(this.x, this.y);
        },
        getGeoName: function () {
            return "com.geo.Point";
        },
        toString: function () {
            return this.x + "," + this.y;
        }
    };

    com.geo = com.geo || {};
    com.geo.Point = Point;
});

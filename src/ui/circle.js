/**
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2016/4/12
 */
NTopo.plugin(function ($$) {
    var extend = com.util.extend;

    function Circle() {
        $$.Animate.initialize.apply(this);
        Circle.prototype.initialize.apply(this, arguments);
    }

    var pro = extend({}, $$.Animate);
    Circle.prototype = extend(pro, {
        initialize: function (option, node) {
            option = extend({}, option);// 克隆

            this.offset = new com.geo.Point(option.offset || "");
            this.r = option.r;
            this.fill = option.fill;
            this.match = option.match || [];
            this.match = com.util.isArray(this.match) ? this.match : [this.match];

            this.node = node;

            var point = node.point;
            var cx = this.offset.x + point.x;
            var cy = this.offset.y + point.y;
            this.container = com.svg.circle({
                "cx": cx,
                "cy": cy,
                "r": this.r,
                "fill": this.fill
            });
            // 动画(2帧/秒)
            this.animate(1000 / 2);

            return this;
        },
        moveTo: function (x, y) {
            var cx = this.offset.x + x;
            var cy = this.offset.y + y;
            com.svg.attr(this.container, {
                "cx": cx,
                "cy": cy
            })
        },
        upData: function () {
            var matchs = this.match, len;
            if (!com.util.isArray(matchs)) {
                matchs = [matchs];
            }
            if ((len = matchs.length) == 0) {
                return false;
            }

            var data = this.node.data();
            var attr = {}, target, condition, value;
            for (var i = 0; i < len; i++) {
                condition = matchs[i]["condition"];
                target = matchs[i]["target"];
                value = matchs[i]["value"];
                if (this.matchData(condition, data)) {
                    if (target === "blink") {
                        target = "opacity";
                        value = this.opBlink % 2;// [透明度为1 0]
                        this.opBlink = value + 1;
                    }
                    attr[target] = value;
                } else if (target === "blink") {// 停止闪(透明度为1)
                    attr["opacity"] = 1;
                    this.opBlink = 1;
                }
            }
            com.svg.attr(this.container, attr);
        },
        /**
         * @private 匹配规则
         * @param condition
         * @param data
         * @returns {*}
         */
        matchData: function (condition, data) {
            if (!condition) {
                return false;
            }
            // condition="true"(可以更改属性)
            if (condition === "true" || condition === true) {
                return true;
            }
            // condition="${aram} > 3"
            for (var key in data) {
                var reg = RegExp("\\\$\\{" + key + "\\}+?");
                condition = condition.replace(reg, data[key]);
            }
            try {
                return this.fn(condition)();
            } catch (e) {
                //console.log("Error:" + e.message);
            }
            return false;
        },
        /**
         * @private 字符串转函数
         * @param str
         * @returns {Function}
         */
        fn: function (str) {
            return new Function("return " + str + ";");
        }

    });

    $$.Circle = Circle;
});
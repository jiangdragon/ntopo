/**
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2016/3/25
 */
com.plugin(function (com) {
    var has = "hasOwnProperty";
    var Str = String, class2type = {};
    var toString = Object.prototype.toString;
    var util = com.util = com.util || {};

    /**
     * Array 添加each静态方法
     * @type {Function|*}
     */
    Array.prototype.each = Array.prototype.each || function (fun /*, thisp*/) {
        var len = this.length;
        if (typeof fun != "function") {
            throw new TypeError();
        }
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            fun.call(thisp, i, this[i], this);
        }
    };

    "Boolean Number String Function Array Date RegExp Object".split(" ").each(function (i, name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });

    util.type = function (obj) {
        return obj == null ? String(obj) : class2type[toString.call(obj)] || "object";
    };

    util.is = function (o, type) {
        type = Str.prototype.toLowerCase.call(type);
        if (type == "finite") {// 无限大
            return isFinite(o);
        }
        if (type == "array" &&
            (o instanceof Array || Array.isArray && Array.isArray(o))) {
            return true;
        }
        return (type == "null" && o === null) ||
            (type == typeof o && o !== null) ||
            (type == "object" && o === Object(o)) ||
            toString.call(o).slice(8, -1).toLowerCase() == type;
    };

    util.isFunction = function (obj) {
        return util.type(obj) === "function";
    };

    util.isArray = function (obj) {
        return util.type(obj) === "array";
    };

    util.extend = function (destination, source) {
        destination = destination || {};
        if (source) {
            for (var property in source) {
                var value = source[property];
                if (value !== undefined) {
                    destination[property] = value;
                }
            }

            /**
             * IE doesn't include the toString property when iterating over an object's
             * properties with the for(property in object) syntax.  Explicitly check if
             * the source has its own toString property.
             */

            /*
             * FF/Windows < 2.0.0.13 reports "Illegal operation on WrappedNative
             * prototype object" when calling hawOwnProperty if the source object
             * is an instance of window.Event.
             */

            var sourceIsEvt = typeof window.Event == "function" && source instanceof window.Event;
            if (!sourceIsEvt && source[has] && source[has]("toString")) {
                destination.toString = source.toString;
            }
        }
        return destination;
    };

    /**
     * @public 过滤以XX开始字符
     * @param str
     * @param start
     * @returns {*}
     */
    util.startReplaceWith = function (str, start) {
        var reg = RegExp("^" + start + ":\\s*");
        return reg.test(str) ? str.replace(reg, "") : str;
    };

    util.distance = function (a, b) {
        var e = b.x - a.x;
        var f = b.y - a.y;

        return Math.sqrt(e * e + f * f);
    };

    util.isPointInLine = function (a, b, c) {
        var d = util.distance(b, c);
        var e = util.distance(b, a);
        var f = util.distance(c, a);

        return Math.abs(e + f - d) <= .5;
    };

    util.getInstance = function (path, option) {
        //var path = arguments[0];
        //var newArgs = Array.prototype.slice.call(arguments).slice(1);
        if (typeof path === "string") {
            var funcs = path.split(".");// 支持 obj.func1.func2
            path = window;
            for (var i = 0; i < funcs.length; i++) {
                path = path[funcs[i]];
            }

            if (util.isFunction(path)) {
                return new path(option);
            } else {
                throw new Error("can't find class function!");
            }
        }
        if (typeof path !== "string") {
            throw new Error("can't find class path!");
        }
        return null;
    };

    util.toFirstUpperCase = function (letters) {
        return letters.replace(/(^|\s+)\w/g, function (s) {
            return s.toUpperCase();
        });
    };

});
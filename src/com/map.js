/**
 * map.js
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2016/5/18
 */
com.plugin(function (com) {
    function Map() {
        /** 存放键的数组(遍历用到) */
        this.keys = new Array();
        /** 存放数据 */
        this.data = new Object();
    }

    Map.prototype = {
        /**
         * 放入一个键值对
         * @param {String} key
         * @param {Object} value
         */
        put: function (key, value) {
            if (this.data[key] == null) {
                this.keys.push(key);
            }
            this.data[key] = value;
        },
        /**
         * 获取某键对应的值
         * @param {String} key
         * @return {Object} value
         */
        get: function (key) {
            return this.data[key];
        },
        /**
         * 删除一个键值对
         * @param {String} key
         */
        remove: function (key) {
            //this.keys.remove(key);
            //this.data[key] = null;
            var len = this.keys.length;
            for (var i = 0; i < len; i++) {
                if (s == this.keys[i]) {
                    this.keys.splice(i, 1);
                    break;
                }
            }
            delete this.data[key];
        },
        //判断MAP中是否含有指定KEY的元素
        containsKey: function (key) {
            var len = this.keys.length;
            for (var i = 0; i < len; i++) {
                if (key == this.keys[i]) {
                    return true;
                }
            }
            return false;
        },
        /**
         * 遍历Map,执行处理函数
         *
         * @param {Function} 回调函数 function(key,value,index){..}
         */
        each: function (fn) {
            if (typeof fn != 'function') {
                return;
            }
            var len = this.keys.length;
            for (var i = 0; i < len; i++) {
                var k = this.keys[i];
                fn(k, this.data[k], i);
            }
        },
        /**
         * 获取键值数组(类似Java的entrySet())
         * @return 键值对象{key,value}的数组
         */
        entrys: function () {
            var len = this.keys.length;
            var entrys = new Array(len);
            for (var i = 0; i < len; i++) {
                entrys[i] = {
                    key: this.keys[i],
                    value: this.data[i]
                };
            }
            return entrys;
        },
        /**
         * 判断Map是否为空
         */
        isEmpty: function () {
            return this.keys.length == 0;
        },
        /**
         * 获取键值对数量
         */
        size: function () {
            return this.keys.length;
        },
        /**
         * 重写toString
         */
        toString: function () {
            var s = "{";
            for (var i = 0; i < this.keys.length; i++, s += ',') {
                var k = this.keys[i];
                s += k + "=" + this.data[k];
            }
            s += "}";
            return s;
        }
    };

    com.Map = Map;
});
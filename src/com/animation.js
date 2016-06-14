/**
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2016/4/13
 */
com.plugin(function (com) {

    /**
     * Function: requestNextAnimationFrame
     * 参考:RequestAnimationFrame.js 最优帧动画事件
     *
     * @param callBack:{Function} the callBack function
     *
     * @returns:{Function}
     */
    var requestNextAnimationFrame = function (callBack) {
        var animation = window.requestAnimationFrame
            || window.webkitRequestAnimationFrame
            || window.mozRequestAnimationFrame
            || window.oRequestAnimationFrame
            || window.msRequestAnimationFrame || function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
        return animation(callBack);
    };

    function Animation() {
        // private properties
        this._running = false;
        //this._clips = [];
        //this._time = 0;
        this._fn = null;
        this._frameInterval = 1000 / 5;
        this._lastTime = 0;
    }

    Animation.prototype = {
        //add: function (clip) {
        //    this._clips.push(clip);
        //},
        addCallBack: function (fn, time) {
            this._fn = fn;
            this._frameInterval = time;
        },
        /**
         * 更新动画片段
         * @private
         */
        _update: function () {
            var now = new Date();
            if ((now - this._lastTime) > this._frameInterval) {
                if (this._fn) {
                    this._fn();
                }
                this._lastTime = now;
            }
        },
        /**
         * 开始运行动画
         */
        start: function () {
            var self = this;
            this._running = true;

            function step() {
                if (self._running) {
                    requestNextAnimationFrame(step);
                    self._update();
                }
            }

            //this._time = new Date().getTime();
            requestNextAnimationFrame(step);
        },
        /**
         * 停止运行动画
         */
        stop: function () {
            this._running = false;
        }
        ///**
        // * 多个属性的动画
        // * @param target
        // * @param loop
        // * @returns {Animator}
        // */
        //animate: function (target, loop) {
        //    var deferred = new Animator(target, loop);
        //
        //    deferred.animation = this;
        //    return deferred;
        //}
    };

    com.Animation = Animation;
});
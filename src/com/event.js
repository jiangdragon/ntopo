/**
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2016/4/6
 */
com.plugin(function (com) {

    var evt = com.Event = com.Event || {};

    /**
     * 注册事件
     * @param obj
     * @param target
     * @param act
     */
    evt.addListener = function (obj, target, act) {
        if (obj.addEventListener) {
            obj.addEventListener(target, act, false);
        } else if (obj.attachEvent) {
            obj.attachEvent("on" + target, act);
        }
    };

    /**
     * 销毁事件
     * @param obj
     * @param target
     * @param act
     */
    evt.removeListener = function (obj, target, act) {
        if (obj.removeEventListener) {
            obj.removeEventListener(target, act, false);
        } else if (obj.detachEvent) {
            obj.detachEvent("on" + target, act);
        }
    };

    /**
     * 阻止事件
     * @param evt
     */
    evt.stopImmediatePropagation = function (evt) {
        evt.preventDefault(evt);
        evt.stopPropagation(evt);
    };

    /**
     * 阻止事件传播
     * @param evt {Mouse.Event}
     */
    evt.preventDefault = function (evt) {
        if (!evt) {
            return;
        }
        // if preventDefault exists run it on the original event
        if (evt.preventDefault) {
            evt.preventDefault();
        } else {
            evt.returnValue = false;
        }
    };

    /**
     * 停止事件
     * @param evt {Mouse.Event}
     */
    evt.stopPropagation = function (evt) {
        if (!evt) {
            return;
        }
        // if stopPropagation exists run it on the original event
        if (evt.stopPropagation) {
            evt.stopPropagation();
        }
        evt.cancelBubble = true;
    };

    /**
     * 是否是右键
     * @param evt
     * @returns {Object|which|*|H.which|boolean}
     */
    evt.isRightClick = function (evt) {
        return (evt.which && evt.which == 3) || (evt.button && evt.button == 2);
    };

    /**
     * 鼠标捕获，IE & firefox
     * @param ele
     */
    evt.setCapture = function (ele) {
        if (ele.setCapture) {
            ele.setCapture();
        } else if (window.captureEvents) {
            window.captureEvents(window.Event.MOUSEMOVE | window.Event.MOUSEUP);
        }
    };

    /**
     * 取消鼠标捕获
     * @param ele
     */
    evt.releaseCapture = function (ele) {
        if (ele.releaseCapture) {
            ele.releaseCapture();
        } else if (window.releaseEvents) {
            window.releaseEvents(window.Event.MOUSEMOVE | window.Event.MOUSEUP);
        }
    };


});
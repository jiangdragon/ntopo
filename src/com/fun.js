/**
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2016/4/6
 */
com.plugin(function (com) {

    var fn = com.Function = com.Function || {};

    fn.bind = function (func, object) {
        var args = Array.prototype.slice.apply(arguments, [ 2 ]);
        return function() {
            // Push on any additional arguments from the actual function call.
            // These will come after those sent to the bind call.
            var newArgs = args.concat(Array.prototype.slice.apply(arguments,
                [ 0 ]));
            return func.apply(object, newArgs);
        };
    };

    fn.bindAsEventListener = function (func, object) {
        return function (event) {
            return func.call(object, event || window.event);
        };
    };

});
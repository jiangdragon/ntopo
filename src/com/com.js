/**
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2016/3/25
 */
(function (window) {

    var com = window.com || {};
    if (!com.plugin) {
        com.plugin = function (f) {// 构建插件
            f(com);
        };
    }
    window.com = com;

})(window);

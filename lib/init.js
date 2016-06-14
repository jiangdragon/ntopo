/**
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2015/12/2
 */
$(function () {
    $("body").layout({
        west: {
            size: 200,
            initHidden: false
        },
        north: {
            initHidden: true
        }
    });

    changeRightPaneSize();

    // menu注册事件
    $('#menu a').click(function () {
        var $ui = $(this);
        $('#menu .ui-state-hover').removeClass('ui-state-hover');
        $ui.parent().addClass('ui-state-hover');
        var url = $ui.attr('rel');
        url = url.length > 0 ? ("./example/" + url) : "";
        $('#mainFrame').attr('src', url);
    });
    // 窗体变化
    window.onresize = function () {
        setTimeout(changeRightPaneSize, 500);
    };
});

/**
 * 改变rightPane尺寸大小
 */
function changeRightPaneSize() {
    var $mainFrame = $("#mainFrame");
    var $rightPane = $("#rightPane");
    $mainFrame.width($rightPane.width() - 4);
    $mainFrame.height($rightPane.height() - 4);
}


function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
}
function isURL(url) {
    var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
        + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp user@
        + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // URL in IP format- 199.194.52.184
        + "|" // allowed ip and domain name
        + "([0-9a-z_!~*'()-]+\.)*" // domain name- www.
        + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // second level domain name
        + "[a-z]{2,6})" // first level domain- .com or .museum
        + "(:[0-9]{1,4})?" // port- :80
        + "((/?)|" // a slash isn't required if there is no file name
        + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    var re = new RegExp(strRegex);
    return re.test(url);
}
function isJsCss(url) {
    var strRegex = "(js|css)$";
    var re = new RegExp(strRegex);
    return re.test(url);
}
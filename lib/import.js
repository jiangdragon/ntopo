/**
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2015/12/30
 */
function Import(path) {
    if (path.match(/\.js$/i)) {
        document.write("<script type=\"text/javascript\" src=\"" + path + "\"></script>");
    } else if (path.match(/\.css$/i)) {
        document.write("<style type=\"text/css\">@import " + "\"" + path + "\";</style>");
    }
}

Import("../../third-party/jquery/jquery-1.7.1.min.js");
Import("../lib/codemirror.js");
Import("../lib/codemirror-xml.js");
Import("../lib/jquery.xml2json.js");

Import("../lib/rgbcolor.js");
Import("../dist/ntopo-min.js");

//Import("../lib/canvg.js");
//// 公共包
//Import("../src/com/com.js");
//Import("../src/com/animation.js");
//Import("../src/com/color.js");
//Import("../src/com/element.js");
//Import("../src/com/event.js");
//Import("../src/com/fun.js");
//Import("../src/com/map.js");
//Import("../src/com/util.js");
//Import("../src/com/xmlUtil.js");
//Import("../src/com/svg.js");
//Import("../src/com/geo/point.js");
//Import("../src/com/geo/box.js");
//// ntopo包
//Import("../src/ntopo.js");
//Import("../src/graph.js");
//Import("../src/util.js");
//Import("../src/handler/handler.js");
//Import("../src/handler/dragHandler.js");
//Import("../src/handler/drawLineHandler.js");
//Import("../src/handler/editHandler.js");
//Import("../src/handler/panHandler.js");
//Import("../src/layer/canvasLayer.js");
//Import("../src/layer/divLayer.js");
//Import("../src/layer/svgLayer.js");
//Import("../src/ui/animate.js");
//Import("../src/ui/circle.js");
//Import("../src/ui/menu.js");
//Import("../src/ui/popup.js");
//Import("../src/element/imageText.js");
//Import("../src/element/line.js");
//Import("../src/element/curveLine.js");
//Import("../src/element/polyline.js");
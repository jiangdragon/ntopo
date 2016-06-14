/**
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2016/3/22
 */
(function (window) {
    var SVG_NS = "http://www.w3.org/2000/svg";
    var SVG_XLINK = "http://www.w3.org/1999/xlink";
    var SVG_XA3 = "http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/";
    var svg = {
        createENS: function (name, svgDoc) {
            svgDoc = svgDoc || document;
            return svgDoc.createElementNS(SVG_NS, name);
        },
        setNameSpace: function (svg) {
            svg.setAttribute("xmlns", SVG_NS);
            svg.setAttribute("version", "1.1");
            svg.setAttribute("width", "100%");
            svg.setAttribute("height", "100%");
            svg.setAttribute("xmlns:xlink", SVG_XLINK);
            svg.setAttribute("xmlns:a3", SVG_XA3);
            return svg;
        },
        createImage: function (option) {
            var image = svg.createENS("image");
            if (option["href"]) {
                //image.setAttributeNS(SVG_XLINK, "xlink:href", option.href);//静态
                image.setAttributeNS(SVG_XLINK, "href", option.href);//动态
                delete option["href"];
            }
            //attr(image, option);
            image.setAttribute("width", option.width);
            image.setAttribute("height", option.height);
            return image;
        },
        createText: function (option) {
            var textName = document.createTextNode(option.text);
            var text = svg.createENS("text");
            text.appendChild(textName);

            text.setAttribute("x", 0);
            text.setAttribute("y", 0);
            text.setAttribute("text", option.text);
            text.setAttribute("fill", option.fill);

            return text;
        },
        createRect: function (option) {
            var rect = svg.createENS("rect");
            rect.setAttribute("x", option.x);
            rect.setAttribute("y", option.y);
            rect.setAttribute("width", option.width);
            rect.setAttribute("height", option.height);
            rect.setAttribute("rx", option.rx);
            rect.setAttribute("ry", option.ry);
            rect.setAttribute("fill", option.fill);
            rect.setAttribute("fill-opacity", option["fill-opacity"]);
            rect.setAttribute("stroke", option.stroke);
            rect.setAttribute("style", option.style);

            return rect;
        }
    };
    window.SVG = svg;
})(window);
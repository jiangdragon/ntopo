/**
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2016/4/22
 */
com.plugin(function (com) {
    function XmlUtil() {

    }

    /**
     * 对象转xml元素
     * @param xml
     * @param tagName
     * @param obj
     * @param except
     * @returns {*}
     * @constructor
     */
    XmlUtil.ObjectToXml = function (xml, tagName, obj, except) {
        // 格式化数据参数
        if (typeof xml === "string") {
            except = obj;
            obj = tagName;
            tagName = xml;
            xml = XmlUtil.createElement(tagName);
        }
        // 字符串
        if (typeof obj === "string") {
            obj = obj.replace(">", "&gt;").replace("<", "&lt;");
            return xml.setAttribute(tagName, obj);
        }
        // Array
        var key, child;
        if (XmlUtil.isArray(obj)) {
            for (key = 0; key < obj.length; key++) {
                child = XmlUtil.ObjectToXml(tagName, obj[key], except);
                xml.appendChild(child);
            }
            return xml;
        }
        // Object
        for (key in obj) {
            if (key === except) {
                continue;
            }
            XmlUtil.ObjectToXml(xml, key, obj[key], except);
        }
        return xml;
    };
    /**
     * xml转字符串
     * @param xml
     * @returns {string}
     */
    XmlUtil.xmlToString = function (xml) {
        var sXml = "";
        switch (xml.nodeType) {
            case 1: //element
                sXml = "<" + xml.tagName;
                for (var i = 0; i < xml.attributes.length; i++) {
                    sXml += " " + xml.attributes[i].name + "=\"" + xml.attributes[i].value + "\"";
                }
                sXml += ">";
                for (var i = 0; i < xml.childNodes.length; i++) {
                    sXml += XmlUtil.xmlToString(xml.childNodes[i]);
                }
                sXml += "</" + xml.tagName + ">";
                break;
            case 3: //text node
                sXml = xml.nodeValue;
                break;
            case 4: //cdata
                sXml = "<![CDATA[" + xml.nodeValue + "]]>";
                break;
            case 7: //processing instruction
                sXml = "<?" + xml.nodevalue + "?>";
                break;
            case 8: //comment
                sXml = "<!--" + xml.nodevalue + "-->";
                break;
            case 9: //document
                for (var i = 0; i < xml.childNodes.length; i++) {
                    sXml += XmlUtil.xmlToString(xml.childNodes[i]);
                }
                break;
        }
        return sXml;
    };
    /**
     * 创建xml元素
     * @param targetName
     * @returns {*}
     */
    XmlUtil.createElement = function (targetName) {
        var xmlDoc = XmlUtil.textToXml("<?xml version=\"1.0\" encoding=\"UTF-8\"?><root/>");
        return xmlDoc.createElement(targetName);
    };

    /**
     * @public xml转json
     * @param xml {xml|xml字符串(不包括路径)}
     * @returns {*}
     */
    XmlUtil.xmlToJson = function (xml) {
        if (!xml) {
            return {};
        } else if (typeof xml == "string") {// convert String to Xml
            xml = XmlUtil.textToXml(xml);
        }

        // 非Xml
        if (!xml.nodeType) {
            return {};
        }
        // text node ||  <![CDATA[my escaped text]]>
        if (xml.nodeType == 3 || xml.nodeType == 4) {
            return xml.nodeValue;
        }
        // find root node
        var root = (xml.nodeType == 9) ? xml.documentElement : xml;

        return XmlUtil.parseXML(root);
    };

    /**
     * @public 字符串转为Xml
     * @param data
     */
    XmlUtil.textToXml = function (data) {
        var xml, tmp;
        try {
            if (window.DOMParser) { // Standard
                tmp = new DOMParser();
                xml = tmp.parseFromString(data, "text/xml");
            } else { // IE
                xml = new ActiveXObject("Microsoft.XMLDOM");
                xml.async = "false";
                xml.loadXML(data);
            }
        } catch (e) {
            xml = undefined;
        }

        if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
            throw new Error("Invalid XML: " + data);
        }
        return xml;
    };

    /**
     * @private 处理xml形成object
     * @param node
     */
    XmlUtil.parseXML = function (node, simple) {
        if (!node) {
            return null;
        }

        var txt = "", obj = null, att = null;

        var nodeType = node.nodeType;
        var nodeName = XmlUtil.formatName(node.localName || node.nodeName);
        var nodeVal = node.text || node.nodeValue || "";
        // childNodes
        var cNodes, cn, cnt, cnn, cnv;
        if (cNodes = node.childNodes) {
            for (var i = 0; i < cNodes.length; i++) {
                cn = cNodes[i], cnt = cn.nodeType;
                cnn = XmlUtil.formatName(cn.localName || cn.nodeName);
                cnv = cn.text || cn.nodeValue || "";
                if (cnt == 8) {// ignore comment node
                    continue;
                } else if (cnt == 3 || cnt == 4 || !cnn) {
                    if (cnv.match(/^\s+$/)) {
                        continue;
                    }
                    txt += cnv.replace(/^\s+/, "").replace(/\s+$/, "");
                } else {
                    obj = obj || {};
                    if (obj[cnn]) {
                        if (!obj[cnn].length) {
                            obj[cnn] = XmlUtil.toArray(obj[cnn]);
                        }
                        obj[cnn][obj[cnn].length] = XmlUtil.parseXML(cn, true/* simple */);
                        // 处理多个子文本,形如:<book><author>ad</author><author>bc</author></book>
                        obj[cnn].length = obj[cnn].length;
                    } else {
                        obj[cnn] = XmlUtil.parseXML(cn);
                    }
                }
            }
        }
        // attributes
        var nAttributes = node.attributes, at, atn, atv;
        if (nAttributes.length > 0) {
            att = {}, obj = obj || {};
            for (var i = 0; i < nAttributes.length; i++) {
                at = nAttributes[i];
                atn = XmlUtil.formatName(at.name);
                atv = at.value, att[atn] = atv;
                if (obj[atn]) {// 转换为数组
                    if (!obj[atn].length) {
                        obj[atn] = XmlUtil.toArray(obj[atn]);//[ obj[atn] ];
                    }
                    obj[atn].push(atv);
                } else { // 转换为对象
                    obj[atn] = atv;
                }
            }
        }

        if (obj) {
            obj = obj || {};
            if (obj.text) {
                txt = typeof(obj.text) == "object" ? obj.text : obj.text || "";
            }
            if (txt) {
                obj.text = txt;
            }
            txt = "";
        }

        return obj || txt;
    };

    /**
     * @private 替换字符串
     * @param s
     * @returns {string}
     */
    XmlUtil.formatName = function (s) {
        return String(s || '').replace(/-/g, "_");
    };
    /**
     * @private 转换为数组
     * @param o
     * @returns {Array}
     */
    XmlUtil.toArray = function (o) {
        if (!o.length) {
            o = [o];
        }
        //o.length = o.length;
        // here is where you can attach additional functionality, such as searching and sorting...
        return o;
    };
    /**
     * @private 是否是数字
     * @param s
     * @returns {boolean}
     */
    XmlUtil.isNum = function (s) {
        return (typeof s == "number") || String((s && typeof s == "string") ? s : '').test(/^((-)?([0-9]*)((\.{0,1})([0-9]+))?$)/);
    };

    XmlUtil.isArray = function (o) {
        return Object.prototype.toString.call(o) === "[object Array]";
    };
    /**
     * 把字符串整理成xml缩进的字符串
     * @param text
     */
    XmlUtil.formatXmlString = function (text) {
        // 去掉多余的空格
        text = text.replace(/(<\w+)(\s.*?>)/g, function ($0, name, props) {
            return name + ' ' + props.replace(/\s+(\w+=)/g, " $1");
        });
        text = "\n" + text.replace(/>\s*?</g, ">\n<");
        // 把注释编码
        text = text.replace(/\n/g, "\r");
        text = text.replace(/<!--(.+?)-->/g, function ($0, text) {
            return "<!--" + escape(text) + "-->";
        });
        text = text.replace(/\r/g, "\n");
        // 调整格式
        var rgx = /\n(<(([^\?]).+?)(?:\s|\s*?>|\s*?(\/)>)(?:.*?(?:(?:(\/)>)|(?:<(\/)\2>)))?)/mg;
        var nodeStack = [];
        var output = text.replace(rgx, function ($0, all, name, isBegin, isCloseFull1, isCloseFull2, isFull1, isFull2) {
            var isClosed = (isCloseFull1 == '/') || (isCloseFull2 == '/') || (isFull1 == '/') || (isFull2 == '/');
            var prefix = '';
            if (isBegin == '!') {
                prefix = XmlUtil.getPrefix(nodeStack.length);
            } else {
                if (isBegin != '/') {
                    prefix = XmlUtil.getPrefix(nodeStack.length);
                    if (!isClosed) {
                        nodeStack.push(name);
                    }
                } else {
                    nodeStack.pop();
                    prefix = XmlUtil.getPrefix(nodeStack.length);
                }

            }
            //console.log(name);
            return '\n' + prefix + all;
        });
        var prefixSpace = -1;
        var outputText = output.substring(1);
        // 把注释还原并解码并调格式
        outputText = outputText.replace(/\n/g, "\r");
        outputText = outputText.replace(/(\s*)<!--(.+?)-->/g, function ($0, prefix, text) {
            if (prefix.charAt(0) == '\r') {
                prefix = prefix.substring(1);
            }
            text = unescape(text).replace(/\r/g, '\n');
            return '\n' + prefix + '<!--' + text.replace(/^\s*/mg, prefix) + '-->';
        });

        return outputText.replace(/\s+$/g, '').replace(/\r/g, '\r\n');
    };

    XmlUtil.getPrefix = function (prefixIndex) {
        var span = '    ';
        var output = [];
        for (var i = 0; i < prefixIndex; ++i) {
            output.push(span);
        }
        return output.join('');
    };

    com.XmlUtil = XmlUtil;
});
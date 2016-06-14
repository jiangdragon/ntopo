/**
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2016/3/24
 */
NTopo.plugin(function ($$) {
    var util = $$.util = $$.util || {};

    util.importFromXML = function (xmlStr) {
        //var xmlUtil = new com.XmlUtil();
        var xmlHead = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
        //var xmlHead = "";

        return xmlHead + xmlStr;
        //return xmlUtil.loadXmlString(xmlHead + xmlStr);
    };
});
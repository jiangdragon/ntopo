/**
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2015/12/24
 */
var viewIndex = 0, NTOPO, editor;
var $domCode = $("#container .col-md-left").first();
var $domGraphic = $("#container .col-md-right").first();

launchExample();


function launchExample() {
    iniCodeMirror();
    NTOPO = $("#topo").nTopo({eagle: "show"});
    refresh();
}

/**********************初始化代码高亮**************************/
function iniCodeMirror() {
    editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        mode: "application/xml",
        styleActiveLine: true,
        theme: "monokai"
    });
}
/**********************获取textarea中的数据**************************/
function getXMLCode() {
    return editor.getValue();
}
/**********************导入XML**************************/
function refresh() {
    var xml = getXMLCode();
    NTOPO.importFromXML(xml);
}
/**********************切换视图**************************/
function screen() {
    viewIndex = (viewIndex + 1) % 3;

    $domCode.css("width", viewIndex === 2 ? "100%" : "33%");
    $domCode.css("display", viewIndex === 1 ? "none" : "block");

    $domGraphic.css("width", viewIndex === 1 ? "100%" : "67%");
    $domGraphic.css("display", viewIndex === 2 ? "none" : "block");

    editor.refresh();
}
/**********************导出XML**************************/
function exportToXMLToTextArea() {
    //如果放在textarea时要 replace(new RegExp("&","gm"), "&amp;")
    var xmlString = NTOPO.exportToXML();
    xmlString.replace(new RegExp("&", "gm"), "&amp;");
    // 缩进格式化成xml形式字符串
    xmlString = com.XmlUtil.formatXmlString(xmlString);
    editor.setValue(xmlString);
    editor.refresh();
}
/**********************随机数模拟告警数量及等级**************************/
function alarmTest() {
    setInterval(function () {
        var nodes = NTOPO.getNodes();
        for (var key in nodes) {
            nodes[key].data({
                "alarm_num": random(4, 9),
                "alarm_level": random(0, 5)
            });
        }
    }, 2000);
}
/**********************随机数模拟流量**************************/
function flowTest() {
    setInterval(function () {
        var lines = NTOPO.getLines();
        $.each(lines, function (key, line) {
            line.updateStroke(random(1, 6));
        });
    }, 1000);
}
/**********************加载节点测试**************************/
function performanceTest(num) {
    NTOPO.clear();
    NTOPO.showEagle(false);
    var x, y, node;
    num = num || 0;
    var beginTime = (new Date()).getTime();
    for (var i = 0; i < num; i++) {
        x = random(100, 2000);
        y = random(100, 2000);
        node = createNodeOption(x, y, "node_" + i);
        NTOPO.addNode(node);
    }
    NTOPO.showEagle(true);
    //node = createNodeOption(200, 200, "node_" + 0);
    //node1 = createNodeOption(300, 300, "node_" + 1);
    //NTOPO.addNode(node);
    //NTOPO.addNode(node1);

    var usedTime = ((new Date()).getTime() - beginTime) / 1000;
    console.log("随机生成" + num + "个节点, 用时：" + usedTime + " 秒.");
    //document.getElementById("performance").innerHTML = "随机生成" + num + "个节点, 用时：" + usedTime + " 秒.";
}
/**********************右键菜单**************************/
function rightMenuClick(data) {
    alert("菜单名：" + data.label);
}
/**********************取两个数值之间随机数**************************/
function random(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}
/**********************生成唯一uuid**************************/
function createUniqueID() {
    var guid = (((1 + Math.random()) * 0x10000) | 0).toString(16);
    guid += new Date().getTime();
    return guid.toUpperCase();
}
/**********************创建节点**************************/
function createNodeOption(x, y, text) {
    var point = x + "," + y;
    //var node = new NTopo.Element.ImageText({
    var option = {
        "id": createUniqueID(),
        "text": text,
        "point": x + "," + y,
        "shape": "imageText",
        "iconSize": "32,32",
        "icon": "./theme/device/007.png",
        "menu": [{
            id: "file",
            label: "文件",
            type: "group",
            item: {
                id: "create",
                label: "新建"
            }
        }, {
            id: "hideNode",
            label: "隐藏节点"
        }],
        "popup": {
            width: "200",
            height: "100",
            title: "${text}",
            item: [{
                label: "设备名：",
                value: "${text}"
            }, {
                label: "设备IP：",
                value: "${ip}"
            }]
        },
        "component": [{
            type: "circle",
            offset: "20,-10",
            r: "4",
            fill: "#AAFFAA",
            match: [{
                target: "blink",
                condition: "true",
                value: ""
            }, {
                target: "r",
                condition: "${alarm_num}>6",
                value: "9"
            }, {
                target: "r",
                condition: "${alarm_num}<=6",
                value: "4"
            }, {
                target: "fill",
                condition: "${alarm_level}>3",
                value: "#FF0000"
            }, {
                target: "fill",
                condition: "${alarm_level}<=3",
                value: "#00FF00"
            }]
        }]
    };
    return option;
}
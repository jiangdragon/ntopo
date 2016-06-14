/**
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2016/3/21
 */
module.exports = function (grunt) {
    var pkg = grunt.file.readJSON("package.json");

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: pkg,
        banner: grunt.file.read("./src/copy.js")
            .replace(/@VERSION/, pkg.version)
            .replace(/@DATE/, grunt.template.today("yyyy-mm-dd")) + "\n",
        // Task configuration.
        concat: {
            options: {
                banner: "<%= banner %>"
            },
            target: {
                dest: "dist/ntopo.js",
                src: [
                    "./lib/canvg.js",
                    // 公共包
                    "./src/com/com.js",
                    "./src/com/animation.js",
                    "./src/com/color.js",
                    "./src/com/element.js",
                    "./src/com/event.js",
                    "./src/com/fun.js",
                    "./src/com/map.js",
                    "./src/com/util.js",
                    "./src/com/xmlUtil.js",
                    "./src/com/svg.js",
                    "./src/com/geo/point.js",
                    "./src/com/geo/box.js",
                    // ntopo包
                    "./src/ntopo.js",
                    "./src/graph.js",
                    "./src/util.js",
                    "./src/handler/handler.js",
                    "./src/handler/dragHandler.js",
                    "./src/handler/drawLineHandler.js",
                    "./src/handler/editHandler.js",
                    "./src/handler/panHandler.js",
                    "./src/layer/canvasLayer.js",
                    "./src/layer/divLayer.js",
                    "./src/layer/svgLayer.js",
                    "./src/ui/animate.js",
                    "./src/ui/circle.js",
                    "./src/ui/menu.js",
                    "./src/ui/popup.js",
                    "./src/element/imageText.js",
                    "./src/element/line.js",
                    "./src/element/curveLine.js",
                    "./src/element/polyline.js"
                ]
            }
        },
        uglify: {
            options: {
                banner: "<%= banner %>",
                report: "min"
            },
            dist: {
                src: "<%= concat.target.dest %>",
                dest: "dist/ntopo-min.js"
            }
        },
        clean: {
            contents: ["dist/*"]
        }
    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask("default", ["clean", "concat", "uglify"]);
}
/**
 * @author 傻大
 * @Email jiangdragon@126.com | jiang_long@topsec.com.cn
 * @Time 2016/4/13
 */
NTopo.plugin(function ($$) {

    $$.Animate = {
        initialize:function(){
            this.opBlink = 1;
        },
        upData: function () {

        },
        animate: function (time) {
            var fn = null;
            if (!this.animation) {
                fn = com.Function.bind(this.upData, this);
                this.animation = new com.Animation();
                this.animation.addCallBack(fn, time);
                this.animation.start();
            }
            return this.animation;
        }
    };
});
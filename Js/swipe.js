function swipe(o) {
    this.html = document.documentElement;
    this.ww = this.html.clientWidth;
    this.wh = this.html.clientHeight;
    swipe.prototype = {
        Init: function (o) {
            o.p = C.Pt(o);
            var v = C.G(o.p.v),
             ps = C.Gs(o, "img");
            for (var i = 0; i < ps.length; i++) {
                var p = ps[i];
                p.i = i;
                C.AddEvent(p, "click", function (p, e) {
                    var t = C.Ge(e);
                    if (t.tagName.toLowerCase() == "img") {
                        v.src = p.src;/*//如果是小图则不能用src*/
                        v.n = p.i;
                    }
                    swipe.prototype.zoom(v)
                }, p);
            }
            v.t = o;//触发元素父元素
            v.p = C.Pt(o);
            /*//C.AddEvent(v, "load", this.zoom, v);此image非彼image*/
            var vp = v.parentNode;
            if (C.isTouch()) {
                v.r = 0;
                C.AddEvent(vp, "touchstart", this.rule, v);
                C.AddEvent(vp, "touchmove", this.rule, v)
                C.AddEvent(vp, "touchend", this.rule, v);
            }
            else  /*//pc*/ {
                C.AddEvent(vp, "click", this.rule, v);
                var cx = vp.offsetWidth / 2;
                C.AddEvent(vp, "mousemove", function (e) {
                    var e = e || window.event,
                    x = e.clientX - vp.offsetLeft - 2;
                    if (x < cx) {
                        C.DelClass(vp, "next")
                        C.AddClass(vp, "previous");
                        vp.title = "上一张";
                        v.r = 4;
                    }
                    else {
                        C.DelClass(vp, "previous")
                        C.AddClass(vp, "next");
                        vp.title = "下一张";
                        v.r = 3;
                    }

                });
            }
        },
        rule: function (o, e) {
            if (e.type == "touchstart") {
                var s = e.touches[0];
                o.sp = { x: s.clientX, y: s.clientY };/*//,time:+new Date};可记录时间*/
            }
            else if (e.type == "touchend") {
                /*// var dur = +new Date - sp.time; //滑动的持续时间*/
                var b = e.changedTouches[0];
                o.ep = { x: b.clientX, y: b.clientY };
                var x = o.ep.x - o.sp.x,
                y = o.ep.y - o.sp.y;
                if (Math.abs(x) < 2 && Math.abs(y) < 2)  /*/如果滑动距离太短*/
                    return;
                var a = Math.atan2(y, x) * 180 / Math.PI;/*//用反正切求夹角度数*/
                if (x > 0 && a >= -45 && a < 45) {
                    o.r = 4;
                    /*console.log("右");*/
                }
                else if (x < 0 && (a >= 135 && a <= 180) || (a >= -180 && a < -135)) {
                    o.r = 3;
                    /*console.log("左");*/
                }
                else if (y > 0 && a >= 45 && a < 135) {
                    o.r = 2;
                    /*console.log("下");*/
                }
                else if (y < 0 && a >= -135 && a < -45) {
                    o.r = 1;
                    /*console.log("上");*/
                }
                else {
                    console.log("没滑动");
                    return;
                }
            }
            else if (e.type == "touchmove") {
                C.PreventDefault(e);/*阻止触摸事件的默认滚屏行为*/
            }
            /*else if (e.type == "click") {//鼠标事件事处理
               console.log(e.type)
            } */
            if ((e.type == "touchend" || e.type == "click") && o.r > 2)
                swipe.prototype.handle(o);
        },
        handle: function (o, e) {
            if (o.r == 3 && o.n > -1)//
            {
                if (o.n < o.t.p.s.length - 1)
                    o.src = o.t.p.s[++o.n];
            }
            else if (o.r == 4 && o.n > 0) {
                o.src = o.t.p.s[--o.n];
            }
            /*仅浏览已显示的图对应大图的场景,待扩展
                        var s;
            if (o.r == 3)
            {
                s = C.Nxt(o.ci);
            }
            else if (o.r == 4)
            {
                s = C.Pre(o.ci);
            }
            if(s){
            o.src = s.src;
            o.ci = s;}
            */
            swipe.prototype.zoom(o);
        },
        zoom: function (o, e) {
            var i = new Image();
            i.src = o.src;
            i.onload = function () {
                var w = i.width,
                h = i.height;
                console.log("w：" + w + "_h：" + h + "_complete：" + i.complete)
                if (h > w) {
                    o.style.height = h > wh ? "100%" : "auto";
                    o.style.width = "auto";
                    console.log(1 + "_" + h > wh)

                }
                else if (h < w) {
                    o.style.width = w > ww && h < wh ? "100%" : "auto";
                    console.log(2 + "_" + w > ww && h < wh)
                }
                else {
                    o.style.width = o.style.height = "auto";
                    console.log(3)
                }
                i = null;
            }
        }
    }
    C.Batch();
}
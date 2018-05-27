/*
调用组件用new，this指向组件本身，不用new时指向window
*/
var C = {
    Slice: Array.prototype.slice,
    /* 判断传入对象是否为数组 */
    isArr: function (o) {
        return Object.prototype.toString.apply(o) === '[object Array]';
    },
	/*arr.push.apply(arr,C.Gn(nm));
	sliceC考虑用数组对象arr的push方法取代
	*/
    sliceC: function (arr) {
        var a = [];
		a.push.apply(a,arr);
        // for (var i = 0; i < arr.length; i++) {
            // a.push(arr[i]);
        // }
        return a;
    },

    /* 获取并返回传入id的对象 */
    G: function (Id) {
        return typeof (Id) == "string" ? document.getElementById(Id) : Id;
    },

    /*创建并返回传入标签名的元素 */
    Ce: function (Tag) {
        return document.createElement(Tag);
    },
    /* 获取元素属性  */
    Attr: function (Id, Attr) {
        var obj = C.G(Id), oAttr;
        if (obj.getAttribute(Attr)) {
            oAttr = obj.getAttribute(Attr)
        }
        else if (obj.attributes[Attr]) {
            oAttr = obj.attributes[Attr];
        }
        return oAttr;
    },
    /* 获取并返回传入Name的集合对象*/
    Gn: function (Nm, Tg) {
        var a = document.getElementsByName(Nm);
        if (Tg) {
            var es = document.getElementsByTagName(Tg),
                arr = new Array();
            for (var i = 0; i < es.length; i++) {
                var e = es[i];
                if (C.Attr(e, "name") == Nm) {
                    arr.push(e);
                }
            }
            a = arr;
        }
        return a;
    },
    /* 获取并返回传入对象的name的值*/
    Gnm: function (o) {
        return o.name || C.Attr(o, "name");
    },
    /* 获取并返回传入对象和传入标签子元素的数组 */
    Gs: function (prt, tg, Progeny) {
        var prt = typeof (prt) == "string" ? C.G(prt) : prt,
		         Childs = new Array(),
		         Ds = prt.getElementsByTagName(tg),
                 Progeny = !Progeny ? false : true;
        for (var i = 0; i < Ds.length; i++) {
            if (Ds[i].parentNode == prt || Progeny) {
                Childs.push(Ds[i]);
            }
        }
        return Childs;
    },
       /* 获取并返回传入元素的下一个非空元素 */
    Nxt: function (Ele) {
        return C.Sbl(Ele, "nextSibling");
    },

    /* 获取并返回传入元素的上一个或下一个非空元素 */
    Sbl: function (Ele, Fn) {
        var E = Ele[Fn];
        while (E && (E.nodeType != 1))/*while (E && (E.nodeType != 1 && E.nodeType != 3))*/ {
            E = E[Fn];
        }
        return E;
    },
    /* 获取并返回传入字符串所字义的Json对象 */
    Json: function (Str) {
        if (Str) {
return eval(Str.startsWith("{") ? "(" + Str + ")" : "({" + Str + "})")
        }
		/*IE7及以下好像不支持
		JSON.parse(jsonstr); //将json字符串转换成json对象 
		JSON.stringify(jsonobj); //将json对象转换成json对符串 
		*/
    },
    /* 获取并返回传入对象的p属性,如果元素没有该属性, 则为其添加，且其值为空对象*/
    Pt: function (o) {
        if (!o.ps)
        {
        var p = C.Attr(o, "p");
        o.ps = C.Json(p);
        o= p ? o.ps : {};
        }
        return o;
    },
    /* 用该方法调用函数的原型初始化方法Init，批处理该方法调用函数的实参对象 */
    Batch: function () {
        var Cl = C.Batch.caller,
            arg = Cl.arguments;
       /* if (!Cl.Initialized) {*/
            var Ns = [],
			oa = [];/*以name为参数对应的元素数组*/
            for (var j = 0; j < arg.length; j++)
			{
                var a = arg[j];
                if (typeof a == "string") {
                    if (Cl.Hn && a.slice(-2).toLowerCase() == "nm")/*组件允许接收以name为参数*/
					{
                        oa = oa.concat(C.sliceC(C.Gn(a)));
                    }
                    else {
                        Ns.push(a);//Ns = C.Slice.apply(arg);C.G(a)
                    }
                }
				else if (!a.length)
				{
				    Ns.push(a);/*Ns = C.Slice.apply(arg);C.G(a)*/
				}
                else if (!a.nodeType) {/*接收到的参数类型为集合、数组*/
                    /*//var arr=C.sliceC(a);
                    //Ns = Ns.concat(arr);
                    //		 oa=oa.concat(C.sliceC(C.Gn(a)));
                    //arr1.push.apply(arr1, [4, 5]);*/
                    if (a.p) {
                        for (var i = 0; i < a.length; i++) {
                            a[i].p = a.p;
                        }
                    }
                    Ns.push.apply(Ns, a);

                }
            }
            if (oa.length) {
                Ns = Ns.concat(oa);
            }
            for (var i = 0; i < Ns.length; i++) {
                var n = Ns[i],
                    o = C.G(n);
				if(!o.Initialized)
                Cl.prototype.Init(o);
				o.initialized=true;
            }
			/*
            Cl.Initialized = true;
        }*/
    },
       /* 获取并返回触发事件的对象*/
    Ge: function (e) {
        var e = e || window.event,
               mt = e.target || e.toElement;
			   /*
			   vartarget=e.target||e.srcElement;
　　varrelatedTarget=e.relatedTarget||e.fromElement;
			   */
        return mt;
    },
    /*是否支持触摸事件*/
    isTouch: function (e) {
            return "ontouchend" in document ? true : false;
    },

    /* 为对象添加的事件监听  */
    AddEvent: function (obj, ev, fn,arg) {
        obj = C.G(obj);
        var f = fn,
		ags=arguments;
        if (arg)
		{
           f = function(e) { 
		   //fn(arg,e);
		  //  var args=[arg,e];
		 var args=C.Slice.call(ags,3);/*取AddEvent第4个开始往后的实参，以便于支持事件处理函数传多个参数*/
		  args.push(e);/*并向其末尾添加事件对象e，鉴于很多事件处理函数并不需要事件对象e,故此版本中将其后置*/
		  // fn.call(null,arg,e);
		  fn.apply(null,args)
		   };//将e和arg换了位置，这样不需要使用e对象的函数可以只传arg
        }
        if (window.addEventListener) {
            obj.addEventListener(ev, f , false);
        }
        else if (window.attachEvent) {
            obj.attachEvent("on" + ev,f );
        }
        else {
            obj["on" + ev] = obj.f;
        }
    },
/*自定义事件并返回，参数:事件名称、是否冒泡、是否可取消的默认动作*/
	evt:function(nm,bb,cc)
	{
		if(!window.evt)
			window.evt={};/*自于存储自定义事件*/
		if(!window.evt[nm])
		{
		var e;
		if(document.createEvent)
		{
			e=document.createEvent("HTMLEvents");//new Event(nm);ie不支持//new Event(nm,{bubbles:bb,cancelable:cc});
			e.initEvent(nm,bb,cc);
		}
		else{
			e=document.createEventObject();
			e.bubbles=bb;
			e.cancelable=cc;
			e.type=nm;
			//a.attachEvent("on" + en,fun);
			//a.fireEvent("on"+en,oe)
		}
	window.evt[nm]=e;
}
	},
	/*触发对象的自定义事件*/
	trg:function(o,e)
	{
		if(o.dispatchEvent)
			o.dispatchEvent(e);
		else
			o.fireEvent("on"+e.type,e)
		//a["on"+e.type]=
	},
    /* 删除传入元素的class属性  */
    DelClass: function (M, Cn) {
        if (M) {
            if (typeof (M) == "string")
                M = C.G(M);
            var Cls = M.getAttribute("class") || M.getAttribute("className");
            if (Cls) {
                if (RegExp("^\\s*" + Cn + "\\s*$").test(Cls)) {
                    C.DelAttr(M, "className");
                    C.DelAttr(M, "class");
                }
                else {
                    M.className = Cls.replace(new RegExp("( ?|^)" + Cn + "\\b"), "");
                }
            }
        }
    },
    //
    /* 添加传入元素的class属性  */
    AddClass: function (M, Cn) {
        if (M) {
            if (typeof (M) == "string")
                M = C.G(M);
            var Cls = M.getAttribute("class") || M.getAttribute("className");
            if (Cls != null) {
                Cn = Cls.indexOf(Cn) == -1 ? Cls + " " + Cn : Cls;
            }
            M.className = Cn;
        }
    },
    /* 创建并返回一个XMLHttpRequest对象  */
    XHR: function () {
        var XHR;
        try {
            XHR = new XMLHttpRequest();
        }
        catch (e1) {
            try {
                XHR = new ActiveXObject("Msxml2.XMLHTTP");
            }
            catch (e2) {
                try {
                    XHR = new ActiveXObject("Microsoft.XMLHTTP");
                }
                catch (e3) {
                    XHR = false;
                }
            }
        }
        return XHR;
    },

    /* 执行异步请求 暂未加入formdata异步上传文件*/
    EXHR: function (CallBack, Method, Url, Data, Proc, Async) {
        var oXHR = this.XHR(),
            Rst = null,
            Junctor = Url.indexOf("?") != -1 ? "&" : "?";
        oXHR.onreadystatechange = function () {
            switch (oXHR.readyState) {
                case 0:
                    Rst = "请求未初始化";
                    break;
                case 1:
                    Rst = "服务器连接已建立";
                    break;
                case 2:
                    Rst = "请求已接收";
                    break;
                case 3:
                    Rst = "请求处理中";
                    break;
                case 4:
                    Rst = "请求已完成，且响应已就绪";
                    if (oXHR.status == 200) {
                        var Rsp = null,
                                 cType = oXHR.getResponseHeader("Content-Type");
                        if (cType && cType.indexOf("text/xml") != -1) { Rsp = oXHR.responseXML; }
                        else if (cType && (cType.indexOf("text/json") != -1 ||
                            cType.indexOf("text/javascript") != -1 ||
                            cType.indexOf("application/javascript") != -1 ||
                            cType.indexOf("application/json") != -1 ||
                            cType.indexOf("application/x-javascript") != -1)) {
                            Rsp = eval('(' + oXHR.responseText + ')');//oXHR.responseText
                        }
                        else {
                            Rsp = oXHR.responseText;
                        }
                        CallBack(Rsp);/*C.Json(Rsp)*/
                    }
                    break;
            }
            if (Proc) { Proc(Rst); }
        };
        Data = Method == "GET" ? null : Data;
        Async = Async != false ? true : false;
        oXHR.open(Method, encodeURI(Url), Async);
        oXHR.setRequestHeader('ajax', 1);//标识为ajax请求
        if (Method == "POST") {
             oXHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        }
        oXHR.send(Data);
    },
    /* Jsonp
        */
    Jsp: function (str) {
        var  //rUrl = bu ? bu : "../../ws/Wcf.svc/",/*站群系统中使用*/
        Jt = C.G("Cbf"),
        Jn = Jt.cloneNode(),
        Bd = C.Bd();// C.Gs(document.documentElement, "body")[0];
        Jn.src = str;/*bu + bu：各站点请求的基础url*/
        Jn.id = "cloneCbf";
        Bd.appendChild(Jn);
    },
    /* 获取并返回get请求参数        */
    param: function () {
        //?user_id=261591&owner=261591
        var ps = location.search.substring(1).split('&'),
            o = {};
        for (var i = 0; i < ps.length; i++) {
            var p = ps[i],
                k = p.split('=');
            o[k[0]] = k[1];
        }
        return o;
    }
};
Function.prototype.Method = function (Nm, Fun) {
    if (!this.prototype[Nm]) {
        this.prototype[Nm] = Fun;
    }
};
String.Method("trim", function () { return this.replace(/^\s+|\s+$/g, ""); });
String.Method("endsWith", function (pattern) { var d = this.length - pattern.length; return d >= 0 && this.lastIndexOf(pattern) === d; });
String.Method("startsWith", function (pattern) { return this.slice(0, pattern.length) === pattern; });
String.Method("format", function (args) {
    var result = this;
    // if (arguments.length < 1) {
    // return result;
    // }
    var data = arguments;       //如果模板参数是数组
    if (arguments.length == 1 && typeof (args) == "object") {
        //如果模板参数是对象
        data = args;
    }
    for (var key in data) {
        var value = data[key];
        if (undefined != value) {
            result = result.replace("{" + key + "}", value);
        }
    }
    return result;
});
Array.Method("insert",function(i,o){this.splice(i, 0, o);});
Array.Method("contains", function (item) {
    for (i = 0; i < this.length; i++) {
        if (this[i] == item) { return true; }
    }
    return false;
})
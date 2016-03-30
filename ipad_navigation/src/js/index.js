requirejs(['./zepto.min'], function () {
    (function(){
        var cache = {};
        this.tmpl = function tmpl(str, data){
            var fn = !/\W/.test(str) ?
                cache[str] = cache[str] ||
                    tmpl(document.getElementById(str).innerHTML) :
                new Function("obj",
                    "var p=[],print=function(){p.push.apply(p,arguments);};" +
                    "with(obj){p.push('" +
                    str
                        .replace(/[\r\t\n]/g, " ")
                        .split("<%").join("\t")
                        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                        .replace(/\t=(.*?)%>/g, "',$1,'")
                        .split("\t").join("');")
                        .split("%>").join("p.push('")
                        .split("\r").join("\\'")
                    + "');}return p.join('');");
            return data ? fn( data ) : fn;
        };
     })();

    // API
    var weather = {
        tpl:'weather_tpl',
        api:'http://opscn.dolphin-browser.com/service/1/weathers.json?pn=com.dolphin.browser.pad.chinese'
    };

    var isLoading = false,
        xhr,
        $scrollTarget,
        $weather = $("#weather"),
        $J_backtop = $('#J_backtop');
        

    // 加载数据
    function loadData(url,callback){
        if(isLoading) return;
        isLoading = true;
        $("#loading").show();
        xhr = $.ajax({
            url:url,
            dataType:'json',
            success:function(data){
                $("#loading").hide();        
                callback && callback(data);
                
            },
            error:function(xhr,status,err){
                $("#loading").show();
                isLoading = false;
                xhr = null;
                throw new Error(status);
            }
        });
    }

    loadData(weather.api,function(data){
        var $html = $(tmpl(weather.tpl,data));
         $weather.append($html);
    })
    
});


    

    
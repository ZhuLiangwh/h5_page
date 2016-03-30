(function(){
    var cache = {};
    this.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
        cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :

        // Generate a reusable function that will serve as a template
        // generator (and which will be cached).
        new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +

            // Introduce the data as local variables using with(){}
             "with(obj){p.push('" +
         
            // Convert the template into pure JavaScript
            str.replace(/[\r\t\n]/g, " ")
               .replace(/'(?=[^%]*%>)/g,"\t")
               .split("'").join("\\'")
               .split("\t").join("'")
               .replace(/<%=(.+?)%>/g, "',$1,'")
               .split("<%").join("');")
               .split("%>").join("p.push('")
               + "');}return p.join('');");

        // Provide some basic currying to the user
        if (!data) { return fn; }
        try{ return fn( data ); } catch (e) { return ""; }
    };
})();

 // 获取dolphin参数
var dolphin, params = dolphin ? JSON.parse(dolphin.getDeviceInfo()) : {};

(function($){

    var cache = {};
    var loaded = true;
    var totalheight = 0;

    // test: http://172.16.7.101  54.251.117.86
    // 预发布：115.29.216.60
    // live: http://opsen.dolphin-browser.com 
     var dataUrl = 'http://opsen.dolphin-browser.com/ipo/api/v2/card/funny_hd?lc='+ (params["locale"] || 'ru_RU')+'&pn='+( params["package_name"] || 'com.dolphin.browser.id')+'&appvc='+( params["shell_version"] || '517')+'&appvn='+(params["shell_version_text"] || '11.5.0.9')+'&chn=ofw&os=android&limit=16&type={{type}}&from=web{{nextId}}';



    // 点赞
    function likes(){
        $(".video_likes").on("click",function(){
            var $self = $(this), count = $self.children('span').html() - 0;
            $self.toggleClass("active");
            $self.children('span').html(count - ($self.hasClass('active') ? -1 : 1));  
        });
    }
    

    /*
        说明：如果flag为true，则表示是通过滚动加载，为false，表示为一开始进来或者切换tab时加载
    */
    function getData(type,tplId,flag){
        var url = dataUrl.replace(/{{nextId}}/,(flag && cache[type+'nextId'] ? '&nextId='+ cache[type+'nextId'] : '')).replace(/{{\w+}}/,type);
        // 如果有缓存
        if(!flag && cache[type]){
            $(".preload").hide();
            $('#tabcontent').html(cache[type]);
            likes(); 
            return;
        }

        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            success: function(data) {
                $(".load_more").removeClass("hide");    
                var html = tmpl(tplId,data.data);                
                cache[type] = html;
                cache[type+'nextId'] = data.data.nextId;
                // 如果一开始就直接渲染，否则插入数据
                if($(document).height() > totalheight){
                    $('#tabcontent').html(html);
                }else{
                    $('#tabcontent').append(html);    
                }
                
                // 如果data为空表示加载完成
                var temp = JSON.stringify(data.data);
                if(temp == '{}'){
                    $('.load_more').html('All Loaded');
                    loaded = false;
                }
                
                likes();

            },
            error: function(xhr, type){

            }
        });
    }

    // 默认加载数据  
    getData('text','textTmpl');
    
    // tab切换
    $('#tabTit').on('click','li',function(){
        if(!$(".load_more").hasClass("hide")){
            var $self = $(this),type = $self.data('type'),tplid = $self.data('tplid');  
            getData(type,tplid);
            loaded = true;
            $('.load_more').html("Slide up to load more");
            $self.addClass('cur').siblings().removeClass('cur');
        } 
    });

    // 滚动加载更多
    function loadmore()
    {   
        totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());
       
        if (loaded && $(document).height() <= totalheight)
        { 
            $(".load_more").html("Loading...");  
            var self = $('#tabcontent ul');
            //加载数据
            if(self.hasClass('text_cont')){   
                getData('text','textTmpl',1);   
                
            }else if(self.hasClass('picture_cont')){
                getData('picture','pictureTmpl',1);   

            }else if(self.hasClass('video_cont')){
                getData('video','videoTmpl',1);
            }
            
            likes(); 
        }
    } 

    $(window).scroll( function() { 
        loadmore();
    }); 
    

})(Zepto);


     

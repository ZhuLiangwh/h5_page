/**
 * Created by jhzhang on 2015/7/22.
 */
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




// 获取dolphin参数
var dolphin,
    params = dolphin ? JSON.parse(dolphin.getDeviceInfo()) : {};
    // params = {};

var config = {
    recommend:{
        tpl:'recommend_tpl',
        container:'J_tab_con_recommend',
        api:'http://opsen.dolphin-browser.com/ipo/api/picture/promote?lc='+ (params["locale"] || 'ru_RU')+'&pn='+( params["package_name"] || 'com.dolphin.browser.id')+'&appvc='+( params["shell_version"] || '518')+'&appvn='+(params["shell_version_text"] || '11.4.5')+'&chn=ofw&os=android&limit=10&page=1',
        page:1,
        islastpage:false,
        data:''
    },
    category:{
        tpl:'category_tpl',
        container:'J_tab_con_category',
        api:'http://opsen.dolphin-browser.com/ipo/api/picture/cate?lc='+ (params["locale"] || 'ru_RU')+'&pn='+( params["package_name"] || 'com.dolphin.browser.id')+'&appvc='+( params["shell_version"] || '518')+'&appvn='+(params["shell_version_text"] || '11.4.5')+'&chn=ofw&os=android',
        islastpage:true,
        data:''
    },
    category_detail:{
        tpl:'category_detail_tpl',
        container:'J_page_category_detail',
        api:'http://opsen.dolphin-browser.com/ipo/api/picture/cate/detail?lc='+ (params["locale"] || 'ru_RU')+'&pn='+( params["package_name"] || 'com.dolphin.browser.id')+'&appvc='+( params["shell_version"] || '518')+'&appvn='+(params["shell_version_text"] || '11.4.5')+'&chn=ofw&os=android&limit=10&page=1&id=1',
        id:1,
        data:{}
    },
    picture:{
        tpl:'picture_tpl',
        container:'J_tab_con_picture',
        api:'http://opsen.dolphin-browser.com/ipo/api/picture/subject?lc='+ (params["locale"] || 'ru_RU')+'&pn='+( params["package_name"] || 'com.dolphin.browser.id')+'&appvc='+( params["shell_version"] || '518')+'&appvn='+(params["shell_version_text"] || '11.4.5')+'&chn=ofw&os=android&limit=10&page=1',
        page:1,
        islastpage:false,
        data:''
    },
    picture_detail:{
        tpl:'picture_detail_tpl',
        container:'J_page_picture_detail',
        api:'http://opsen.dolphin-browser.com/ipo/api/picture/subject/detail?lc='+ (params["locale"] || 'ru_RU')+'&pn='+( params["package_name"] || 'com.dolphin.browser.id')+'&appvc='+( params["shell_version"] || '518')+'&appvn='+(params["shell_version_text"] || '11.4.5')+'&chn=ofw&os=android&limit=10&page=1&id=1',
        id:1,
        data:{}
    }
};
var tab = ['recommend','category','picture'],
    $tabs = $('#J_tab_hd li'),
    $tabCons = $('#J_tab_bd>div'),
    $pages = $('#J_page>div');

var isLoading = false,
    xhr,
    $mainContainer = $('#J_page_main');

var waterfallObjects= ['recommend','category_detail','picture','picture_detail'];
var updataIbObjects = ['category','picture'];

window.addEventListener('hashchange',function(){
    var sHash = window.location.hash.slice(1);
    window.sessionStorage.setItem('hash',sHash);
    handleHashCHange(sHash);
});

function handleHashCHange(sHash){
    var index = tab.indexOf(sHash);
    index > -1 ? handleTabHash(sHash,index) : handlePageHash(sHash);
}

function handleTabHash(sHash,index){
    var $container = $tabCons.eq(index),oldData = config[sHash].data;
    $pages.hide();
    $mainContainer.show();
    $tabCons.hide();
    $container.scrollTop(0).html(oldData).show();
    $tabs.removeClass('active').eq(index).addClass('active');
    oldData === '' && loadData(config[sHash]['api'],function(data){
        var html = tmpl(sHash +'_tpl', data);
        config[sHash].data = html;
        $container.html(html);
        setConfigSession();
        $container.html(oldData = html);
        swipeboxAction();
    });
    swipeboxAction();
    ga("send","event","picture_card_behavior","click_tab");
}

function handlePageHash(sHash){
    var tmp = sHash.match(/(.*)\_([^_]+$)/),
        hashName = tmp[1],
        id = tmp[2],
        obj = config[hashName]['data'][id],
        $container = $('#' + obj.container),
        oldData = obj.data;
    $pages.hide();
    $container.empty().show();
    if(oldData){
        $container.html(oldData);
        swipeboxAction();
    }else{
        loadData(obj.api,function(data){
            var html = tmpl(obj.tpl, data);
            obj['data'] = html;
            $container.html(html);
            setConfigSession();
            swipeboxAction();
        });
    }
}

function loadData(url,callback){
    if(isLoading) return;
    isLoading = true;
    xhr = $.ajax({
        url:url,
        dataType:'json',
        success:function(data){
            isLoading = false;
            xhr = null;
            callback && callback(data.data);
        },
        error:function(xhr,status,err){
            isLoading = false;
            xhr = null;
            throw new Error(status);
        }
    });
}

function setHash(hash){
    var href = window.location.href, hasHash = window.location.href.indexOf('#') > -1;
    window.location.href = hasHash? href.replace(/#\w+$/,'#'+ hash) : (href + '#' + hash);
}

function waterfall(key){
    var obj = config[key],
        $container = $('#'+ obj.container);
    $container.on('scroll',function(){
        obj = config[key];
        if($.isPlainObject(obj['data'])){
            obj = obj['data'][obj.id];
        }
        var url = obj.api,
            height = this.offsetHeight,
            currentPage = obj.page,
            isLastPage = obj.islastpage;

        if(isLastPage) return;
        var $seft = $(this),ch = $seft.children().height(), offsetTop = $seft.scrollTop();
        console.log(height,offsetTop,ch);
        if(height + offsetTop >= ch){
            url = url.replace(/page=([^&]*)/,'page='+ ++currentPage);
            loadData(url,function(data){
                var $html = $(tmpl(obj.tpl,data));
                obj.page = currentPage;
                obj.islastpage = data.last_page;
                $container.find('ul').append($html.find('li'));
                obj.data = $container.html();
                setConfigSession();
                swipeboxAction();
            })
        }
    })
}

function updataId(key){
    var obj= config[key],
        $trigger = $('#'+ obj.container);
    $trigger.on('click','a',function(e){
        var id = $(this).data('id'),target = config[key+'_detail'];
        e.preventDefault();
        target.id = id;
        target['data'][id] = target['data'][id] || {
                id:id,
                data:'',
                islastpage:false,
                page:1,
                api:target.api.replace(/id=[^&]*/,'id='+id),
                tpl:target.tpl,
                container:target.container
            };
        setConfigSession();
        setHash($(this).attr('href').slice(1));
        ga("send","event","picture_card_behavior","click_classification");
    });
}

function setConfigSession(){
    window.sessionStorage.setItem('config',JSON.stringify(config));
}

$.each(config,function(key){
    waterfallObjects.indexOf(key) > -1 && waterfall(key);
    updataIbObjects.indexOf(key) > -1 && updataId(key);
});

setHash(window.sessionStorage.getItem('hash') || tab[1]);
$(window).on('load',function(){
    var sHash = window.location.hash.slice(1);
    config = JSON.parse(window.sessionStorage.getItem('config')) || config;
    handleHashCHange(sHash);
});

function swipeboxAction(){
    $('.swipebox').bind("click",function(){
        event.preventDefault();
        event.stopPropagation();
        var $self = $(this),
            id = $self.data('id'),
            imageUrl = $self.attr('href'),
            detailUrl = $self.attr('rel'),
            name = $self.data('name'),
            cateId = $self.data('title'),
            cateName = $self.data('cateName') || null;
        dolphin.showPictureViewer(id, imageUrl, detailUrl, name, cateId, cateName);
    })
}

function scrolltop(){
    var offset = 300,
        offset_opacity = 1200,
        scroll_top_duration = 700,
        $back_to_top = $('.cd-top');

    //hide or show the "back to top" link
    $(window).scroll(function(){
        ( $(this).scrollTop() > offset ) ? $back_to_top.addClass('cd-is-visible') : $back_to_top.removeClass('cd-is-visible cd-fade-out');
        if( $(this).scrollTop() > offset_opacity ) { 
            $back_to_top.addClass('cd-fade-out');
        }
    });

    $back_to_top.on('click', function(event){
        event.preventDefault();
        $('body,html').animate({
            scrollTop: 0 ,
            }, scroll_top_duration
        );
    });
}

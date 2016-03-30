document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {

    var baseUrl="http://cn.dolphin.com/dolphin-day/sports-meeting/";
    //var baseUrl = location.href.replace(/basketball_game\/.+/g,'basketball_game');

    var imgUrl='./images/thumb.jpg';
    var appid='';
    var link=baseUrl;
    var title=document.title;
    var desc='海豚2015运动会，投出你心中最牛战队！';

    // 发送给好友
    WeixinJSBridge.on('menu:share:appmessage', function(argv){
        alert(imgUrl);
        WeixinJSBridge.invoke('sendAppMessage',{
            "img_url": imgUrl,
            "img_width": "160",
            "img_height": "160",
            "link": link,
            "desc": desc,
            "title": desc
        }, function(res) {
            //alert(res.err_msg);
        });
    });

    // 分享到朋友圈
    WeixinJSBridge.on('menu:share:timeline', function(argv){
        alert(imgUrl);
        WeixinJSBridge.invoke('shareTimeline',{
            "img_url": imgUrl,
            "img_width": "160",
            "img_height": "160",
            "link": link,
            "desc": desc,
            "title": desc
        }, function(res) {
            //alert(res.err_msg);
        });
    });

});

    require('./zepto.js')();
    require('./zepto.alert.js')();
    require('./flexible.js')();

    var scrollContent = document.getElementById("scrollContent"),
        content = document.getElementById('content');

    var display = false;
    var sdegree = 0;
        
        
  
    window.onload = function() {

        display = !display;
        scrollContent.style.height = display? ($(window).height() - $("#scrollTop").height()- $("#scrollBottom").height()-20)+'px': "0px";

       

        $('.MyTab').each(function(){
            $(this).tab();
        });


         // f.rootTouchBind("content");

        return false;
    };

    window.onresize = function(){
        scrollContent.style.height = display? ($(window).height() - $("#scrollTop").height()- $("#scrollBottom").height()-20)+'px': "0px";
    }


   

    //scrolling
    var f = {
        rootTouchObj : {
            startY: 0,
            scrollY: 0
        },
        scrollRootHeight: function (t){
            var that = $('#'+t);
            var h = that.height();
            var c = that.parent().height();
            var p = h - c;
            return p ;
        },
        rootTouchBind: function (t) {
            var c = this;
            var d = $('#'+t);
            var l = d.height();
            var p = d.parent().height();
            if ( l < p) {
                return;
            };
            $('#' + t).on('touchstart', function (d) {
                c.rootTouchObj.startY = d.touches[0].clientY;
                c.rootTouchObj.scrollY = 0
            });
            $('#' + t).on('touchmove', function (g) {
                g.preventDefault();
                var h = g.touches;
                var f = g.touches[0].clientY;
                var i = f - c.rootTouchObj.startY;
                var d = 0;
                var e = c.getY(t);
                d = e + i;
                if (d > 150) {
                    d = 150
                } else {
                    if (d < (c.scrollRootHeight(t) * - 1 - 150)) {
                        d = (c.scrollRootHeight(t) * - 1 - 150)
                    }
                }
                $('#' + t).css('transform', 'translateY(' + d + 'px)');
                $('#' + t).css('-webkit-transform', 'translateY(' + d + 'px)');
                c.rootTouchObj.scrollY = f - c.rootTouchObj.startY;
                c.rootTouchObj.startY = f
            });
            $('#' + t).on('touchend', function (d) {
                c.touchScroll(c.rootTouchObj.scrollY, t, c.scrollRootHeight(t))
            })
        },
        touchScroll: function (k, d, m, g) {
            var c = this;
            var e = Math.abs(k);
            var h = 0;
            var f = 200;
            var l = d;
            var j = 0;
            if (e >= 40) {
                h = 15
            } else {
                if (e < 40 && e >= 25) {
                    h = 10
                } else {
                    if (e < 25 && e >= 10) {
                        h = 5
                    } else {
                        h = 0
                    }
                }
            }
            if (h > 0) {
                if (k < 0) {
                    h = h * - 1
                }
                setTimeout(function () {
                    c.touchScrollRun(h, d, 0, m, g)
                }, 2)
            } else {
                var i = 0;
                i = c.getY(d);
                c.goToEnd(i, d, m)
            }
        },
        touchScrollRun: function (h, k, g, e, f) {
            var i = this;
            var j = g + 1;
            if (f) {
                i.imgLazyLad.lazyLad()
            }
            if (g < 50) {
                var d = 0;
                d = i.getY(k) + h;
                $('#' + k).css('transform', 'translateY(' + d + 'px)');
                $('#' + k).css('-webkit-transform', 'translateY(' + d + 'px)');
                if (d <= (e * - 1 - 30) || d >= 30) {
                    i.goToEnd(d, k, e)
                } else {
                    setTimeout(function () {
                        i.touchScrollRun(h, k, j, e, f)
                    }, 2)
                }
            } else {
                i.goToEnd(d, k, e)
            }
        },
        goToEnd: function (c, h, e) {
            var g = this;
            var f = null;
            var d = null;
            if (e > 0) {
                if (c < (e * - 1)) {
                    f = {
                        transform: 'translateY(' + (e * - 1) + 'px)',
                        '-webkit-transform': 'translateY(' + (e * - 1) + 'px)',
                        '-webkit-transition': '0.2s ease 0s',
                        transition: '0.2s ease 0s'
                    };
                    d = {
                        transform: 'translateY(' + (e * - 1) + 'px)',
                        '-webkit-transform': 'translateY(' + (e * - 1) + 'px)',
                        '-webkit-transition': '',
                        transition: ''
                    }
                } else {
                    if (c > 0) {
                        f = {
                            transform: 'translateY(0px)',
                            '-webkit-transform': 'translateY(0px)',
                            '-webkit-transition': '0.2s ease 0s',
                            transition: '0.2s ease 0s'
                        };
                        d = {
                            transform: 'translateY(0px)',
                            '-webkit-transform': 'translateY(0px)',
                            '-webkit-transition': '',
                            transition: ''
                        }
                    }
                }
            }
            if (c != 0) {
                $('#' + h).css(f);
                setTimeout(function () {
                    $('#' + h).css(d)
                }, 200);
                return true
            } else {
                $('#' + h).css({
                    transform: 'translateY(0px)'
                });
                $('#' + h).css({
                    '-webkit-transform': 'translateY(0px)'
                });
                return false
            }
        },
        getY: function (e) {
            var d = this;
            var c = $('#' + e).css('transform');
            if (!c) {
                c = $('#' + e).css('-webkit-transform')
            }
            if (c == 'none') {
                c = 0
            } else {
                c = c.replace('translateY(', '').replace(')', '');
                c = parseInt(c, 10)
            }
            if (!c) {
                c = 0
            }
            return c
        }
    }

    $.fn.tab = function(opts){
        var set = $.extend({
            tabClass:'tabTit',
            conClass:'tabList',
            eventType:'click',
            activeClass:'cur',
            current:0
        },opts||{});
        var target = $(this),tabs = target.children('.'+set.tabClass).find('li'),cons = target.children('.'+set.conClass).children();
        var oClass = set.activeClass;
        cons.hide().eq(set.current).show();
        // tabs.eq(set.current).addClass(oClass).siblings().removeClass(oClass);
        tabs.each(function(i){
            $(this)[set.eventType](function(event){
                event.preventDefault();
                var pos = $(this).position();
                target.children('.'+set.conClass).show();
                $(this).addClass(oClass).siblings().removeClass(oClass);
                cons.hide().eq(i).show();
                setTimeout(function(){
                    console.log(pos.top)
                    $('#scrollContent').scrollTop(pos.top);
                },0);
            });
        });
    };


    

    var UA = window.navigator.userAgent,
        isAndorid = /android/i.test(UA),
        isIphone = /iphone/i.test(UA),
        isPad = /ipad/i.test(UA),
        isDolphin = typeof dolphin !== 'undefined',
        device = isAndorid ? 'android' : isIphone ? 'iphone' : isPad ? 'ipad':'unknow',
        $dowload = $('#J-download-btn'),
        $like = $('#J-like');

    var downloadUrl = {
            android:'market://details?id=com.dolphin.browser.android.jp&referrer=channel_id%3Dnewyear%26utm_source%3Dh5%26utm_medium%3Dh5%26utm_campaign%3Dnewyear',
            iphone:'https://goo.gl/u1BCug',
            ipad:'https://goo.gl/wyNx6n',
            unknow:'#'
        },
        likeUrl = {
            android:'market://details?id=com.dolphin.browser.android.jp&referrer=channel_id%3Dnewyear1%26utm_source%3Dh51%26utm_medium%3Dh51%26utm_campaign%3Dnewyear1',
            iphone:'https://goo.gl/Ssnx67',
            ipad:'https://goo.gl/UGbDO3',
            unknow:'#'
        }

    //if the browser is not dolphin browser,show the download
    if(!isDolphin){
        $('#J-download').removeClass('dis_none');
    }

     //set download url
    $dowload.attr('href',downloadUrl[device]);
    $like.attr('href',likeUrl[device]);


    $like.on('click',function(){
        ga('send', 'event', 'new_year_h5', 'click','like');
    });

    $dowload.on('click',function(){
        ga('send', 'event', 'new_year_h5', 'click','download');
    });

    $('#J-share').on('click',function(){
        isDolphin && dolphin.share ? shareWidthDolphin() : shareWidthLink();
        ga('send', 'event', 'new_year_h5', 'click','share');
    });

    
    var $shareWrap = $('#J-share-box');
    function shareWidthLink(){
        $shareWrap.removeClass('dis_none');
    }
    $('#J-share-close').on('click',function(){
        $shareWrap.addClass('dis_none');
    });

    // replace share url
    function ReplaceShareUrl(url){
        var arr = ['#ShareUrl1','#ShareUrl2','#ShareUrl3','#ShareUrl4','#ShareUrl5','#ShareUrl6'];
        for(var i = 0;i<arr.length;i++){
            var s = $(arr[i])[0].outerHTML.replace(/shareurl/g,url);
            $(arr[i])[0].outerHTML = s;
        }
    }

    var datashareurl;

    // share
    function shareWidthDolphin(){
        dolphin.share('友達から年賀状が届きました！開けてみましょう！', datashareurl, 'img/icon.png');
    };

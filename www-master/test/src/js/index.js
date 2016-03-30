    require('./zepto.js')();
    require('./zepto.alert.js')();
    require('./flexible.js')();

    // loading
    document.onreadystatechange = todo;
    function todo() 
    { 
        if(document.readyState == "complete")
        {
            $("#loading").hide();
            $(".wrap").removeClass('dis_none');
        }
    } 

    var clicks,html = $('#J-txtwrap li').html();

    $("#J-picTpl").on("click", "a", function(e){
        e.preventDefault();
        e.stopPropagation();
        clicks = 0;
        $("#J-picTpl").addClass("dis_none");
        $("#J-picUpload").removeClass('dis_none');
        $("#J-picCover").attr('src', $(this).data('url'));
        $("#J-picCover").attr('alt', $(this).data('tmpid'));
        $("#J-tmpl").addClass( $("#J-picCover").attr('alt'));
        $('#J-txtwrap').on("click",altDia);
    });


     // dialog
    function altDia() {
        $(".rDialog").appendTo("body");
        $(".rDialog-mask").appendTo("body");
        clicks ++;
        if(clicks === 0){
           $('#J-txtwrap li').html(html);
        }
        $.dialog({
            content : '<textarea id="J-txt" class="textInput" maxlength="40"></textarea>',
            title : '',
            ok : function() {
                var val = $("#J-txt").val();
                if(!val || val.length === 0){
                    return false;
                }else{
                    $('#J-txtwrap li').html($("#J-txt").val());
                    $("#J-submit").removeAttr('disabled').addClass('active');
                    $(".rDialog").remove();
                    $(".rDialog-mask").remove();
                }
            },
            cancel : function() {
                $(".rDialog").remove();
                $(".rDialog-mask").remove();
            }
        });

        if($('#J-txtwrap li').html() !== html){
            $("#J-txt").val($('#J-txtwrap li').html())
        }else{
            $("#J-txt").val(''); 
        }        
    }


    //reset
    $(".J-reset").on("click",function(){
        $("#J-picCover").attr('src','');
        $("#J-txtwrap li").html('コメントを入力できます');
        $("#J-picUpload").addClass('dis_none');
        $("#J-tmpl").attr('class','tmpl');
        $('#J-picTpl').removeClass('dis_none');
        $("#J-submit").attr('disabled','disabled').removeClass('active');
        $("#J-btn2").addClass('dis_none');
        $(".txtlink").addClass('dis_none');
        $("#J-btn").removeClass('dis_none');
    });

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

    // completed
    $("#J-submit").on('click',function(){
        var formdata = new FormData();
        formdata.append('picCover',$("#J-picCover").attr('src'));
        formdata.append('txt',$("#J-txtwrap li").html());
        formdata.append('tmp',$("#J-picCover").attr('alt'));
        $.ajax({
            type: 'post',
            // url: 'http://172.16.7.14/dop/newyearcard.json',//test
            url: 'http://opsen.dolphin-browser.com/dop/newyearcard.json',//online
            data: formdata,
            processData: false,  
            contentType: false,
            success: function(data) {
                $("#uploadLoading").hide();
                $("#J-btn").addClass('dis_none');
                $("#J-btn2").removeClass('dis_none');
                $(".txtlink").removeClass('dis_none');
                datashareurl = data.data.url;
                ReplaceShareUrl(data.data.url);
                $('#J-txtwrap').unbind("click");
            },
            error: function(e){
            }
        });
    });


    // share
    function shareWidthDolphin(){
        dolphin.share('友達から年賀状が届きました！開けてみましょう！', datashareurl, 'img/icon.png');
    };

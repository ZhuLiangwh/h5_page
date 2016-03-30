    require('./zepto.js')();
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

    $("#J-picTpl").on("click", "a", function(e){
        $("#J-picTpl").addClass("dis_none");
        $("#J-picUpload").removeClass('dis_none');
        $("#J-picCover").attr('src', $(this).data('url'));
    })

    $.fn.imgPreivew = function(opts){
        var param = $(this).data('param'),
            set = $.extend({
            view:'',
            change:function(){}
        },opts||{},param ? eval('('+param+')'):{});
        var $view = $(set.view),$img = $view.find('img'),reader;
        
        $img.length === 0 && $view.append($img = $(document.createElement('img')).hide());
        
        $img.on('load',function(){
            set.change(this);
        });

        $(this).on('change',function(){
            $img.show();
            if(this.files && this.files[0]){
                var fileNameReg = /[^image]|\.(jpeg|jpg|png|gif)$/i;
                if(!fileNameReg.test(this.files[0].name)){
                  alert('JPG、PNGフォーマットの写真を選んでください');
                  return;
                }

                if(this.files[0].size/1024 > 5*1024){
                    alert('5MB以下の写真を選んでください');
                    return;
                }
                        
                reader = new FileReader();                
                reader.onload = function(evt){
                    $img.attr('src',evt.target.result);
                }
                reader.readAsDataURL(this.files[0]);

            }
        });
    };


    $('#J-uploadImg').imgPreivew({view:'#J-picView',change:function(){
            $("#J-fileIcon").addClass('dis_none');
            $("#J-uploadImg").addClass('dis_none');
            $("#J-submit").removeAttr('disabled').addClass('active');
        }
    });


    //reset
    $(".J-reset").on("click",function(){
        $("#J-uploadImg").val('');
        $("#J-picCover").attr('src','');
        $("#J-picView img").attr('src','');
        $("#J-picTpl").removeClass('dis_none');
        $("#J-fileIcon").removeClass('dis_none');
        $("#J-uploadImg").removeClass('dis_none');
        $("#J-picUpload").addClass('dis_none');
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
            iphone:'https://itunes.apple.com/app/apple-store/id482508913?pt=546056&ct=newyear_download&mt=8',
            ipad:'https://itunes.apple.com/app/apple-store/id482528271?pt=546056&ct=newyear_download&mt=8',
            unknow:'#'
        },
        likeUrl = {
            android:'market://details?id=com.dolphin.browser.android.jp&referrer=channel_id%3Dnewyear1%26utm_source%3Dh51%26utm_medium%3Dh51%26utm_campaign%3Dnewyear1',
            iphone:'https://itunes.apple.com/app/apple-store/id482508913?pt=546056&ct=newyear_like&mt=8',
            ipad:'https://itunes.apple.com/app/apple-store/id482528271?pt=546056&ct=newyear_like&mt=8',
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

    //压缩图片
    // $.fn.localResizeImg = function(opts){
    //     var setings = $.extend({
    //         width:540,
    //         qualtiy:0.8,
    //         before:function(){

    //         },
    //         success:function(){}
    //     },opts||{});

    //     var $self = $(this);
    //     $self.on('change',function(){            
    //         var file = this.files && this.files[0],
    //             URL = window.URL || window.webkitURL,
    //             blob = URL.createObjectURL(file);
    //         if(file){
    //             // alert(JSON.stringify(this.files[0]));
    //             var fileNameReg = /[^image]|\.(jpeg|jpg|png|gif)$/i;
    //             if(!fileNameReg.test(this.files[0].name)){
    //               alert('JPEG、JPG、PNGフォーマットの写真を選んでください');
    //               return;
    //             }
    //             if($.isFunction(setings.before)){
    //                 setings.before(this,blob,file);
    //             }
    //             alert(blob);
    //             _create(blob,file);
    //             this.value = '';
    //         }
           
    //     });

    //     function _create(blob,file){
    //         var img = new Image();
    //         img.src = blob;
    //         img.onload = function(){
    //         alert(blob);

    //             var self = this,
    //                 w = self.width,
    //                 h = self.height,
    //                 s = w / h;

    //             w = setings.width || w;
    //             h = w / s;

    //             var canvas = document.createElement('canvas'),
    //                 ctx = canvas.getContext('2d');

    //             $(canvas).attr({
    //                 width:w,
    //                 height:h
    //             });

    //             ctx.drawImage(self,0, 0, w,h);

    //             // /!**
    //             //  * 生成base64
    //             //  * 兼容修复移动设备需要引入mobileBUGFix.js
    //             //  *!/
    //             var base64 = canvas.toDataURL('image/jpeg',setings.qualtiy);
    //             // 修复IOS
    //             if(navigator.userAgent.match(/iphone/i)){
    //                 var mpImg = new MegaPixImage(img);
    //                 mpImg.render(canvas,{
    //                     maxWidth:w,
    //                     MaxHeight:h,
    //                     quality:setings.quality
    //                 });
    //                 base64 = canvas.toDataURL('image/jpeg',setings.quality);
    //             }

    //             // 修复android
    //             if (navigator.userAgent.match(/Android/i)) {
    //                 var encoder = new JPEGEncoder();
    //                 base64 = encoder.encode(ctx.getImageData(0, 0, w, h), setings.quality * 100);
    //             }

    //             // 生成结果
    //             var result = {
    //                 base64: base64,
    //                 clearBase64: base64.substr(base64.indexOf(',') + 1)
    //             };
    //             alert(JSON.stringify(result));
    //             // 执行后函数
    //             setings.success(result);
    //         }
    //     }
    // };

    // var pic = $("#J-pic");
    // var file;

    // $("#J-uploadImg").localResizeImg({
    //     success:function(result){
    //         alert(result.base64);
    //         pic.attr('src',result.base64);
    //         file = result.clearBase64;
    //         $("#J-fileIcon").addClass('dis_none');
    //         $("#J-uploadImg").addClass('dis_none');
    //         $("#J-submit").removeAttr('disabled').addClass('active');
    //     }
    // })

    var datashareurl;
    // completed
    $("#J-submit").on('click',function(){
        var formdata = new FormData();
        formdata.append('picCover',$("#J-picCover").attr('src'));
        formdata.append('pic',$("#J-picView img").attr('src'));
        $("#uploadLoading").show();
        $.ajax({
            type: 'post',
            url: 'http://172.16.7.14/dop/newyearcard.json',
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
            },
            error: function(e){
            }
        });
    });


    // share
    function shareWidthDolphin(){
        dolphin.share('友達から写真年賀状が届きました！開けてみましょう！', datashareurl, 'img/icon.png');
    };
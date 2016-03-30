;(function($){
    var UA = window.navigator.userAgent,
        isAndorid = /android/i.test(UA),
        isIphone = /iphone/i.test(UA),
        isPad = /ipad/i.test(UA),
        isDolphin = typeof dolphin !== 'undefined';
        device = isAndorid ? 'android' : isIphone ? 'iphone' : isPad ? 'ipad':'unknow';

    var downloadUrl = {
            android:'market://details?id=com.dolphin.browser.android.jp&referrer=channel_id%3Dchristmas%26utm_source%3Dh5%26utm_medium%3Dh5%26utm_campaign%3Dchristmas',
            iphone:'https://itunes.apple.com/app/apple-store/id482508913?pt=546056&ct=christmas_download&mt=8',
            ipad:'https://itunes.apple.com/app/apple-store/id482528271?pt=546056&ct=christmas_download&mt=8',
            unknow:'#'
        },
        likeUrl = {
            android:'market://details?id=com.dolphin.browser.android.jp&referrer=channel_id%3Dchristmas1%26utm_source%3Dh51%26utm_medium%3Dh51%26utm_campaign%3Dchristmas1',
            iphone:'https://itunes.apple.com/app/apple-store/id482508913?pt=546056&ct=christmas_like&mt=8',
            ipad:'https://itunes.apple.com/app/apple-store/id482528271?pt=546056&ct=christmas_like&mt=8',
            unknow:'#'
        }

    //if the browser is not dolphin browser,show the download
    if(!isDolphin){
        $('#J-download').show();
    }

    var $userInput = $('#J-user-input'),
        $btnCheck = $('#J-btn-check'),
        $pageIndex = $('#J-page-index'),
        $pageResult = $('#J-page-result'),
        $userName = $('#J-user-name'),
        $gift = $('#J-gift'),
        $giftName = $('#J-gift-name'),
        $prediction = $('#J-prediction'),
        $dowload = $('#J-download-btn'),
        $like = $('#J-like');

    var gifts = ['いちごケーキ','マイスターベア','ディズニーチケット','ローストチキン','クリスマスビール','クリスマスショコラ','可愛い抱き枕','手袋','クリスマスクッキー','サンタハット']
    //set prediction
    var n = window.localStorage.getItem('prediction') || 4769163;
    $prediction.text((++n).toString().replace(/\B(?=(\d{3})+$)/g,','));
    window.localStorage.setItem('prediction',n);

    //set download url
    $dowload.attr('href',downloadUrl[device]);
    $like.attr('href',likeUrl[device]);

    // check gift
    $btnCheck.on('click',function(){
        var val = $userInput.val().trim(),gift;
        if(val === '') return;
        $userInput.val('');
        //set name
        $userName.text(val);
        $pageIndex.hide();
        $pageResult.show();
        //get gift
        gift = Math.floor(Math.random()*10);
        $gift.attr('src','images/gift_'+ gift +'.png');
        $giftName.text(gifts[gift]);

        ga('send', 'event', 'christmas_h5', 'click','check_your_gift');
    });

    $('#J-try-agin').on('click',function(){
        ga('send', 'event', 'christmas_h5', 'click','try_again');
        window.location.reload();
    });

    $like.on('click',function(){
        ga('send', 'event', 'christmas_h5', 'click','like');
    });

    $dowload.on('click',function(){
        ga('send', 'event', 'christmas_h5', 'click','download');
    });

    $('#J-share').on('click',function(){
        isDolphin ? shareWidthDolphin() : shareWidthLink();
        ga('send', 'event', 'christmas_h5', 'click','share');
    });


    function shareWidthDolphin(){
        dolphin.share('私はサンタさんから素敵なプレゼントをもらいました！あなたのプレゼントは？',window.location.href,'images/icon.png');
    };
    var $shareWrap = $('#J-share-box');
    function shareWidthLink(){
        $shareWrap.show();
    }
    $('#J-share-close').on('click',function(){
        $shareWrap.hide();
    });

})(Zepto);
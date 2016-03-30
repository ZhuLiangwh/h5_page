requirejs(['./zepto.min','./swiper.min','./rebox'], function () {
    function scroll(scrollTo, time) {
        var scrollFrom = parseInt(document.body.scrollTop),
            i = 0,
            runEvery = 5; 
        scrollTo = parseInt(scrollTo);
        time /= runEvery;

        var interval = setInterval(function () {
            i++;
            document.body.scrollTop = (scrollTo - scrollFrom) / time * i + scrollFrom;
            if (i >= time) {
                clearInterval(interval);
            }
        }, runEvery);
    }

    var KEY = 'dolphin_new_survey',localStorage = window.localStorage;

    function init(){
        var hasSubmit = localStorage.getItem(KEY);
        $('#feed_back_form')[hasSubmit ? 'hide' : 'show']();
        $('#endtxt')[hasSubmit ? 'show' : 'hide']();
    }

    init();

    // 设置加载代码片段
    function loadFragment(fragment,callback){
        var iframe = document.createElement('iframe'),doc;
        iframe.style.cssText = 'position:absolute;left:-999999px;width:0px;height:0px;';
        document.body.appendChild(iframe);
        doc = iframe.contentDocument;
        doc.open();
        doc.writeln(fragment);
        iframe.onload = function(){
            callback();
            document.body.removeChild(iframe);
        }
        doc.close();
    }

    // 代码片段
    loadFragment($('#Swiper_box').html(),function(){
        $('#Swiper_box').show();
        $('#loader_box').hide();
        var mySwiper = new Swiper('.swiper-container',{
            effect : 'coverflow',
            slidesPerView: 3,
            centeredSlides: true,
            coverflow: {
                rotate: 30,
                stretch: 0,
                depth: 100,
                modifier: 2,
                slideShadows : true
            },
            pagination : '.swiper-pagination'
        });
        $('#Swiper_box').rebox({ selector: 'a' });
    });

    function reset(){
        $('.sub_btn').attr('disabled','disabled').removeClass('active');
        $(".form_list li").removeClass('checked').children("input").removeAttr('checked');
        $('.textarea').val('');
    }

    $("#like").on("click",function(){
        $("#islike").val(1);
        reset();
    });

    $("#dislike").on("click",function(){
        $("#islike").val(0);
        reset();
    });


    // tab切换
    $('#tab_tit p').click(function(){ 
        scroll('500px', 500);
        $(this).addClass("active").siblings('p').removeClass('active');
        $("#tab_cont").removeClass();
        $("#tab_cont > .form_cont").hide().eq($('#tab_tit p').index(this)).show(); 
    }); 

    function isActive(self){
        $('.sub_btn')[self.hasClass('checked') ? 'addClass' : 'removeClass']('active');
        $('.sub_btn')[self.hasClass('checked') ? 'removeAttr' : 'attr']('disabled','disabled');
    }

    $(".form_list li").on('click',function(){
        $(this).addClass('checked').siblings().removeClass('checked');
        $(this).children("input").attr('checked','checked').parents().siblings('li').children('input').removeAttr('checked');
        isActive($(this));

    });


    $('.textarea').on("input", function(){
        if($(this).val().length != 0){
            $(this).addClass('checked');
            isActive($(this))
        }else{
            $(this).removeClass('checked');
            if( $(".form_list li").hasClass('checked')){
                $(this).addClass('checked'); 
            }
            isActive($(this))  
        } 
    });


    // 提交数据
    function ajaxSubmit() {
        $.ajax({
            type:'GET', 
            url :'http://opsen.dolphin-browser.com/api/feedback_en.json',//172.16.7.101
            data: {
                islike: $("#islike").val(),
                point : $("#like").hasClass('active') ? $("#like_cont .checked .regular-radio").val():$("#dislike_cont .checked .regular-radio").val(),
                other : $("#like").hasClass('active') ? $("#other").val() : $("#disother").val(),
                tag : 'ui',
                source: 'email'
            },
            dataType: 'json',
            success : function(data){
                localStorage.setItem(KEY,true);
                init();
            },
            error: function(err){

            }    

        });
        return false;
    }


    $('.sub_btn').on('click', function(e){
        e.preventDefault();
        ajaxSubmit();
    });

});


    

    
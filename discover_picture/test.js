/**
 * Created by jhzhang on 2015/7/27.
 */
function anonymous(obj
                   /**/) {
    var p = [], print = function () {
        p.push.apply(p, arguments);
    };
    with (obj) {
        p.push('     ');
        var re = [[], []];
        p.push('     ');
        for (var i = 0, len = items.length; i < len; i++) {
            p.push('         re[i%2].push(\'<li>\'             +\'<a title=', items[i].name, ' rel="gallery-1" href=', items[i].detailUrl, ' class="swipebox">\'                 +\'<img src="', items[i].imageUrl, '" alt="" class="lazy"/>\'             +\'</a>\'         +\'</li>\')     ');
        }
        p.push('     <ul class="picture_detail">         ', re[0].join(), '     </ul>     <ul class="picture_detail">         ', re[1].join(), '     </ul> ');
    }
    return p.join('');
}
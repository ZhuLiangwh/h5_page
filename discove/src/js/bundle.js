"use strict";

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw (f.code = "MODULE_NOT_FOUND", f);
      }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
        var n = t[o][1][e];return s(n ? n : e);
      }, l, l.exports, e, t, n, r);
    }return n[o].exports;
  }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
    s(r[o]);
  }return s;
})({ 1: [function (require, module, exports) {
    module.exports = function () {
      ;(function (win, lib) {
        var doc = win.document;
        var docEl = doc.documentElement;
        var metaEl = doc.querySelector('meta[name="viewport"]');
        var flexibleEl = doc.querySelector('meta[name="flexible"]');
        var dpr = 0;
        var scale = 0;
        var tid;
        var flexible = lib.flexible || (lib.flexible = {});

        if (metaEl) {
          console.warn('将根据已有的meta标签来设置缩放比例');
          var match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
          if (match) {
            scale = parseFloat(match[1]);
            dpr = parseInt(1 / scale);
          }
        } else if (flexibleEl) {
          var content = flexibleEl.getAttribute('content');
          if (content) {
            var initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
            var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
            if (initialDpr) {
              dpr = parseFloat(initialDpr[1]);
              scale = parseFloat((1 / dpr).toFixed(2));
            }
            if (maximumDpr) {
              dpr = parseFloat(maximumDpr[1]);
              scale = parseFloat((1 / dpr).toFixed(2));
            }
          }
        }

        if (!dpr && !scale) {
          var isAndroid = win.navigator.appVersion.match(/android/gi);
          var isIPhone = win.navigator.appVersion.match(/iphone/gi);
          var devicePixelRatio = win.devicePixelRatio;
          if (isIPhone) {
            // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
            if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
              dpr = 3;
            } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
              dpr = 2;
            } else {
              dpr = 1;
            }
          } else {
            // 其他设备下，仍旧使用1倍的方案
            dpr = 1;
          }
          scale = 1 / dpr;
        }

        docEl.setAttribute('data-dpr', dpr);
        if (!metaEl) {
          metaEl = doc.createElement('meta');
          metaEl.setAttribute('name', 'viewport');
          metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
          if (docEl.firstElementChild) {
            docEl.firstElementChild.appendChild(metaEl);
          } else {
            var wrap = doc.createElement('div');
            wrap.appendChild(metaEl);
            doc.write(wrap.innerHTML);
          }
        }

        function refreshRem() {
          var width = docEl.getBoundingClientRect().width;
          if (width / dpr > 540) {
            width = 540 * dpr;
          }
          var rem = width / 10;
          docEl.style.fontSize = rem + 'px';
          flexible.rem = win.rem = rem;
        }

        win.addEventListener('resize', function () {
          clearTimeout(tid);
          tid = setTimeout(refreshRem, 300);
        }, false);
        win.addEventListener('pageshow', function (e) {
          if (e.persisted) {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
          }
        }, false);

        if (doc.readyState === 'complete') {
          doc.body.style.fontSize = 12 * dpr + 'px';
        } else {
          doc.addEventListener('DOMContentLoaded', function (e) {
            doc.body.style.fontSize = 12 * dpr + 'px';
          }, false);
        }

        refreshRem();

        flexible.dpr = win.dpr = dpr;
        flexible.refreshRem = refreshRem;
        flexible.rem2px = function (d) {
          var val = parseFloat(d) * this.rem;
          if (typeof d === 'string' && d.match(/rem$/)) {
            val += 'px';
          }
          return val;
        };
        flexible.px2rem = function (d) {
          var val = parseFloat(d) / this.rem;
          if (typeof d === 'string' && d.match(/px$/)) {
            val += 'rem';
          }
          return val;
        };
      })(window, window['lib'] || (window['lib'] = {}));
    };
  }, {}], 2: [function (require, module, exports) {
    require('./zepto.js')();
    require('./zepto.alert.js')();
    require('./flexible.js')();

    var scrollContent = document.getElementById("scrollContent"),
        content = document.getElementById('content');

    var display = false;
    var sdegree = 0;

    window.onload = function () {

      display = !display;
      scrollContent.style.height = display ? $(window).height() - $("#scrollTop").height() - $("#scrollBottom").height() - 20 + 'px' : "0px";

      $('.MyTab').each(function () {
        $(this).tab();
      });

      // f.rootTouchBind("content");

      return false;
    };

    window.onresize = function () {
      scrollContent.style.height = display ? $(window).height() - $("#scrollTop").height() - $("#scrollBottom").height() - 20 + 'px' : "0px";
    };

    //scrolling
    var f = {
      rootTouchObj: {
        startY: 0,
        scrollY: 0
      },
      scrollRootHeight: function scrollRootHeight(t) {
        var that = $('#' + t);
        var h = that.height();
        var c = that.parent().height();
        var p = h - c;
        return p;
      },
      rootTouchBind: function rootTouchBind(t) {
        var c = this;
        var d = $('#' + t);
        var l = d.height();
        var p = d.parent().height();
        if (l < p) {
          return;
        };
        $('#' + t).on('touchstart', function (d) {
          c.rootTouchObj.startY = d.touches[0].clientY;
          c.rootTouchObj.scrollY = 0;
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
            d = 150;
          } else {
            if (d < c.scrollRootHeight(t) * -1 - 150) {
              d = c.scrollRootHeight(t) * -1 - 150;
            }
          }
          $('#' + t).css('transform', 'translateY(' + d + 'px)');
          $('#' + t).css('-webkit-transform', 'translateY(' + d + 'px)');
          c.rootTouchObj.scrollY = f - c.rootTouchObj.startY;
          c.rootTouchObj.startY = f;
        });
        $('#' + t).on('touchend', function (d) {
          c.touchScroll(c.rootTouchObj.scrollY, t, c.scrollRootHeight(t));
        });
      },
      touchScroll: function touchScroll(k, d, m, g) {
        var c = this;
        var e = Math.abs(k);
        var h = 0;
        var f = 200;
        var l = d;
        var j = 0;
        if (e >= 40) {
          h = 15;
        } else {
          if (e < 40 && e >= 25) {
            h = 10;
          } else {
            if (e < 25 && e >= 10) {
              h = 5;
            } else {
              h = 0;
            }
          }
        }
        if (h > 0) {
          if (k < 0) {
            h = h * -1;
          }
          setTimeout(function () {
            c.touchScrollRun(h, d, 0, m, g);
          }, 2);
        } else {
          var i = 0;
          i = c.getY(d);
          c.goToEnd(i, d, m);
        }
      },
      touchScrollRun: function touchScrollRun(h, k, g, e, f) {
        var i = this;
        var j = g + 1;
        if (f) {
          i.imgLazyLad.lazyLad();
        }
        if (g < 50) {
          var d = 0;
          d = i.getY(k) + h;
          $('#' + k).css('transform', 'translateY(' + d + 'px)');
          $('#' + k).css('-webkit-transform', 'translateY(' + d + 'px)');
          if (d <= e * -1 - 30 || d >= 30) {
            i.goToEnd(d, k, e);
          } else {
            setTimeout(function () {
              i.touchScrollRun(h, k, j, e, f);
            }, 2);
          }
        } else {
          i.goToEnd(d, k, e);
        }
      },
      goToEnd: function goToEnd(c, h, e) {
        var g = this;
        var f = null;
        var d = null;
        if (e > 0) {
          if (c < e * -1) {
            f = {
              transform: 'translateY(' + e * -1 + 'px)',
              '-webkit-transform': 'translateY(' + e * -1 + 'px)',
              '-webkit-transition': '0.2s ease 0s',
              transition: '0.2s ease 0s'
            };
            d = {
              transform: 'translateY(' + e * -1 + 'px)',
              '-webkit-transform': 'translateY(' + e * -1 + 'px)',
              '-webkit-transition': '',
              transition: ''
            };
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
              };
            }
          }
        }
        if (c != 0) {
          $('#' + h).css(f);
          setTimeout(function () {
            $('#' + h).css(d);
          }, 200);
          return true;
        } else {
          $('#' + h).css({
            transform: 'translateY(0px)'
          });
          $('#' + h).css({
            '-webkit-transform': 'translateY(0px)'
          });
          return false;
        }
      },
      getY: function getY(e) {
        var d = this;
        var c = $('#' + e).css('transform');
        if (!c) {
          c = $('#' + e).css('-webkit-transform');
        }
        if (c == 'none') {
          c = 0;
        } else {
          c = c.replace('translateY(', '').replace(')', '');
          c = parseInt(c, 10);
        }
        if (!c) {
          c = 0;
        }
        return c;
      }
    };

    $.fn.tab = function (opts) {
      var set = $.extend({
        tabClass: 'tabTit',
        conClass: 'tabList',
        eventType: 'click',
        activeClass: 'cur',
        current: 0
      }, opts || {});
      var target = $(this),
          tabs = target.children('.' + set.tabClass).find('li'),
          cons = target.children('.' + set.conClass).children();
      var oClass = set.activeClass;
      cons.hide().eq(set.current).show();
      // tabs.eq(set.current).addClass(oClass).siblings().removeClass(oClass);
      tabs.each(function (i) {
        $(this)[set.eventType](function (event) {
          event.preventDefault();
          var pos = $(this).position();
          target.children('.' + set.conClass).show();
          $(this).addClass(oClass).siblings().removeClass(oClass);
          cons.hide().eq(i).show();
          setTimeout(function () {
            console.log(pos.top);
            $('#scrollContent').scrollTop(pos.top);
          }, 0);
        });
      });
    };

    var UA = window.navigator.userAgent,
        isAndorid = /android/i.test(UA),
        isIphone = /iphone/i.test(UA),
        isPad = /ipad/i.test(UA),
        isDolphin = typeof dolphin !== 'undefined',
        device = isAndorid ? 'android' : isIphone ? 'iphone' : isPad ? 'ipad' : 'unknow',
        $dowload = $('#J-download-btn'),
        $like = $('#J-like');

    var downloadUrl = {
      android: 'market://details?id=com.dolphin.browser.android.jp&referrer=channel_id%3Dnewyear%26utm_source%3Dh5%26utm_medium%3Dh5%26utm_campaign%3Dnewyear',
      iphone: 'https://goo.gl/u1BCug',
      ipad: 'https://goo.gl/wyNx6n',
      unknow: '#'
    },
        likeUrl = {
      android: 'market://details?id=com.dolphin.browser.android.jp&referrer=channel_id%3Dnewyear1%26utm_source%3Dh51%26utm_medium%3Dh51%26utm_campaign%3Dnewyear1',
      iphone: 'https://goo.gl/Ssnx67',
      ipad: 'https://goo.gl/UGbDO3',
      unknow: '#'
    };

    //if the browser is not dolphin browser,show the download
    if (!isDolphin) {
      $('#J-download').removeClass('dis_none');
    }

    //set download url
    $dowload.attr('href', downloadUrl[device]);
    $like.attr('href', likeUrl[device]);

    $like.on('click', function () {
      ga('send', 'event', 'new_year_h5', 'click', 'like');
    });

    $dowload.on('click', function () {
      ga('send', 'event', 'new_year_h5', 'click', 'download');
    });

    $('#J-share').on('click', function () {
      isDolphin && dolphin.share ? shareWidthDolphin() : shareWidthLink();
      ga('send', 'event', 'new_year_h5', 'click', 'share');
    });

    var $shareWrap = $('#J-share-box');
    function shareWidthLink() {
      $shareWrap.removeClass('dis_none');
    }
    $('#J-share-close').on('click', function () {
      $shareWrap.addClass('dis_none');
    });

    // replace share url
    function ReplaceShareUrl(url) {
      var arr = ['#ShareUrl1', '#ShareUrl2', '#ShareUrl3', '#ShareUrl4', '#ShareUrl5', '#ShareUrl6'];
      for (var i = 0; i < arr.length; i++) {
        var s = $(arr[i])[0].outerHTML.replace(/shareurl/g, url);
        $(arr[i])[0].outerHTML = s;
      }
    }

    var datashareurl;

    // share
    function shareWidthDolphin() {
      dolphin.share('友達から年賀状が届きました！開けてみましょう！', datashareurl, 'img/icon.png');
    };
  }, { "./flexible.js": 1, "./zepto.alert.js": 3, "./zepto.js": 4 }], 3: [function (require, module, exports) {
    module.exports = function () {
      ;(function ($, window, undefined) {

        var win = $(window),
            doc = $(document),
            count = 1,
            isLock = false;

        var Dialog = function Dialog(options) {

          this.settings = $.extend({}, Dialog.defaults, options);

          this.init();
        };

        Dialog.prototype = {

          /**
           * 初始化
           */
          init: function init() {

            this.create();

            if (this.settings.lock) {
              this.lock();
            }

            if (!isNaN(this.settings.time) && this.settings.time != null) {
              this.time();
            }
          },

          /**
           * 创建
           */
          create: function create() {

            var divHeader = this.settings.title == null ? '' : '<div class="rDialog-header-' + this.settings.title + '"></div>';

            // HTML模板
            var templates = '<div class="rDialog-wrap">' + divHeader + '<div class="rDialog-content">' + this.settings.content + '</div>' + '<div class="rDialog-footer"></div>' + '</div>';

            // 追回到body
            this.dialog = $('<div>').addClass('rDialog').css({ zIndex: this.settings.zIndex + count++ }).html(templates).prependTo('body');

            // 设置ok按钮
            if ($.isFunction(this.settings.ok)) {
              this.ok();
            }

            // 设置cancel按钮
            if ($.isFunction(this.settings.cancel)) {
              this.cancel();
            }

            // 设置大小
            this.size();

            // 设置位置
            this.position();
          },

          /**
           * ok
           */
          ok: function ok() {
            var _this = this,
                footer = this.dialog.find('.rDialog-footer');

            $('<a>', {
              // href : 'javascript:;',
              text: this.settings.okText
            }).on("click", function (e) {
              e.preventDefault();
              var okCallback = _this.settings.ok();
              if (okCallback == undefined || okCallback) {
                _this.close();
              }
            }).addClass('rDialog-ok').prependTo(footer);
          },

          /**
           * cancel
           */
          cancel: function cancel() {

            var _this = this,
                footer = this.dialog.find('.rDialog-footer');

            $('<a>', {
              // href : 'javascript:;',
              text: this.settings.cancelText
            }).on("click", function (e) {
              e.preventDefault();
              var cancelCallback = _this.settings.cancel();
              if (cancelCallback == undefined || cancelCallback) {
                _this.close();
              }
            }).addClass('rDialog-cancel').appendTo(footer);
          },

          /**
           * 设置大小
           */
          size: function size() {

            var content = this.dialog.find('.rDialog-content'),
                wrap = this.dialog.find('.rDialog-wrap');

            content.css({
              width: this.settings.width,
              height: this.settings.height
            });
            //wrap.width(content.width());
          },

          /**
           * 设置位置
           */
          position: function position() {

            // var _this = this,
            //     winWidth = win.width(),
            //     winHeight = win.height(),
            //     scrollTop = 0;

            // this.dialog.css({
            //     left : (winWidth - _this.dialog.width()) / 2,
            //     top : (winHeight - _this.dialog.height()) / 2 + scrollTop
            // });

          },

          /**
           * 设置锁屏
           */
          lock: function lock() {

            if (isLock) return;

            this.lock = $('<div>').css({ zIndex: this.settings.zIndex }).addClass('rDialog-mask');
            this.lock.appendTo('body');

            isLock = true;
          },

          /**
           * 关闭锁屏
           */
          unLock: function unLock() {
            if (this.settings.lock) {
              if (isLock) {
                // this.lock.remove();
                isLock = false;
              }
            }
          },

          //   /**
          //    * 关闭方法
          //    */
          close: function close() {
            this.dialog.remove();
            this.unLock();
          },

          /**
           * 定时关闭
           */
          time: function time() {

            var _this = this;

            this.closeTimer = setTimeout(function () {
              _this.close();
            }, this.settings.time);
          },

          fixblur: function fixblur() {
            $("#J-txt").css("-moz-user-select", "none");
          }

        };

        /**
         * 默认配置
         */
        Dialog.defaults = {

          // 内容
          content: '加载中...',

          // 标题
          title: 'load',

          // 宽度
          width: 'auto',

          // 高度
          height: 'auto',

          // 确定按钮回调函数
          // ok: null,

          // // 取消按钮回调函数
          // cancel: null,

          // 确定按钮文字
          okText: 'OK',

          // 取消按钮文字
          cancelText: 'Cancel',

          // 自动关闭时间(毫秒)
          time: null,

          // 是否锁屏
          lock: true,

          // z-index值
          zIndex: 9999

        };

        var rDialog = function rDialog(options) {
          return new Dialog(options);
        };

        window.rDialog = $.rDialog = $.dialog = rDialog;
      })(window.jQuery || window.Zepto, window);
    };
  }, {}], 4: [function (require, module, exports) {
    module.exports = function () {

      /* Zepto v1.1.6 - zepto event ajax form ie - zeptojs.com/license */

      var Zepto = (function () {
        var undefined,
            key,
            $,
            classList,
            emptyArray = [],
            _slice = emptyArray.slice,
            _filter = emptyArray.filter,
            document = window.document,
            elementDisplay = {},
            classCache = {},
            cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1, 'opacity': 1, 'z-index': 1, 'zoom': 1 },
            fragmentRE = /^\s*<(\w+|!)[^>]*>/,
            singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
            tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
            rootNodeRE = /^(?:body|html)$/i,
            capitalRE = /([A-Z])/g,

        // special attributes that should be get/set via method calls
        methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],
            adjacencyOperators = ['after', 'prepend', 'before', 'append'],
            table = document.createElement('table'),
            tableRow = document.createElement('tr'),
            containers = {
          'tr': document.createElement('tbody'),
          'tbody': table, 'thead': table, 'tfoot': table,
          'td': tableRow, 'th': tableRow,
          '*': document.createElement('div')
        },
            readyRE = /complete|loaded|interactive/,
            simpleSelectorRE = /^[\w-]*$/,
            class2type = {},
            toString = class2type.toString,
            zepto = {},
            camelize,
            uniq,
            tempParent = document.createElement('div'),
            propMap = {
          'tabindex': 'tabIndex',
          'readonly': 'readOnly',
          'for': 'htmlFor',
          'class': 'className',
          'maxlength': 'maxLength',
          'cellspacing': 'cellSpacing',
          'cellpadding': 'cellPadding',
          'rowspan': 'rowSpan',
          'colspan': 'colSpan',
          'usemap': 'useMap',
          'frameborder': 'frameBorder',
          'contenteditable': 'contentEditable'
        },
            isArray = Array.isArray || function (object) {
          return object instanceof Array;
        };

        zepto.matches = function (element, selector) {
          if (!selector || !element || element.nodeType !== 1) return false;
          var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.matchesSelector;
          if (matchesSelector) return matchesSelector.call(element, selector);
          // fall back to performing a selector:
          var match,
              parent = element.parentNode,
              temp = !parent;
          if (temp) (parent = tempParent).appendChild(element);
          match = ~zepto.qsa(parent, selector).indexOf(element);
          temp && tempParent.removeChild(element);
          return match;
        };

        function type(obj) {
          return obj == null ? String(obj) : class2type[toString.call(obj)] || "object";
        }

        function isFunction(value) {
          return type(value) == "function";
        }
        function isWindow(obj) {
          return obj != null && obj == obj.window;
        }
        function isDocument(obj) {
          return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
        }
        function isObject(obj) {
          return type(obj) == "object";
        }
        function isPlainObject(obj) {
          return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
        }
        function likeArray(obj) {
          return typeof obj.length == 'number';
        }

        function compact(array) {
          return _filter.call(array, function (item) {
            return item != null;
          });
        }
        function flatten(array) {
          return array.length > 0 ? $.fn.concat.apply([], array) : array;
        }
        camelize = function camelize(str) {
          return str.replace(/-+(.)?/g, function (match, chr) {
            return chr ? chr.toUpperCase() : '';
          });
        };
        function dasherize(str) {
          return str.replace(/::/g, '/').replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').replace(/([a-z\d])([A-Z])/g, '$1_$2').replace(/_/g, '-').toLowerCase();
        }
        uniq = function uniq(array) {
          return _filter.call(array, function (item, idx) {
            return array.indexOf(item) == idx;
          });
        };

        function classRE(name) {
          return name in classCache ? classCache[name] : classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)');
        }

        function maybeAddPx(name, value) {
          return typeof value == "number" && !cssNumber[dasherize(name)] ? value + "px" : value;
        }

        function defaultDisplay(nodeName) {
          var element, display;
          if (!elementDisplay[nodeName]) {
            element = document.createElement(nodeName);
            document.body.appendChild(element);
            display = getComputedStyle(element, '').getPropertyValue("display");
            element.parentNode.removeChild(element);
            display == "none" && (display = "block");
            elementDisplay[nodeName] = display;
          }
          return elementDisplay[nodeName];
        }

        function _children(element) {
          return 'children' in element ? _slice.call(element.children) : $.map(element.childNodes, function (node) {
            if (node.nodeType == 1) return node;
          });
        }

        // `$.zepto.fragment` takes a html string and an optional tag name
        // to generate DOM nodes nodes from the given html string.
        // The generated DOM nodes are returned as an array.
        // This function can be overriden in plugins for example to make
        // it compatible with browsers that don't support the DOM fully.
        zepto.fragment = function (html, name, properties) {
          var dom, nodes, container;

          // A special case optimization for a single tag
          if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1));

          if (!dom) {
            if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>");
            if (name === undefined) name = fragmentRE.test(html) && RegExp.$1;
            if (!(name in containers)) name = '*';

            container = containers[name];
            container.innerHTML = '' + html;
            dom = $.each(_slice.call(container.childNodes), function () {
              container.removeChild(this);
            });
          }

          if (isPlainObject(properties)) {
            nodes = $(dom);
            $.each(properties, function (key, value) {
              if (methodAttributes.indexOf(key) > -1) nodes[key](value);else nodes.attr(key, value);
            });
          }

          return dom;
        };

        // `$.zepto.Z` swaps out the prototype of the given `dom` array
        // of nodes with `$.fn` and thus supplying all the Zepto functions
        // to the array. Note that `__proto__` is not supported on Internet
        // Explorer. This method can be overriden in plugins.
        zepto.Z = function (dom, selector) {
          dom = dom || [];
          dom.__proto__ = $.fn;
          dom.selector = selector || '';
          return dom;
        };

        // `$.zepto.isZ` should return `true` if the given object is a Zepto
        // collection. This method can be overriden in plugins.
        zepto.isZ = function (object) {
          return object instanceof zepto.Z;
        };

        // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
        // takes a CSS selector and an optional context (and handles various
        // special cases).
        // This method can be overriden in plugins.
        zepto.init = function (selector, context) {
          var dom;
          // If nothing given, return an empty Zepto collection
          if (!selector) return zepto.Z();
          // Optimize for string selectors
          else if (typeof selector == 'string') {
              selector = selector.trim();
              // If it's a html fragment, create nodes from it
              // Note: In both Chrome 21 and Firefox 15, DOM error 12
              // is thrown if the fragment doesn't begin with <
              if (selector[0] == '<' && fragmentRE.test(selector)) dom = zepto.fragment(selector, RegExp.$1, context), selector = null;
              // If there's a context, create a collection on that context first, and select
              // nodes from there
              else if (context !== undefined) return $(context).find(selector);
                // If it's a CSS selector, use it to select nodes.
                else dom = zepto.qsa(document, selector);
            }
            // If a function is given, call it when the DOM is ready
            else if (isFunction(selector)) return $(document).ready(selector);
              // If a Zepto collection is given, just return it
              else if (zepto.isZ(selector)) return selector;else {
                  // normalize array if an array of nodes is given
                  if (isArray(selector)) dom = compact(selector);
                  // Wrap DOM nodes.
                  else if (isObject(selector)) dom = [selector], selector = null;
                    // If it's a html fragment, create nodes from it
                    else if (fragmentRE.test(selector)) dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null;
                      // If there's a context, create a collection on that context first, and select
                      // nodes from there
                      else if (context !== undefined) return $(context).find(selector);
                        // And last but no least, if it's a CSS selector, use it to select nodes.
                        else dom = zepto.qsa(document, selector);
                }
          // create a new Zepto collection from the nodes found
          return zepto.Z(dom, selector);
        };

        // `$` will be the base `Zepto` object. When calling this
        // function just call `$.zepto.init, which makes the implementation
        // details of selecting nodes and creating Zepto collections
        // patchable in plugins.
        $ = function $(selector, context) {
          return zepto.init(selector, context);
        };

        function extend(target, source, deep) {
          for (key in source) {
            if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
              if (isPlainObject(source[key]) && !isPlainObject(target[key])) target[key] = {};
              if (isArray(source[key]) && !isArray(target[key])) target[key] = [];
              extend(target[key], source[key], deep);
            } else if (source[key] !== undefined) target[key] = source[key];
          }
        }

        // Copy all but undefined properties from one or more
        // objects to the `target` object.
        $.extend = function (target) {
          var deep,
              args = _slice.call(arguments, 1);
          if (typeof target == 'boolean') {
            deep = target;
            target = args.shift();
          }
          args.forEach(function (arg) {
            extend(target, arg, deep);
          });
          return target;
        };

        // `$.zepto.qsa` is Zepto's CSS selector implementation which
        // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
        // This method can be overriden in plugins.
        zepto.qsa = function (element, selector) {
          var found,
              maybeID = selector[0] == '#',
              maybeClass = !maybeID && selector[0] == '.',
              nameOnly = maybeID || maybeClass ? selector.slice(1) : selector,
              // Ensure that a 1 char tag name still gets checked
          isSimple = simpleSelectorRE.test(nameOnly);
          return isDocument(element) && isSimple && maybeID ? (found = element.getElementById(nameOnly)) ? [found] : [] : element.nodeType !== 1 && element.nodeType !== 9 ? [] : _slice.call(isSimple && !maybeID ? maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
          element.getElementsByTagName(selector) : // Or a tag
          element.querySelectorAll(selector) // Or it's not simple, and we need to query all
          );
        };

        function filtered(nodes, selector) {
          return selector == null ? $(nodes) : $(nodes).filter(selector);
        }

        $.contains = document.documentElement.contains ? function (parent, node) {
          return parent !== node && parent.contains(node);
        } : function (parent, node) {
          while (node && (node = node.parentNode)) {
            if (node === parent) return true;
          }return false;
        };

        function funcArg(context, arg, idx, payload) {
          return isFunction(arg) ? arg.call(context, idx, payload) : arg;
        }

        function setAttribute(node, name, value) {
          value == null ? node.removeAttribute(name) : node.setAttribute(name, value);
        }

        // access className property while respecting SVGAnimatedString
        function className(node, value) {
          var klass = node.className || '',
              svg = klass && klass.baseVal !== undefined;

          if (value === undefined) return svg ? klass.baseVal : klass;
          svg ? klass.baseVal = value : node.className = value;
        }

        // "true"  => true
        // "false" => false
        // "null"  => null
        // "42"    => 42
        // "42.5"  => 42.5
        // "08"    => "08"
        // JSON    => parse if valid
        // String  => self
        function deserializeValue(value) {
          try {
            return value ? value == "true" || (value == "false" ? false : value == "null" ? null : +value + "" == value ? +value : /^[\[\{]/.test(value) ? $.parseJSON(value) : value) : value;
          } catch (e) {
            return value;
          }
        }

        $.type = type;
        $.isFunction = isFunction;
        $.isWindow = isWindow;
        $.isArray = isArray;
        $.isPlainObject = isPlainObject;

        $.isEmptyObject = function (obj) {
          var name;
          for (name in obj) {
            return false;
          }return true;
        };

        $.inArray = function (elem, array, i) {
          return emptyArray.indexOf.call(array, elem, i);
        };

        $.camelCase = camelize;
        $.trim = function (str) {
          return str == null ? "" : String.prototype.trim.call(str);
        };

        // plugin compatibility
        $.uuid = 0;
        $.support = {};
        $.expr = {};

        $.map = function (elements, callback) {
          var value,
              values = [],
              i,
              key;
          if (likeArray(elements)) for (i = 0; i < elements.length; i++) {
            value = callback(elements[i], i);
            if (value != null) values.push(value);
          } else for (key in elements) {
            value = callback(elements[key], key);
            if (value != null) values.push(value);
          }
          return flatten(values);
        };

        $.each = function (elements, callback) {
          var i, key;
          if (likeArray(elements)) {
            for (i = 0; i < elements.length; i++) {
              if (callback.call(elements[i], i, elements[i]) === false) return elements;
            }
          } else {
            for (key in elements) {
              if (callback.call(elements[key], key, elements[key]) === false) return elements;
            }
          }

          return elements;
        };

        $.grep = function (elements, callback) {
          return _filter.call(elements, callback);
        };

        if (window.JSON) $.parseJSON = JSON.parse;

        // Populate the class2type map
        $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (i, name) {
          class2type["[object " + name + "]"] = name.toLowerCase();
        });

        // Define methods that will be available on all
        // Zepto collections
        $.fn = {
          // Because a collection acts like an array
          // copy over these useful array functions.
          forEach: emptyArray.forEach,
          reduce: emptyArray.reduce,
          push: emptyArray.push,
          sort: emptyArray.sort,
          indexOf: emptyArray.indexOf,
          concat: emptyArray.concat,

          // `map` and `slice` in the jQuery API work differently
          // from their array counterparts
          map: function map(fn) {
            return $($.map(this, function (el, i) {
              return fn.call(el, i, el);
            }));
          },
          slice: function slice() {
            return $(_slice.apply(this, arguments));
          },

          ready: function ready(callback) {
            // need to check if document.body exists for IE as that browser reports
            // document ready when it hasn't yet created the body element
            if (readyRE.test(document.readyState) && document.body) callback($);else document.addEventListener('DOMContentLoaded', function () {
              callback($);
            }, false);
            return this;
          },
          get: function get(idx) {
            return idx === undefined ? _slice.call(this) : this[idx >= 0 ? idx : idx + this.length];
          },
          toArray: function toArray() {
            return this.get();
          },
          size: function size() {
            return this.length;
          },
          remove: function remove() {
            return this.each(function () {
              if (this.parentNode != null) this.parentNode.removeChild(this);
            });
          },
          each: function each(callback) {
            emptyArray.every.call(this, function (el, idx) {
              return callback.call(el, idx, el) !== false;
            });
            return this;
          },
          filter: function filter(selector) {
            if (isFunction(selector)) return this.not(this.not(selector));
            return $(_filter.call(this, function (element) {
              return zepto.matches(element, selector);
            }));
          },
          add: function add(selector, context) {
            return $(uniq(this.concat($(selector, context))));
          },
          is: function is(selector) {
            return this.length > 0 && zepto.matches(this[0], selector);
          },
          not: function not(selector) {
            var nodes = [];
            if (isFunction(selector) && selector.call !== undefined) this.each(function (idx) {
              if (!selector.call(this, idx)) nodes.push(this);
            });else {
              var excludes = typeof selector == 'string' ? this.filter(selector) : likeArray(selector) && isFunction(selector.item) ? _slice.call(selector) : $(selector);
              this.forEach(function (el) {
                if (excludes.indexOf(el) < 0) nodes.push(el);
              });
            }
            return $(nodes);
          },
          has: function has(selector) {
            return this.filter(function () {
              return isObject(selector) ? $.contains(this, selector) : $(this).find(selector).size();
            });
          },
          eq: function eq(idx) {
            return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1);
          },
          first: function first() {
            var el = this[0];
            return el && !isObject(el) ? el : $(el);
          },
          last: function last() {
            var el = this[this.length - 1];
            return el && !isObject(el) ? el : $(el);
          },
          find: function find(selector) {
            var result,
                $this = this;
            if (!selector) result = $();else if ((typeof selector === "undefined" ? "undefined" : _typeof(selector)) == 'object') result = $(selector).filter(function () {
              var node = this;
              return emptyArray.some.call($this, function (parent) {
                return $.contains(parent, node);
              });
            });else if (this.length == 1) result = $(zepto.qsa(this[0], selector));else result = this.map(function () {
              return zepto.qsa(this, selector);
            });
            return result;
          },
          closest: function closest(selector, context) {
            var node = this[0],
                collection = false;
            if ((typeof selector === "undefined" ? "undefined" : _typeof(selector)) == 'object') collection = $(selector);
            while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector))) {
              node = node !== context && !isDocument(node) && node.parentNode;
            }return $(node);
          },
          parents: function parents(selector) {
            var ancestors = [],
                nodes = this;
            while (nodes.length > 0) {
              nodes = $.map(nodes, function (node) {
                if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
                  ancestors.push(node);
                  return node;
                }
              });
            }return filtered(ancestors, selector);
          },
          parent: function parent(selector) {
            return filtered(uniq(this.pluck('parentNode')), selector);
          },
          children: function children(selector) {
            return filtered(this.map(function () {
              return _children(this);
            }), selector);
          },
          contents: function contents() {
            return this.map(function () {
              return _slice.call(this.childNodes);
            });
          },
          siblings: function siblings(selector) {
            return filtered(this.map(function (i, el) {
              return _filter.call(_children(el.parentNode), function (child) {
                return child !== el;
              });
            }), selector);
          },
          empty: function empty() {
            return this.each(function () {
              this.innerHTML = '';
            });
          },
          // `pluck` is borrowed from Prototype.js
          pluck: function pluck(property) {
            return $.map(this, function (el) {
              return el[property];
            });
          },
          show: function show() {
            return this.each(function () {
              this.style.display == "none" && (this.style.display = '');
              if (getComputedStyle(this, '').getPropertyValue("display") == "none") this.style.display = defaultDisplay(this.nodeName);
            });
          },
          replaceWith: function replaceWith(newContent) {
            return this.before(newContent).remove();
          },
          wrap: function wrap(structure) {
            var func = isFunction(structure);
            if (this[0] && !func) var dom = $(structure).get(0),
                clone = dom.parentNode || this.length > 1;

            return this.each(function (index) {
              $(this).wrapAll(func ? structure.call(this, index) : clone ? dom.cloneNode(true) : dom);
            });
          },
          wrapAll: function wrapAll(structure) {
            if (this[0]) {
              $(this[0]).before(structure = $(structure));
              var children;
              // drill down to the inmost element
              while ((children = structure.children()).length) {
                structure = children.first();
              }$(structure).append(this);
            }
            return this;
          },
          wrapInner: function wrapInner(structure) {
            var func = isFunction(structure);
            return this.each(function (index) {
              var self = $(this),
                  contents = self.contents(),
                  dom = func ? structure.call(this, index) : structure;
              contents.length ? contents.wrapAll(dom) : self.append(dom);
            });
          },
          unwrap: function unwrap() {
            this.parent().each(function () {
              $(this).replaceWith($(this).children());
            });
            return this;
          },
          clone: function clone() {
            return this.map(function () {
              return this.cloneNode(true);
            });
          },
          hide: function hide() {
            return this.css("display", "none");
          },
          toggle: function toggle(setting) {
            return this.each(function () {
              var el = $(this);(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide();
            });
          },
          prev: function prev(selector) {
            return $(this.pluck('previousElementSibling')).filter(selector || '*');
          },
          next: function next(selector) {
            return $(this.pluck('nextElementSibling')).filter(selector || '*');
          },
          html: function html(_html) {
            return 0 in arguments ? this.each(function (idx) {
              var originHtml = this.innerHTML;
              $(this).empty().append(funcArg(this, _html, idx, originHtml));
            }) : 0 in this ? this[0].innerHTML : null;
          },
          text: function text(_text) {
            return 0 in arguments ? this.each(function (idx) {
              var newText = funcArg(this, _text, idx, this.textContent);
              this.textContent = newText == null ? '' : '' + newText;
            }) : 0 in this ? this[0].textContent : null;
          },
          attr: function attr(name, value) {
            var result;
            return typeof name == 'string' && !(1 in arguments) ? !this.length || this[0].nodeType !== 1 ? undefined : !(result = this[0].getAttribute(name)) && name in this[0] ? this[0][name] : result : this.each(function (idx) {
              if (this.nodeType !== 1) return;
              if (isObject(name)) for (key in name) {
                setAttribute(this, key, name[key]);
              } else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)));
            });
          },
          removeAttr: function removeAttr(name) {
            return this.each(function () {
              this.nodeType === 1 && name.split(' ').forEach(function (attribute) {
                setAttribute(this, attribute);
              }, this);
            });
          },
          prop: function prop(name, value) {
            name = propMap[name] || name;
            return 1 in arguments ? this.each(function (idx) {
              this[name] = funcArg(this, value, idx, this[name]);
            }) : this[0] && this[0][name];
          },
          data: function data(name, value) {
            var attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase();

            var data = 1 in arguments ? this.attr(attrName, value) : this.attr(attrName);

            return data !== null ? deserializeValue(data) : undefined;
          },
          val: function val(value) {
            return 0 in arguments ? this.each(function (idx) {
              this.value = funcArg(this, value, idx, this.value);
            }) : this[0] && (this[0].multiple ? $(this[0]).find('option').filter(function () {
              return this.selected;
            }).pluck('value') : this[0].value);
          },
          offset: function offset(coordinates) {
            if (coordinates) return this.each(function (index) {
              var $this = $(this),
                  coords = funcArg(this, coordinates, index, $this.offset()),
                  parentOffset = $this.offsetParent().offset(),
                  props = {
                top: coords.top - parentOffset.top,
                left: coords.left - parentOffset.left
              };

              if ($this.css('position') == 'static') props['position'] = 'relative';
              $this.css(props);
            });
            if (!this.length) return null;
            var obj = this[0].getBoundingClientRect();
            return {
              left: obj.left + window.pageXOffset,
              top: obj.top + window.pageYOffset,
              width: Math.round(obj.width),
              height: Math.round(obj.height)
            };
          },
          css: function css(property, value) {
            if (arguments.length < 2) {
              var computedStyle,
                  element = this[0];
              if (!element) return;
              computedStyle = getComputedStyle(element, '');
              if (typeof property == 'string') return element.style[camelize(property)] || computedStyle.getPropertyValue(property);else if (isArray(property)) {
                var props = {};
                $.each(property, function (_, prop) {
                  props[prop] = element.style[camelize(prop)] || computedStyle.getPropertyValue(prop);
                });
                return props;
              }
            }

            var css = '';
            if (type(property) == 'string') {
              if (!value && value !== 0) this.each(function () {
                this.style.removeProperty(dasherize(property));
              });else css = dasherize(property) + ":" + maybeAddPx(property, value);
            } else {
              for (key in property) {
                if (!property[key] && property[key] !== 0) this.each(function () {
                  this.style.removeProperty(dasherize(key));
                });else css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';';
              }
            }

            return this.each(function () {
              this.style.cssText += ';' + css;
            });
          },
          index: function index(element) {
            return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0]);
          },
          hasClass: function hasClass(name) {
            if (!name) return false;
            return emptyArray.some.call(this, function (el) {
              return this.test(className(el));
            }, classRE(name));
          },
          addClass: function addClass(name) {
            if (!name) return this;
            return this.each(function (idx) {
              if (!('className' in this)) return;
              classList = [];
              var cls = className(this),
                  newName = funcArg(this, name, idx, cls);
              newName.split(/\s+/g).forEach(function (klass) {
                if (!$(this).hasClass(klass)) classList.push(klass);
              }, this);
              classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "));
            });
          },
          removeClass: function removeClass(name) {
            return this.each(function (idx) {
              if (!('className' in this)) return;
              if (name === undefined) return className(this, '');
              classList = className(this);
              funcArg(this, name, idx, classList).split(/\s+/g).forEach(function (klass) {
                classList = classList.replace(classRE(klass), " ");
              });
              className(this, classList.trim());
            });
          },
          toggleClass: function toggleClass(name, when) {
            if (!name) return this;
            return this.each(function (idx) {
              var $this = $(this),
                  names = funcArg(this, name, idx, className(this));
              names.split(/\s+/g).forEach(function (klass) {
                (when === undefined ? !$this.hasClass(klass) : when) ? $this.addClass(klass) : $this.removeClass(klass);
              });
            });
          },
          scrollTop: function scrollTop(value) {
            if (!this.length) return;
            var hasScrollTop = 'scrollTop' in this[0];
            if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset;
            return this.each(hasScrollTop ? function () {
              this.scrollTop = value;
            } : function () {
              this.scrollTo(this.scrollX, value);
            });
          },
          scrollLeft: function scrollLeft(value) {
            if (!this.length) return;
            var hasScrollLeft = 'scrollLeft' in this[0];
            if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset;
            return this.each(hasScrollLeft ? function () {
              this.scrollLeft = value;
            } : function () {
              this.scrollTo(value, this.scrollY);
            });
          },
          position: function position() {
            if (!this.length) return;

            var elem = this[0],

            // Get *real* offsetParent
            offsetParent = this.offsetParent(),

            // Get correct offsets
            offset = this.offset(),
                parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

            // Subtract element margins
            // note: when an element has margin: auto the offsetLeft and marginLeft
            // are the same in Safari causing offset.left to incorrectly be 0
            offset.top -= parseFloat($(elem).css('margin-top')) || 0;
            offset.left -= parseFloat($(elem).css('margin-left')) || 0;

            // Add offsetParent borders
            parentOffset.top += parseFloat($(offsetParent[0]).css('border-top-width')) || 0;
            parentOffset.left += parseFloat($(offsetParent[0]).css('border-left-width')) || 0;

            // Subtract the two offsets
            return {
              top: offset.top - parentOffset.top,
              left: offset.left - parentOffset.left
            };
          },
          offsetParent: function offsetParent() {
            return this.map(function () {
              var parent = this.offsetParent || document.body;
              while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static") {
                parent = parent.offsetParent;
              }return parent;
            });
          }
        };

        // for now
        $.fn.detach = $.fn.remove

        // Generate the `width` and `height` functions
        ;['width', 'height'].forEach(function (dimension) {
          var dimensionProperty = dimension.replace(/./, function (m) {
            return m[0].toUpperCase();
          });

          $.fn[dimension] = function (value) {
            var offset,
                el = this[0];
            if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] : isDocument(el) ? el.documentElement['scroll' + dimensionProperty] : (offset = this.offset()) && offset[dimension];else return this.each(function (idx) {
              el = $(this);
              el.css(dimension, funcArg(this, value, idx, el[dimension]()));
            });
          };
        });

        function traverseNode(node, fun) {
          fun(node);
          for (var i = 0, len = node.childNodes.length; i < len; i++) {
            traverseNode(node.childNodes[i], fun);
          }
        }

        // Generate the `after`, `prepend`, `before`, `append`,
        // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
        adjacencyOperators.forEach(function (operator, operatorIndex) {
          var inside = operatorIndex % 2; //=> prepend, append

          $.fn[operator] = function () {
            // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
            var argType,
                nodes = $.map(arguments, function (arg) {
              argType = type(arg);
              return argType == "object" || argType == "array" || arg == null ? arg : zepto.fragment(arg);
            }),
                parent,
                copyByClone = this.length > 1;
            if (nodes.length < 1) return this;

            return this.each(function (_, target) {
              parent = inside ? target : target.parentNode;

              // convert all methods to a "before" operation
              target = operatorIndex == 0 ? target.nextSibling : operatorIndex == 1 ? target.firstChild : operatorIndex == 2 ? target : null;

              var parentInDocument = $.contains(document.documentElement, parent);

              nodes.forEach(function (node) {
                if (copyByClone) node = node.cloneNode(true);else if (!parent) return $(node).remove();

                parent.insertBefore(node, target);
                if (parentInDocument) traverseNode(node, function (el) {
                  if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' && (!el.type || el.type === 'text/javascript') && !el.src) window['eval'].call(window, el.innerHTML);
                });
              });
            });
          };

          // after    => insertAfter
          // prepend  => prependTo
          // before   => insertBefore
          // append   => appendTo
          $.fn[inside ? operator + 'To' : 'insert' + (operatorIndex ? 'Before' : 'After')] = function (html) {
            $(html)[operator](this);
            return this;
          };
        });

        zepto.Z.prototype = $.fn;

        // Export internal API functions in the `$.zepto` namespace
        zepto.uniq = uniq;
        zepto.deserializeValue = deserializeValue;
        $.zepto = zepto;

        return $;
      })();

      window.Zepto = Zepto;
      window.$ === undefined && (window.$ = Zepto);(function ($) {
        var _zid = 1,
            undefined,
            slice = Array.prototype.slice,
            isFunction = $.isFunction,
            isString = function isString(obj) {
          return typeof obj == 'string';
        },
            handlers = {},
            specialEvents = {},
            focusinSupported = 'onfocusin' in window,
            focus = { focus: 'focusin', blur: 'focusout' },
            hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' };

        specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents';

        function zid(element) {
          return element._zid || (element._zid = _zid++);
        }
        function findHandlers(element, event, fn, selector) {
          event = parse(event);
          if (event.ns) var matcher = matcherFor(event.ns);
          return (handlers[zid(element)] || []).filter(function (handler) {
            return handler && (!event.e || handler.e == event.e) && (!event.ns || matcher.test(handler.ns)) && (!fn || zid(handler.fn) === zid(fn)) && (!selector || handler.sel == selector);
          });
        }
        function parse(event) {
          var parts = ('' + event).split('.');
          return { e: parts[0], ns: parts.slice(1).sort().join(' ') };
        }
        function matcherFor(ns) {
          return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)');
        }

        function eventCapture(handler, captureSetting) {
          return handler.del && !focusinSupported && handler.e in focus || !!captureSetting;
        }

        function realEvent(type) {
          return hover[type] || focusinSupported && focus[type] || type;
        }

        function add(element, events, fn, data, selector, delegator, capture) {
          var id = zid(element),
              set = handlers[id] || (handlers[id] = []);
          events.split(/\s/).forEach(function (event) {
            if (event == 'ready') return $(document).ready(fn);
            var handler = parse(event);
            handler.fn = fn;
            handler.sel = selector;
            // emulate mouseenter, mouseleave
            if (handler.e in hover) fn = function fn(e) {
              var related = e.relatedTarget;
              if (!related || related !== this && !$.contains(this, related)) return handler.fn.apply(this, arguments);
            };
            handler.del = delegator;
            var callback = delegator || fn;
            handler.proxy = function (e) {
              e = compatible(e);
              if (e.isImmediatePropagationStopped()) return;
              e.data = data;
              var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args));
              if (result === false) e.preventDefault(), e.stopPropagation();
              return result;
            };
            handler.i = set.length;
            set.push(handler);
            if ('addEventListener' in element) element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
          });
        }
        function remove(element, events, fn, selector, capture) {
          var id = zid(element);(events || '').split(/\s/).forEach(function (event) {
            findHandlers(element, event, fn, selector).forEach(function (handler) {
              delete handlers[id][handler.i];
              if ('removeEventListener' in element) element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
            });
          });
        }

        $.event = { add: add, remove: remove };

        $.proxy = function (fn, context) {
          var args = 2 in arguments && slice.call(arguments, 2);
          if (isFunction(fn)) {
            var proxyFn = function proxyFn() {
              return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments);
            };
            proxyFn._zid = zid(fn);
            return proxyFn;
          } else if (isString(context)) {
            if (args) {
              args.unshift(fn[context], fn);
              return $.proxy.apply(null, args);
            } else {
              return $.proxy(fn[context], fn);
            }
          } else {
            throw new TypeError("expected function");
          }
        };

        $.fn.bind = function (event, data, callback) {
          return this.on(event, data, callback);
        };
        $.fn.unbind = function (event, callback) {
          return this.off(event, callback);
        };
        $.fn.one = function (event, selector, data, callback) {
          return this.on(event, selector, data, callback, 1);
        };

        var returnTrue = function returnTrue() {
          return true;
        },
            returnFalse = function returnFalse() {
          return false;
        },
            ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,
            eventMethods = {
          preventDefault: 'isDefaultPrevented',
          stopImmediatePropagation: 'isImmediatePropagationStopped',
          stopPropagation: 'isPropagationStopped'
        };

        function compatible(event, source) {
          if (source || !event.isDefaultPrevented) {
            source || (source = event);

            $.each(eventMethods, function (name, predicate) {
              var sourceMethod = source[name];
              event[name] = function () {
                this[predicate] = returnTrue;
                return sourceMethod && sourceMethod.apply(source, arguments);
              };
              event[predicate] = returnFalse;
            });

            if (source.defaultPrevented !== undefined ? source.defaultPrevented : 'returnValue' in source ? source.returnValue === false : source.getPreventDefault && source.getPreventDefault()) event.isDefaultPrevented = returnTrue;
          }
          return event;
        }

        function createProxy(event) {
          var key,
              proxy = { originalEvent: event };
          for (key in event) {
            if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key];
          }return compatible(proxy, event);
        }

        $.fn.delegate = function (selector, event, callback) {
          return this.on(event, selector, callback);
        };
        $.fn.undelegate = function (selector, event, callback) {
          return this.off(event, selector, callback);
        };

        $.fn.live = function (event, callback) {
          $(document.body).delegate(this.selector, event, callback);
          return this;
        };
        $.fn.die = function (event, callback) {
          $(document.body).undelegate(this.selector, event, callback);
          return this;
        };

        $.fn.on = function (event, selector, data, callback, one) {
          var autoRemove,
              delegator,
              $this = this;
          if (event && !isString(event)) {
            $.each(event, function (type, fn) {
              $this.on(type, selector, data, fn, one);
            });
            return $this;
          }

          if (!isString(selector) && !isFunction(callback) && callback !== false) callback = data, data = selector, selector = undefined;
          if (isFunction(data) || data === false) callback = data, data = undefined;

          if (callback === false) callback = returnFalse;

          return $this.each(function (_, element) {
            if (one) autoRemove = function autoRemove(e) {
              remove(element, e.type, callback);
              return callback.apply(this, arguments);
            };

            if (selector) delegator = function delegator(e) {
              var evt,
                  match = $(e.target).closest(selector, element).get(0);
              if (match && match !== element) {
                evt = $.extend(createProxy(e), { currentTarget: match, liveFired: element });
                return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)));
              }
            };

            add(element, event, callback, data, selector, delegator || autoRemove);
          });
        };
        $.fn.off = function (event, selector, callback) {
          var $this = this;
          if (event && !isString(event)) {
            $.each(event, function (type, fn) {
              $this.off(type, selector, fn);
            });
            return $this;
          }

          if (!isString(selector) && !isFunction(callback) && callback !== false) callback = selector, selector = undefined;

          if (callback === false) callback = returnFalse;

          return $this.each(function () {
            remove(this, event, callback, selector);
          });
        };

        $.fn.trigger = function (event, args) {
          event = isString(event) || $.isPlainObject(event) ? $.Event(event) : compatible(event);
          event._args = args;
          return this.each(function () {
            // handle focus(), blur() by calling them directly
            if (event.type in focus && typeof this[event.type] == "function") this[event.type]();
            // items in the collection might not be DOM elements
            else if ('dispatchEvent' in this) this.dispatchEvent(event);else $(this).triggerHandler(event, args);
          });
        };

        // triggers event handlers on current element just as if an event occurred,
        // doesn't trigger an actual event, doesn't bubble
        $.fn.triggerHandler = function (event, args) {
          var e, result;
          this.each(function (i, element) {
            e = createProxy(isString(event) ? $.Event(event) : event);
            e._args = args;
            e.target = element;
            $.each(findHandlers(element, event.type || event), function (i, handler) {
              result = handler.proxy(e);
              if (e.isImmediatePropagationStopped()) return false;
            });
          });
          return result;
        }

        // shortcut methods for `.bind(event, fn)` for each event type
        ;('focusin focusout focus blur load resize scroll unload click dblclick ' + 'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' + 'change select keydown keypress keyup error').split(' ').forEach(function (event) {
          $.fn[event] = function (callback) {
            return 0 in arguments ? this.bind(event, callback) : this.trigger(event);
          };
        });

        $.Event = function (type, props) {
          if (!isString(type)) props = type, type = props.type;
          var event = document.createEvent(specialEvents[type] || 'Events'),
              bubbles = true;
          if (props) for (var name in props) {
            name == 'bubbles' ? bubbles = !!props[name] : event[name] = props[name];
          }event.initEvent(type, bubbles, true);
          return compatible(event);
        };
      })(Zepto);(function ($) {
        var jsonpID = 0,
            document = window.document,
            key,
            name,
            rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            scriptTypeRE = /^(?:text|application)\/javascript/i,
            xmlTypeRE = /^(?:text|application)\/xml/i,
            jsonType = 'application/json',
            htmlType = 'text/html',
            blankRE = /^\s*$/,
            originAnchor = document.createElement('a');

        originAnchor.href = window.location.href;

        // trigger a custom event and return false if it was cancelled
        function triggerAndReturn(context, eventName, data) {
          var event = $.Event(eventName);
          $(context).trigger(event, data);
          return !event.isDefaultPrevented();
        }

        // trigger an Ajax "global" event
        function triggerGlobal(settings, context, eventName, data) {
          if (settings.global) return triggerAndReturn(context || document, eventName, data);
        }

        // Number of active Ajax requests
        $.active = 0;

        function ajaxStart(settings) {
          if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart');
        }
        function ajaxStop(settings) {
          if (settings.global && ! --$.active) triggerGlobal(settings, null, 'ajaxStop');
        }

        // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
        function ajaxBeforeSend(xhr, settings) {
          var context = settings.context;
          if (settings.beforeSend.call(context, xhr, settings) === false || triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false) return false;

          triggerGlobal(settings, context, 'ajaxSend', [xhr, settings]);
        }
        function ajaxSuccess(data, xhr, settings, deferred) {
          var context = settings.context,
              status = 'success';
          settings.success.call(context, data, status, xhr);
          if (deferred) deferred.resolveWith(context, [data, status, xhr]);
          triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data]);
          ajaxComplete(status, xhr, settings);
        }
        // type: "timeout", "error", "abort", "parsererror"
        function ajaxError(error, type, xhr, settings, deferred) {
          var context = settings.context;
          settings.error.call(context, xhr, type, error);
          if (deferred) deferred.rejectWith(context, [xhr, type, error]);
          triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type]);
          ajaxComplete(type, xhr, settings);
        }
        // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
        function ajaxComplete(status, xhr, settings) {
          var context = settings.context;
          settings.complete.call(context, xhr, status);
          triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings]);
          ajaxStop(settings);
        }

        // Empty function, used as default callback
        function empty() {}

        $.ajaxJSONP = function (options, deferred) {
          if (!('type' in options)) return $.ajax(options);

          var _callbackName = options.jsonpCallback,
              callbackName = ($.isFunction(_callbackName) ? _callbackName() : _callbackName) || 'jsonp' + ++jsonpID,
              script = document.createElement('script'),
              originalCallback = window[callbackName],
              responseData,
              abort = function abort(errorType) {
            $(script).triggerHandler('error', errorType || 'abort');
          },
              xhr = { abort: abort },
              abortTimeout;

          if (deferred) deferred.promise(xhr);

          $(script).on('load error', function (e, errorType) {
            clearTimeout(abortTimeout);
            $(script).off().remove();

            if (e.type == 'error' || !responseData) {
              ajaxError(null, errorType || 'error', xhr, options, deferred);
            } else {
              ajaxSuccess(responseData[0], xhr, options, deferred);
            }

            window[callbackName] = originalCallback;
            if (responseData && $.isFunction(originalCallback)) originalCallback(responseData[0]);

            originalCallback = responseData = undefined;
          });

          if (ajaxBeforeSend(xhr, options) === false) {
            abort('abort');
            return xhr;
          }

          window[callbackName] = function () {
            responseData = arguments;
          };

          script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName);
          document.head.appendChild(script);

          if (options.timeout > 0) abortTimeout = setTimeout(function () {
            abort('timeout');
          }, options.timeout);

          return xhr;
        };

        $.ajaxSettings = {
          // Default type of request
          type: 'GET',
          // Callback that is executed before request
          beforeSend: empty,
          // Callback that is executed if the request succeeds
          success: empty,
          // Callback that is executed the the server drops error
          error: empty,
          // Callback that is executed on request complete (both: error and success)
          complete: empty,
          // The context for the callbacks
          context: null,
          // Whether to trigger "global" Ajax events
          global: true,
          // Transport
          xhr: function xhr() {
            return new window.XMLHttpRequest();
          },
          // MIME types mapping
          // IIS returns Javascript as "application/x-javascript"
          accepts: {
            script: 'text/javascript, application/javascript, application/x-javascript',
            json: jsonType,
            xml: 'application/xml, text/xml',
            html: htmlType,
            text: 'text/plain'
          },
          // Whether the request is to another domain
          crossDomain: false,
          // Default timeout
          timeout: 0,
          // Whether data should be serialized to string
          processData: true,
          // Whether the browser should be allowed to cache GET responses
          cache: true
        };

        function mimeToDataType(mime) {
          if (mime) mime = mime.split(';', 2)[0];
          return mime && (mime == htmlType ? 'html' : mime == jsonType ? 'json' : scriptTypeRE.test(mime) ? 'script' : xmlTypeRE.test(mime) && 'xml') || 'text';
        }

        function appendQuery(url, query) {
          if (query == '') return url;
          return (url + '&' + query).replace(/[&?]{1,2}/, '?');
        }

        // serialize payload and append it to the URL for GET requests
        function serializeData(options) {
          if (options.processData && options.data && $.type(options.data) != "string") options.data = $.param(options.data, options.traditional);
          if (options.data && (!options.type || options.type.toUpperCase() == 'GET')) options.url = appendQuery(options.url, options.data), options.data = undefined;
        }

        $.ajax = function (options) {
          var settings = $.extend({}, options || {}),
              deferred = $.Deferred && $.Deferred(),
              urlAnchor;
          for (key in $.ajaxSettings) {
            if (settings[key] === undefined) settings[key] = $.ajaxSettings[key];
          }ajaxStart(settings);

          if (!settings.crossDomain) {
            urlAnchor = document.createElement('a');
            urlAnchor.href = settings.url;
            urlAnchor.href = urlAnchor.href;
            settings.crossDomain = originAnchor.protocol + '//' + originAnchor.host !== urlAnchor.protocol + '//' + urlAnchor.host;
          }

          if (!settings.url) settings.url = window.location.toString();
          serializeData(settings);

          var dataType = settings.dataType,
              hasPlaceholder = /\?.+=\?/.test(settings.url);
          if (hasPlaceholder) dataType = 'jsonp';

          if (settings.cache === false || (!options || options.cache !== true) && ('script' == dataType || 'jsonp' == dataType)) settings.url = appendQuery(settings.url, '_=' + Date.now());

          if ('jsonp' == dataType) {
            if (!hasPlaceholder) settings.url = appendQuery(settings.url, settings.jsonp ? settings.jsonp + '=?' : settings.jsonp === false ? '' : 'callback=?');
            return $.ajaxJSONP(settings, deferred);
          }

          var mime = settings.accepts[dataType],
              headers = {},
              setHeader = function setHeader(name, value) {
            headers[name.toLowerCase()] = [name, value];
          },
              protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
              xhr = settings.xhr(),
              nativeSetHeader = xhr.setRequestHeader,
              abortTimeout;

          if (deferred) deferred.promise(xhr);

          if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest');
          setHeader('Accept', mime || '*/*');
          if (mime = settings.mimeType || mime) {
            if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0];
            xhr.overrideMimeType && xhr.overrideMimeType(mime);
          }
          if (settings.contentType || settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET') setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded');

          if (settings.headers) for (name in settings.headers) {
            setHeader(name, settings.headers[name]);
          }xhr.setRequestHeader = setHeader;

          xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
              xhr.onreadystatechange = empty;
              clearTimeout(abortTimeout);
              var result,
                  error = false;
              if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304 || xhr.status == 0 && protocol == 'file:') {
                dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'));
                result = xhr.responseText;

                try {
                  // http://perfectionkills.com/global-eval-what-are-the-options/
                  if (dataType == 'script') (1, eval)(result);else if (dataType == 'xml') result = xhr.responseXML;else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result);
                } catch (e) {
                  error = e;
                }

                if (error) ajaxError(error, 'parsererror', xhr, settings, deferred);else ajaxSuccess(result, xhr, settings, deferred);
              } else {
                ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred);
              }
            }
          };

          if (ajaxBeforeSend(xhr, settings) === false) {
            xhr.abort();
            ajaxError(null, 'abort', xhr, settings, deferred);
            return xhr;
          }

          if (settings.xhrFields) for (name in settings.xhrFields) {
            xhr[name] = settings.xhrFields[name];
          }var async = 'async' in settings ? settings.async : true;
          xhr.open(settings.type, settings.url, async, settings.username, settings.password);

          for (name in headers) {
            nativeSetHeader.apply(xhr, headers[name]);
          }if (settings.timeout > 0) abortTimeout = setTimeout(function () {
            xhr.onreadystatechange = empty;
            xhr.abort();
            ajaxError(null, 'timeout', xhr, settings, deferred);
          }, settings.timeout);

          // avoid sending empty string (#319)
          xhr.send(settings.data ? settings.data : null);
          return xhr;
        };

        // handle optional data/success arguments
        function parseArguments(url, data, success, dataType) {
          if ($.isFunction(data)) dataType = success, success = data, data = undefined;
          if (!$.isFunction(success)) dataType = success, success = undefined;
          return {
            url: url,
            data: data,
            success: success,
            dataType: dataType
          };
        }

        $.get = function () /* url, data, success, dataType */{
          return $.ajax(parseArguments.apply(null, arguments));
        };

        $.post = function () /* url, data, success, dataType */{
          var options = parseArguments.apply(null, arguments);
          options.type = 'POST';
          return $.ajax(options);
        };

        $.getJSON = function () /* url, data, success */{
          var options = parseArguments.apply(null, arguments);
          options.dataType = 'json';
          return $.ajax(options);
        };

        $.fn.load = function (url, data, success) {
          if (!this.length) return this;
          var self = this,
              parts = url.split(/\s/),
              selector,
              options = parseArguments(url, data, success),
              callback = options.success;
          if (parts.length > 1) options.url = parts[0], selector = parts[1];
          options.success = function (response) {
            self.html(selector ? $('<div>').html(response.replace(rscript, "")).find(selector) : response);
            callback && callback.apply(self, arguments);
          };
          $.ajax(options);
          return this;
        };

        var escape = encodeURIComponent;

        function serialize(params, obj, traditional, scope) {
          var type,
              array = $.isArray(obj),
              hash = $.isPlainObject(obj);
          $.each(obj, function (key, value) {
            type = $.type(value);
            if (scope) key = traditional ? scope : scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']';
            // handle data in serializeArray() format
            if (!scope && array) params.add(value.name, value.value);
            // recurse into nested objects
            else if (type == "array" || !traditional && type == "object") serialize(params, value, traditional, key);else params.add(key, value);
          });
        }

        $.param = function (obj, traditional) {
          var params = [];
          params.add = function (key, value) {
            if ($.isFunction(value)) value = value();
            if (value == null) value = "";
            this.push(escape(key) + '=' + escape(value));
          };
          serialize(params, obj, traditional);
          return params.join('&').replace(/%20/g, '+');
        };
      })(Zepto);(function ($) {
        $.fn.serializeArray = function () {
          var name,
              type,
              result = [],
              add = function add(value) {
            if (value.forEach) return value.forEach(add);
            result.push({ name: name, value: value });
          };
          if (this[0]) $.each(this[0].elements, function (_, field) {
            type = field.type, name = field.name;
            if (name && field.nodeName.toLowerCase() != 'fieldset' && !field.disabled && type != 'submit' && type != 'reset' && type != 'button' && type != 'file' && (type != 'radio' && type != 'checkbox' || field.checked)) add($(field).val());
          });
          return result;
        };

        $.fn.serialize = function () {
          var result = [];
          this.serializeArray().forEach(function (elm) {
            result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value));
          });
          return result.join('&');
        };

        $.fn.submit = function (callback) {
          if (0 in arguments) this.bind('submit', callback);else if (this.length) {
            var event = $.Event('submit');
            this.eq(0).trigger(event);
            if (!event.isDefaultPrevented()) this.get(0).submit();
          }
          return this;
        };
      })(Zepto);(function ($) {
        // __proto__ doesn't exist on IE<11, so redefine
        // the Z function to use object extension instead
        if (!('__proto__' in {})) {
          $.extend($.zepto, {
            Z: function Z(dom, selector) {
              dom = dom || [];
              $.extend(dom, $.fn);
              dom.selector = selector || '';
              dom.__Z = true;
              return dom;
            },
            // this is a kludge but works
            isZ: function isZ(object) {
              return $.type(object) === 'array' && '__Z' in object;
            }
          });
        }

        // getComputedStyle shouldn't freak out when called
        // without a valid element as argument
        try {
          getComputedStyle(undefined);
        } catch (e) {
          var nativeGetComputedStyle = getComputedStyle;
          window.getComputedStyle = function (element) {
            try {
              return nativeGetComputedStyle(element);
            } catch (e) {
              return null;
            }
          };
        }
      })(Zepto);
    };
  }, {}] }, {}, [2]);
//# sourceMappingURL=bundle.js.map

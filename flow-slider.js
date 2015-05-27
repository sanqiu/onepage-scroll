//slider
(function($) {
    $.fn.sudySlider = function(opt) {
        var defaults = {p: 1,sWidth: 100,sHeight: 70,bWidth: 800,bHeight: 300,mRight: 15,pBottom: 20,index: 0,speed: 400,pause: 4000,visible: 4,auto: true,dir: "left",href: true};
        var o = $.extend(defaults, opt);
        return this.each(function() {
            var s = $(this), a = imgs;
            vWidth = (o.sWidth + o.mRight) * (o.visible - 1) + o.bWidth;
            s.append('<div class="sudyslider" style="width:' + vWidth + 'px;"><div class="slider-container" style="width:' + vWidth + 'px;height:' + (o.bHeight + o.pBottom) + 'px;position:relative;overflow:hidden;"></div><div class="slider-control" style="width:' + vWidth + 'px;position:relative;cursor:pointer;"><span class="slider-widget" style="display:block;position:absolute;z-index:10;"></span></div></div>');
            var b = s.find(".sudySlider"), c = s.find(".slider-container"), d = s.find(".slider-control"), n = a.length, tWidth = (o.sWidth + o.mRight) * n + o.bWidth - o.mRight;
            c.append('<ul class="slides" style="width:' + tWidth + 'px;position:absolute; top:0px; white-space:nowrap;"></ul>');
            var u = c.find(".slides");
            $.each(a, function(i, e) {
                u.append('<li class="slide slide-' + i + '" style="display:inline-block;float:left;width:' + o.sWidth + 'px;height:' + o.bHeight + 'px;margin-right:' + o.mRight + 'px;padding-bottom:' + o.pBottom + 'px;position:relative;"><a class="slide-link" title="' + e.title + '" style="display:block;width:100%;height:' + o.sHeight + 'px;position:absolute;left:0px;bottom:' + o.pBottom + 'px;cursor:pointer;" target="_blank"><img src="' + e.src + '" width="100%" height="100%" border="0"/></a></li>')
            });
            var w = d.find(".slider-widget"), wWidth = w.width(), l = u.find(".slide"), dLeft = d.offset().left, index = o.index, dir = o.dir, start, mx, mLeft;
            function showIndex(index) {
                l.eq(index).stop(true, false).animate({width: o.bWidth + "px"}, o.speed).siblings().stop(true, false).animate({width: o.sWidth + "px"}, o.speed);
                l.eq(index).find(".slide-link").stop(true, false).animate({height: o.bHeight + "px"}, o.speed, function() {
                    if (o.href == true) {
                        $(this).attr("href", a[index].url)
                    }
                });
                l.eq(index).siblings().find(".slide-link").removeAttr("href").stop(true, false).animate({height: o.sHeight + "px"}, o.speed);
                if (index < 2) {
                    u.stop(true, false).animate({left: "0px"}, o.speed, "linear")
                } else if (index > 1) {
                    u.stop(true, false).animate({left: -(index - 1) * (o.sWidth + o.mRight) + "px"}, o.speed, "linear");
                    if (n > 3 && (index == n - 1 || index == n - 2)) {
                        u.stop(true, false).animate({left: -(n - 4) * (o.sWidth + o.mRight) + "px"}, o.speed, "linear")
                    }
                }
            }
            function showBar(index) {
                w.stop(true, false).animate({left: index * (vWidth - wWidth) / (n - 1) + "px"}, o.speed, "linear")
            }
            function showPrev() {
                index--;
                if (index < 0) {
                    index = 0
                }
                showIndex(index);
                showBar(index)
            }
            function showNext() {
                index++;
                if (index > n - 1) {
                    index = n - 1
                }
                showIndex(index);
                showBar(index)
            }
            function autoStart(direction) {
                if (direction == "left") {
                    showNext()
                }
                if (direction == "right") {
                    showPrev()
                }
                if (index <= 0) {
                    dir = "left"
                }
                if (index >= n - 1) {
                    dir = "right"
                }
            }
            function runAuto() {
                if (o.auto == true) {
                    s.mouseenter(function() {
                        clearInterval(start)
                    });
                    s.mouseleave(function() {
                        start = setInterval(function() {
                            autoStart(dir)
                        }, o.pause)
                    }).trigger("mouseleave")
                }
            }
            function getWidgetPos(e) {
                var pos = w.position();
                mLeft = pos.left;
                mx = e.pageX
            }
            function moveMouse(mPx, mw, speed) {
                if (mPx > 0 && mPx < mw) {
                    var dd = (mPx * n) / mw, dx = Math.floor(dd);
                    if (dx != index) {
                        index = dx;
                        showIndex(index)
                    }
                    if (mPx > (vWidth - wWidth)) {
                        mPx = vWidth - wWidth
                    }
                    w.stop(true, false).animate({left: mPx + "px"}, speed, "linear")
                }
            }
            d.click(function(e) {
                getWidgetPos(e);
                var clickX = e.pageX - dLeft;
                moveMouse(clickX, vWidth, o.speed)
            });
            w.mousedown(function(e) {
                getWidgetPos(e);
                $(document).mousemove(function(e) {
                    s.trigger("mouseenter");
                    var moveX = e.pageX - mx + mLeft, mw = vWidth - wWidth;
                    moveMouse(moveX, mw, 0)
                }).mouseup(function() {
                    $(this).unbind("mousemove")
                })
            });
            if ($.fn.mousewheel) {
                s.mousewheel(function(event, delta, deltaX, deltaY) {
                    if (delta > 0) {
                        showPrev()
                    }
                    if (delta < 0) {
                        showNext()
                    }
                    return false
                })
            }
            $.each(l, function(i, e) {
                $(e).find(".slide-link").click(function() {
                    index = i;
                    showIndex(index);
                    showBar(index)
                })
            });
            showIndex(index);
            showBar(index);
            runAuto()
        })
    }
})(jQuery);


//mousewheel

(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory)
    } else if (typeof exports === 'object') {
        module.exports = factory
    } else {
        factory(jQuery)
    }
}(function($) {
    var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'];
    var toBind = 'onwheel' in document || document.documentMode >= 9 ? ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'];
    var lowestDelta, lowestDeltaXY;
    if ($.event.fixHooks) {
        for (var i = toFix.length; i; ) {
            $.event.fixHooks[toFix[--i]] = $.event.mouseHooks
        }
    }
    $.event.special.mousewheel = {setup: function() {
            if (this.addEventListener) {
                for (var i = toBind.length; i; ) {
                    this.addEventListener(toBind[--i], handler, false)
                }
            } else {
                this.onmousewheel = handler
            }
        },teardown: function() {
            if (this.removeEventListener) {
                for (var i = toBind.length; i; ) {
                    this.removeEventListener(toBind[--i], handler, false)
                }
            } else {
                this.onmousewheel = null
            }
        }};
    $.fn.extend({mousewheel: function(fn) {
            return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel")
        },unmousewheel: function(fn) {
            return this.unbind("mousewheel", fn)
        }});
    function handler(event) {
        var orgEvent = event || window.event, args = [].slice.call(arguments, 1), delta = 0, deltaX = 0, deltaY = 0, absDelta = 0, absDeltaXY = 0, fn;
        event = $.event.fix(orgEvent);
        event.type = "mousewheel";
        if (orgEvent.wheelDelta) {
            delta = orgEvent.wheelDelta
        }
        if (orgEvent.detail) {
            delta = orgEvent.detail * -1
        }
        if (orgEvent.deltaY) {
            deltaY = orgEvent.deltaY * -1;
            delta = deltaY
        }
        if (orgEvent.deltaX) {
            deltaX = orgEvent.deltaX;
            delta = deltaX * -1
        }
        if (orgEvent.wheelDeltaY !== undefined) {
            deltaY = orgEvent.wheelDeltaY
        }
        if (orgEvent.wheelDeltaX !== undefined) {
            deltaX = orgEvent.wheelDeltaX * -1
        }
        absDelta = Math.abs(delta);
        if (!lowestDelta || absDelta < lowestDelta) {
            lowestDelta = absDelta
        }
        absDeltaXY = Math.max(Math.abs(deltaY), Math.abs(deltaX));
        if (!lowestDeltaXY || absDeltaXY < lowestDeltaXY) {
            lowestDeltaXY = absDeltaXY
        }
        fn = delta > 0 ? 'floor' : 'ceil';
        delta = Math[fn](delta / lowestDelta);
        deltaX = Math[fn](deltaX / lowestDeltaXY);
        deltaY = Math[fn](deltaY / lowestDeltaXY);
        args.unshift(event, delta, deltaX, deltaY);
        return ($.event.dispatch || $.event.handle).apply(this, args)
    }
}));

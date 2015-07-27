/*jslint browser: true, devel: true, nomen: true*/
/*global Danimate*/

var d,
    o;

(function () {
    "use strict";
    /// $('document').ready alternative
    function document_ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }
    /// Init game
    function init() {
        d = new Danimate('main');
        
        o = new Danimate();
        o.rotation(95);
        o.width(100);
        o.height(100);
        o.alpha(20);
        o.drawRect(0, 0, 100, 100, '#F69');
        o.x(255);
        o.y(100);
        d.addChild(o);
        
        var e = new Danimate();
        e.rotation(95);
        e.width(100);
        e.height(100);
        e.alpha(20);
        e.drawRect(0, 0, 100, 100, '#F00');
        e.x(255);
        e.y(100);
        d.addChild(e);
        
        d.play();
//        o.play();
        setInterval(function() {
            o.rotation(o.rotation()+1);
        }, 1);
    }
    /// Trig
    document_ready(init);
}());
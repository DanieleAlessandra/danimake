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
        d.width(1000);
        d.height(1000);
        
        o = new Danimate();
        o.width(100);
        o.height(100);
        o.alpha(50);
        o.drawRect(0, 0, 100, 100, '#F69');
        o.x(255);
        o.y(100);
        d.addChild(o);
        
        var e = new Danimate();
        e.rotation(45);
        e.width(100);
        e.height(100);
        e.alpha(20);
        e.drawRect(0, 0, 100, 100, '#F00');
        e.x(255);
        e.y(100);
        d.addChild(e);
        
        var s = new Danimate();
        s.rotation(27);
//        s.width(27);
//        s.height(150);
        s.alpha(100);
        s.x(450);
        s.y(150);
        s.drawRect(0, 0, 27, 150, '#900');
        d.addChild(s);
        
        d.play();
//        o.play();
        setInterval(function () {
            o.rotation(o.rotation() + 0.1);
            o.scale(Math.abs(Math.sin(o.utils.deg2rad(o.rotation()))));
            s.rotation(s.rotation() + 0.0001);
        }, 1);
    }
    /// Trig
    document_ready(init);
}());
/*jslint browser: true*/
/*global Danimate*/

var d;

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
//        d.width(250);
        d.drawRect(null, null, null, null, '#B85');
        
        var o = new Danimate();
        o.drawRect(0, 0, 100, 1, '#990000');
        d.addChild(o);
        d.play();
    }
    /// Trig
    document_ready(init);
}());
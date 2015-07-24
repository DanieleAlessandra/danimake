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
        
        var o = new Danimate();
        d.addChild(o);
        d.play();
        o.play();
    }
    /// Trig
    document_ready(init);
}());
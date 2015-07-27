/*jslint browser: true, devel: true, nomen: true*/
/*global Danimate,Danimage*/

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
        d.width(854);
        d.height(544);
        d.enableMouse();
        
        /// Imposta un background
        var bg,
            btn_h,
            btn_d,
            btn_g;
        
        bg = new Danimage('img/cover/bg.jpg');
        /// Aggiunge un pulsante HELP
        btn_h = new Danimage('img/cover/btn_help.png');
        btn_h.enableMouse();
        btn_h.x(32);
        btn_h.y(470);
        /// Aggiunge un pulsante DIARIO
        btn_d = new Danimage('img/cover/btn_diario.png');
        btn_d.enableMouse();
        btn_d.x(260);
        btn_d.y(470);
        /// Aggiunge un pulsante HELP
        btn_g = new Danimage('img/cover/btn_gioca.png');
        btn_g.enableMouse();
        btn_g.x(640);
        btn_g.y(470);
        
        d.addChild(bg);
        d.addChild(btn_h);
        d.addChild(btn_d);
        d.addChild(btn_g);
        d.play();
        
        setInterval(function () {
            bg.rotation(bg.rotation() + 0.0001);
        }, 10);
        
    }
    /// Trig
    document_ready(init);
}());
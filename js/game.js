/*jslint browser: true, devel: true, nomen: true*/
/*global Danimate,Danimage,Danimake*/

var d;

(function () {
    "use strict";
    /// $('document').ready alternative
    /// Init game
    function init() {
        d = new Danimate('main');
        d.canvas('main');
        d.width(854);
        d.height(544);
        d.enableMouse();
        
        /// Imposta un background
        var bg,
            btn_h,
            btn_d,
            btn_g;
        
        bg = new Danimage('background');
        bg.src('img/cover/bg.jpg');
        /// Aggiunge un pulsante HELP
        btn_h = new Danimage('btn_help');
        btn_h.src('img/cover/btn_help.png');
        btn_h.enableMouse();
        btn_h.x(32);
        btn_h.y(470);
        /// Aggiunge un pulsante DIARIO
        btn_d = new Danimage('btn_diary');
        btn_d.src('img/cover/btn_diario.png');
        btn_d.enableMouse();
        btn_d.x(260);
        btn_d.y(470);
        /// Aggiunge un pulsante HELP
        btn_g = new Danimage('btn_play');
        btn_g.src('img/cover/btn_gioca.png');
        btn_g.enableMouse();
        btn_g.x(640);
        btn_g.y(470);
        
        d.addChild(bg);
        d.addChild(btn_h);
        d.addChild(btn_d);
        d.addChild(btn_g);
        d.play();
        
        d.addListener('EnterFrame', function () {
            bg.rotation(bg.rotation() + 1);
        });
        btn_h.addListener('MouseOver', function () {
            btn_h.scale(1.10);
            btn_h.rotation((Math.random() * 12) - 6);
            btn_h.alpha(50);
        });
        btn_h.addListener('MouseOut', function () {
            btn_h.scale(1.00);
            btn_h.rotation(0);
            btn_h.alpha(100);
        });
        
    }
    /// Trig
    Danimake.utils.document_ready(init);
}());
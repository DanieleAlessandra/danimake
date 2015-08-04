/*jslint browser: true, devel: true, nomen: true*/
/*global Danimate*/

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
            btn_g,
			i;
        
        bg = new Danimate('background');
        bg.src('img/cover/bg.jpg');
        /// Aggiunge un pulsante HELP
        btn_h = new Danimate('btn_help');
        btn_h.src('img/cover/btn_help.png');
        btn_h.x(32);
        btn_h.y(470);
        /// Aggiunge un pulsante DIARIO
        btn_d = new Danimate('btn_diary');
        btn_d.src('img/cover/btn_diario.png');
        btn_d.x(260);
        btn_d.y(470);
        /// Aggiunge un pulsante HELP
        btn_g = new Danimate('btn_play');
        btn_g.src('img/cover/btn_gioca.png');
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
		
		var btns = [btn_h, btn_d, btn_g];
		for (i = 0; i < btns.length; i++) {
			btns[i].enableMouse();
			btns[i].addListener('MouseOver', function () {
				this.scale(1.10);
				this.rotation((Math.random() * 12) - 6);
				this.alpha(50);
			});
			btns[i].addListener('MouseOut', function () {
				this.scale(1.00);
				this.rotation(0);
				this.alpha(100);
			});
			btns[i].addListener('MouseDown', function () {
				this.parent.addChild(this); /// Bring To Front
				this.startDrag(0, 0, 100, 100);
			});
			btns[i].addListener('MouseUp', function () {
				this.stopDrag();
			});
		}
    }
    /// Trig
    Danimate.utils.document_ready(init);
}());
/*jslint browser: true, devel: true, nomen: true*/
/*global Danimate*/

var d,
    Actions = {
        cb_mouseOver: function () {
            "use strict";
            this.scale(1.10);
            this.rotation((Math.random() * 12) - 6);
            this.alpha(50);
        },
        cb_mouseOut: function () {
            "use strict";
            this.scale(1.00);
            this.rotation(0);
            this.alpha(100);
        },
        cb_mouseDown: function () {
            "use strict";
            this.parent.addChild(this); /// Bring To Front
            this.startDrag(0, 0, 100, 100);
        },
        cb_mouseUp: function () {
            "use strict";
            this.stopDrag();
        }
    };

(function () {
    "use strict";
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
			i,
            btns;
        
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
        /// Aggiungo un omino
        window.alien = new Danimate('alienSprite');
//        alien.loadImage('img/Eagle_Walk.png', 0, 0, 100, 200);
//        alien.loadImage('img/Alien.png', 0, 0, 93, 161);
        
        window.alien.loadImageSprite(
            'img/Alien.png',
            [
                [0, 0, 93, 161],
                [93, 0, 93, 161],
                [93 * 2, 0, 93, 161],
                [93 * 3, 0, 93, 161],
                [93 * 4, 0, 93, 161],
                [93 * 5, 0, 93, 161],
                [0, 161, 93, 161],
                [93, 161, 93, 161],
                [93 * 2, 161, 93, 161],
                [93 * 3, 161, 93, 161],
                [93 * 4, 161, 93, 161],
                [93 * 5, 161, 93, 161],
                [0, 161 * 2, 93, 161],
                [93, 161 * 2, 93, 161],
                [93 * 2, 161 * 2, 93, 161],
                [93 * 3, 161 * 2, 93, 161],
                [93 * 4, 161 * 2, 93, 161],
                [93 * 5, 161 * 2, 93, 161],
                [0, 161 * 3, 93, 161],
                [93, 161 * 3, 93, 161],
                [93 * 2, 161 * 3, 93, 161],
                [93 * 3, 161 * 3, 93, 161],
                [93 * 4, 161 * 3, 93, 161],
                [93 * 5, 161 * 3, 93, 161]
            ]
        );
        
        
        d.addChild(bg);
        d.addChild(btn_h);
        d.addChild(btn_d);
        d.addChild(btn_g);
        d.addChild(window.alien);
        d.play();
        
        d.addListener('EnterFrame', function () {
            bg.rotation(bg.rotation() + 1);
        });
		
		btns = [btn_h, btn_d, btn_g];
        
        
		for (i = 0; i < btns.length; i += 1) {
			btns[i].enableMouse();
			btns[i].addListener('MouseOver', Actions.cb_mouseOver);
			btns[i].addListener('MouseOut', Actions.cb_mouseOut);
			btns[i].addListener('MouseDown', Actions.cb_mouseDown);
			btns[i].addListener('MouseUp', Actions.cb_mouseUp);
		}
    }
    /// Trig
    Danimate.utils.document_ready(init);
}());


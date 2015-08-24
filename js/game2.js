/*global Danimate,Danimage,Danimake*/


(function () {
    "use strict";
	var d,
		bg;
    /// $('document').ready alternative
    /// Init game
    function init() {
        d = new Danimate('main');
        d.canvas('main');
        d.width(854);
        d.height(544);
        d.enableMouse();
		
		bg = new Danimage();
		bg.src('img/bigbackground.jpg');
		bg.x(0);
		bg.y(0);
		bg.enableMouse();
		
		bg.addListener('MouseDown', function () {
			this.startDrag(0, 0, this.parent.width() - this.width(), this.parent.height() - this.height());
		});
		bg.addListener('MouseUp', function () {
			this.stopDrag();
		});
		
		d.addChild(bg);
		
		d.play();
	}
	
	
    /// Trig
    Danimake.utils.document_ready(init);
}());
/*jslint browser: true, devel: true, nomen: true, plusplus: true*/
/*global HTMLCanvasElement*/
/**
 * Define a basic DisplayObject like the ActionScript one
 * @param   {String} Name of the instance
 * @returns {Danimate} Self instance
 */
function Danimake(name) {
    "use strict";
    var _alpha = 100,
        _canvas = null,
        _ctx = null,
        _displayList = [],
        _globals = {
            'fps': 24,
            'now': null,
            'then': Date.now(),
            'delta': null
        },
        _height = 400,
        _hover = false,
        _isMain = false,
        _isPlaying = false,
		_me = this,
        _mouseEnabled = false,
        _mouseX = 0,
        _mouseY = 0,
        _name = name,
        _onClick = [],
        _onEnterFrame = [],
		_onMouseDown = [],
        _onMouseMove = [],
        _onMouseOver = [],
        _onMouseOut = [],
		_onMouseUp = [],
        /**
         * Select an existing HTMLCanvasElement or create one
         * @param   {String}            id Id of an existing HTMLCanvasElement or NULL
         * @returns {HTMLCanvasElement} HTMLCanvasElement
         */
        _pickCanvas = function (id) {
            var c = document.getElementById(id);
            if (c instanceof HTMLCanvasElement) {
                _isMain = true;
                return c;
            }
            if (!_isMain) {
                c = document.createElement('CANVAS');
                c.setAttribute('width', '550');
                c.setAttribute('height', '400');
                return c;
            }
        },
        _rotation = 0,
        _scaleX = 1,
        _scaleY = 1,
        _startDragMouseX = 0,
        _startDragMouseY = 0,
		_startDragX = 0,
		_startDragY = 0,
        _width = 550,
        _x = 0,
        _y = 0;
    function click() {
        var i,
            l = _onClick.length;
        for (i = 0; i < l; i += 1) {
            _onClick[i].call(_me);
        }
    }
	function doDrag() {
		//console.log('_startDragX ' + _startDragX);
//		console.log('_mouseX ' + _mouseX);
//		console.log('_startDragMouseX ' + _startDragMouseX);
		_me.x(_startDragX + _me.parent.mouseX() - _startDragMouseX);
		_me.y(_startDragY + _me.parent.mouseY() - _startDragMouseY);
	}
    function enterFrame() {
        window.requestAnimationFrame(enterFrame);
        if (_isPlaying === true) {
            var i,
                l = _onEnterFrame.length;
            _globals.now = Date.now();
            _globals.delta = _globals.now - _globals.then;
            _globals.interval = 1e3 / _globals.fps;
            if (_globals.delta > _globals.interval) {
                for (i = 0; i < l; i += 1) {
                    _onEnterFrame[i].call(_me);
                }
                _globals.then = _globals.now - (_globals.delta % _globals.interval);
            }
        }
    }
    function mouseDown() {
        var i,
            l = _onMouseDown.length,
			d;
        for (i = 0; i < l; i += 1) {
            _onMouseDown[i].call(_me);
        }
		l = _displayList.length;
        for (i = 0; i < l; i += 1) {
            d = _displayList[i];
            if (d.mouseEnabled() && d.mouseIsOver()) {
                d.mouseDown();
            }
        }
    }
    function mouseMove(pos) {
        var i,
            l = _onMouseMove.length,
			d,
			p = {};
        for (i = 0; i < l; i += 1) {
            _onMouseMove[i].call(_me, pos.clientX, pos.clientY);
        }
		l = _displayList.length;
        for (i = 0; i < l; i += 1) {
            d = _displayList[i];
            if (d.mouseEnabled()) {
				p.clientX = pos.clientX - d.x();
				p.clientY = pos.clientY - d.y();
                d.mouseMove(p);
            }
        }
    }
    function mouseOut() {
        var i,
            l = _onMouseOut.length;
        for (i = 0; i < l; i += 1) {
            _onMouseOut[i].call(_me);
        }
    }
    function mouseOver() {
        var i,
            l = _onMouseOver.length;
        for (i = 0; i < l; i += 1) {
            _onMouseOver[i].call(_me);
        }
    }
    function mouseUp() {
        var i,
            l = _onMouseUp.length,
			d;
        for (i = 0; i < l; i += 1) {
            _onMouseUp[i].call(_me);
        }
		l = _displayList.length;
        for (i = 0; i < l; i += 1) {
            d = _displayList[i];
			d.mouseUp();
        }
    }
    function redraw() {
        var i,
            l = _displayList.length,
            d;
        _ctx.clearRect(0, 0, _width, _height);
        for (i = 0; i < l; i += 1) {
            d = _displayList[i];
            _ctx.save();
            /// Apply alpha
            _ctx.globalAlpha = d.alpha() / 100;
            /// Apply translation to rotate properly
            _ctx.translate(d.x() + (d.width() / 2), d.y() + (d.height() / 2));
            /// Apply rotation
            _ctx.rotate(Danimake.utils.deg2rad(d.rotation()));
            /// Do the drawing
            _ctx.drawImage(d.getImage(), (d.width() * d.scaleX() / -2), (d.height() * d.scaleY() / -2), d.width() * d.scaleX(), d.height() * d.scaleY());
            /// Reset context
            _ctx.restore();
        }
    }
    /**
     * Add an element to _displayList
     * @param {Danimate} d Element to append
     */
    this.addChild = function (d) {
        if (d instanceof Danimake) {
			d.parent = this;
            _displayList.push(d);
        } else {
            throw new Error('Child must be a Danimake Instance');
        }
    };
    /**
     * Register a single EventListener
     * @param {String}   event    Event name
     * @param {Function} callback Callback function
     */
    this.addListener = function (event, callback) {
        if (Array.isArray(this.eventsList[event]) && typeof callback === 'function') {
            this.eventsList[event].push(callback);
        } else {
			throw new Error('Cannot register listener for [' + event + ']');
		}
    };
    /**
     * Read or write _alpha property
     * @param   {Number} n [0-100] New value or NULL
     * @returns {Number} [0-100] Current or new value
     */
    this.alpha = function (n) {
        if (n !== undefined) {
            var o = parseInt(n, 10) || 0;
            o = Math.max(o, 0);
            o = Math.min(o, 100);
            _alpha = o;
        }
        return _alpha;
    };
    /**
     * Assign canvas to Object
     * @param {String} canvasId Id of existing HTMLCanvasElement or NULL
     */
    this.canvas = function (canvasId) {
        _canvas = _pickCanvas(canvasId);
        _ctx = _canvas.getContext('2d');
    };
    /**
     * Draws a rectangle
     * @param {Number} x Left border position (default: 0)
     * @param {Number} y Top border position (default: 0)
     * @param {Number} w Width (default: full canvas width)
     * @param {Number} h Height (default: full canvas height)
     * @param {String} c Hex color [#F3D2B1 || #FDB] (default: #006699)
     */
    this.drawRect = function (x, y, w, h, c) {
        var fillX = parseInt(x, 10) || 0,
            fillY = parseInt(y, 10) || 0,
            fillW = parseInt(w, 10) || _width,
            fillH = parseInt(h, 10) || _height,
            fillC = Danimake.utils.fixColor(c) || '#006699';
        _ctx.fillStyle = fillC;
        _ctx.fillRect(fillX, fillY, fillW, fillH);
    };
    /**
     * Enable Mouse Events;
     */
    this.enableMouse = function () {
        if (_isMain) {
            window.addEventListener('mousemove', mouseMove);
            window.addEventListener('mousedown', mouseDown);
            window.addEventListener('mouseup', mouseUp);
        }
        _mouseEnabled = true;
    };
	this.eventsList = {
		'Click': _onClick,
		'EnterFrame': _onEnterFrame,
		'MouseDown': _onMouseDown,
		'MouseMove': _onMouseMove,
		'MouseOver': _onMouseOver,
		'MouseOut': _onMouseOut,
		'MouseUp': _onMouseUp
	};
    /**
     * Generate PNG from Canvas data
     * @returns {HTMLImageElement} An usable Image Object
     */
    this.getImage = function () {
        var image = new Image();
        image.src = _canvas.toDataURL("image/png");
        return image;
    };
    /**
     * Read or write _height property
     * @param   {Number} n New value or NULL
     * @returns {Number} Current or new value
     */
    this.height = function (n) {
        if (n !== undefined) {
            _height = parseInt(n, 10) || 0;
            _canvas.setAttribute('height', _height);
        }
        return _height;
    };
	this.hover = function () {
		return _hover;
	};
	this.mouseDown = mouseDown;
    /**
     * Getter
     * @returns {Boolean} _mouseEnabled value
     */
    this.mouseEnabled = function () {
        return _mouseEnabled;
    };
	this.mouseMove = mouseMove;
    /**
     * Propagate Mouse Events to Children
     * @param {Number} mouseX Mouse X Position relative to this Object
     * @param {Number} mouseY Mouse Y Position relative to this Object
     */
    this.mouseMoved = function (mouseX, mouseY) {
        var i,
            l = _displayList.length,
            d;
		_mouseX = mouseX;
		_mouseY = mouseY;
        if (this.mouseIsOver()) {
            if (!_hover) {
                mouseOver();
                _hover = true;
            }
        } else {
            if (_hover) {
                mouseOut();
                _hover = false;
            }
        }
        for (i = 0; i < l; i += 1) {
            d = _displayList[i];
            if (d.mouseEnabled()) {
                d.mouseMoved(mouseX - d.x(), mouseY - d.y());
            }
        }
    };
	this.mouseIsOver = function() {
		return _mouseX >= 0 && _mouseX <= _width && _mouseY >= 0 && _mouseY <= _height;
	}
	this.mouseUp = mouseUp;
	/**
	 * Getter
	 * @returns {Number} _mouseX value
	 */
	this.mouseX = function() {
		return _mouseX;
	};
	/**
	 * Getter
	 * @returns {Number} _mouseY value
	 */
	this.mouseY = function() {
		return _mouseY;
	};
    /**
     * Set _isPlaying = true
     */
    this.play = function () {
        _isPlaying = true;
    };
    /**
     * Remove a single EventListener
     * @param {String}   event    Event name
     * @param {Function} callback Callback function
     */
    this.removeListener = function (event, callback) {
        if (Array.isArray(this.eventsList[event]) && typeof callback === 'function') {
            Danimake.utils.array_remove(this.eventsList[event], callback);
        }
    };
    /**
     * Read or write _rotation property
     * @param   {Number} n New value or NULL
     * @returns {Number} Current or new value
     */
    this.rotation = function (n) {
        if (n !== undefined) {
            _rotation = parseFloat(n) || 0;
        }
        return _rotation % 360;
    };
    /**
     * Read or write _scaleX and _scaleY properties
     * @param   {Number} n [0-1] New value or NULL
     * @returns {Number} [0-1] Current or new value
     */
    this.scale = function (n) {
        if (n !== undefined) {
            var o = parseFloat(n) || 0;
            o = Math.max(o, 0.001);
            o = Math.min(o, 16);
            _scaleX = o;
            _scaleY = o;
        }
        return (_scaleX * _scaleY) / 2;
    };
    /**
     * Read or write _scaleX property
     * @param   {Number} n [0-1] New value or NULL
     * @returns {Number} [0-1] Current or new value
     */
    this.scaleX = function (n) {
        if (n !== undefined) {
            var o = parseFloat(n) || 0;
            o = Math.max(o, 0.001);
            o = Math.min(o, 16);
            _scaleX = o;
        }
        return _scaleX;
    };
    /**
     * Read or write _scaleY property
     * @param   {Number} n [0-1] New value or NULL
     * @returns {Number} [0-1] Current or new value
     */
    this.scaleY = function (n) {
        if (n !== undefined) {
            var o = parseFloat(n) || 0;
            o = Math.max(o, 0.001);
            o = Math.min(o, 16);
            _scaleY = o;
        }
        return _scaleY;
    };
    /**
     * Activate dragging of this Instance
     */
    this.startDrag = function () {
		if (_isMain) {
			throw new Error('Cannot drag main canvas.');
		}
        _startDragMouseX = _mouseX;
        _startDragMouseY = _mouseY;
		_startDragX = this.parent.x();
		_startDragY = this.parent.y();
        this.addListener('MouseMove', doDrag);
    };
    /**
     * Set _isPlaying = false
     */
    this.stop = function () {
        _isPlaying = false;
    };
    /**
     * Deactivate dragging
     */
    this.stopDrag = function () {
        this.removeListener('MouseMove', doDrag);
    };
    /**
     * Read or write _width property
     * @param   {Number} n New value or NULL
     * @returns {Number} Current or new value
     */
    this.width = function (n) {
        if (n !== undefined) {
            _width = parseInt(n, 10) || 0;
            _canvas.setAttribute('width', _width);
        }
        return _width;
    };
    /**
     * Read or write _x property
     * @param   {Number} n New value or NULL
     * @returns {Number} Current or new value
     */
    this.x = function (n) {
        if (n !== undefined) {
            _x = parseInt(n, 10) || 0;
        }
        return _x;
    };
    /**
     * Read or write _y property
     * @param   {Number} n New value or NULL
     * @returns {Number} Current or new value
     */
    this.y = function (n) {
        if (n !== undefined) {
            _y = parseInt(n, 10) || 0;
        }
        return _y;
    };
    /// Window methods
    window.requestAnimationFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            function (f) {
                window.setTimeout(f, 1e3 / 60);
            };
    }());
    /// Assign initial callbacks
    _onEnterFrame.push(redraw);
    _onMouseMove.push(this.mouseMoved);
    /// Starts Animation
    enterFrame();
}
Danimake.utils = {
    array_remove: function (arr) {
        "use strict";
        var what,
            a = arguments,
            L = a.length,
            ax;
        while (L > 1 && arr.length) {
            what = a[--L];
            while ((ax = arr.indexOf(what)) !== -1) {
                arr.splice(ax, 1);
            }
        }
        return arr;
    },
    deg2rad: function (deg) {
        "use strict";
        return deg * (Math.PI / 180);
    },
    document_ready: function (fn) {
        "use strict";
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    },
    fixColor: function (c) {
        "use strict";
        return (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i).test(c) ? c : false;
    },
    rad2deg: function (rad) {
        "use strict";
        return rad * (180 / Math.PI);
    }
};
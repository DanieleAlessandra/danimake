/*jslint browser: true, devel: true, nomen: true, plusplus: true*/
/*global HTMLCanvasElement*/
/**
 * Define a basic DisplayObject like the ActionScript one
 * @param   {String} Name of the instance
 * @returns {Danimate} Self instance
 */
function Danimate(name) {
    "use strict";
    var _alpha = 100,
        _canvas = null,
        _ctx = null,
        _currentFrame = 0,
        _currentScene = 0,
        _displayList = [/*SCENES*/[/*FRAMES*/[]]],
        _dragBoundaries = {
            bottom: 1e6,
            left: -1e6,
            right: 1e6,
            top: -1e6
        },
        _globals = {
            'fps': 24,
            'now': null,
            'then': Date.now(),
            'delta': null
        },
        _handleX = 0,
        _handleY = 0,
        _height = 400,
        _hover = false,
        _img = new Image(),
        _imgCropHeight = 0,
        _imgCropWidth = 0,
        _imgCropX = 0,
        _imgCropY = 0,
        _imgLoaded = false,
        _imgHeight = 0,
        _imgWidth = 0,
        _isMain = false,
        _isPlaying = false,
		_me = this,
        _mouseEnabled = false,
        _mouseX = 0,
        _mouseY = 0,
        _name = name,
        _onClick = [],
        _onEnterFrame = [],
        _onFrame = [],
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
    
    /**
     * Mark image as Loaded
     */
    _img.onload = function () {
        _imgLoaded = true;
        _width = _imgCropWidth || _img.width;
        _height = _imgCropHeight || _img.height;
        _handleX = _width / 2;
        _handleY = _height / 2;
        _img.mouseEnabled = function () { return false; };
        _me.displayList()[0] = _img;
    };
    
    /**
     * Manage clicks
     */
    function click() {
        var i,
            l = _onClick.length;
        for (i = 0; i < l; i += 1) {
            _onClick[i].call(_me);
        }
    }
	/**
	 * Execute dragging
	 */
	function doDrag() {
        var currentDragX = _startDragX + _me.parent.mouseX() - _startDragMouseX,
            currentDragY = _startDragY + _me.parent.mouseY() - _startDragMouseY;
		_me.x(Danimate.utils.math_mid(_dragBoundaries.left, currentDragX, _dragBoundaries.right));
		_me.y(Danimate.utils.math_mid(_dragBoundaries.top, currentDragY, _dragBoundaries.bottom));
    }
    /**
     * Executed every frame interval
     */
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
    /**
     * Manages MouseDown Events
     */
    function mouseDown() {
        var i,
            l = _onMouseDown.length,
			d;
        for (i = 0; i < l; i += 1) {
            _onMouseDown[i].call(_me);
        }
		l = _me.displayList().length;
        for (i = l - 1; i >= 0; i -= 1) {
            d = _me.displayList()[i];
            if (d.mouseEnabled() && d.mouseIsOver()) {
                d.mouseDown();
                return;
            }
        }
    }
    /**
     * Manages MouseMove Events
     * @param {Object} pos Event Coordinates
     */
    function mouseMove(pos) {
        var i,
            l = _onMouseMove.length,
			d,
			p = {};
        for (i = 0; i < l; i += 1) {
            _onMouseMove[i].call(_me, pos.clientX, pos.clientY);
        }
		l = _me.displayList().length;
        for (i = 0; i < l; i += 1) {
            d = _me.displayList()[i];
            if (d.mouseEnabled()) {
				p.clientX = pos.clientX - d.x();
				p.clientY = pos.clientY - d.y();
                d.mouseMove(p);
            }
        }
    }
    /**
     * Manages MouseOut Events
     */
    function mouseOut() {
		_hover = false;
        var i,
            l = _onMouseOut.length;
        for (i = 0; i < l; i += 1) {
            _onMouseOut[i].call(_me);
        }
    }
    /**
     * Manages MouseOver Events
     */
    function mouseOver() {
		_hover = true;
        var i,
            l = _onMouseOver.length;
        for (i = 0; i < l; i += 1) {
            _onMouseOver[i].call(_me);
        }
    }
    /**
     * Manages MouseUp  Events
     */
    function mouseUp() {
        var i,
            l = _onMouseUp.length,
			d;
        for (i = 0; i < l; i += 1) {
            _onMouseUp[i].call(_me);
        }
		l = _me.displayList().length;
        for (i = 0; i < l; i += 1) {
            d = _me.displayList()[i];
            if (d instanceof Danimate) {
                d.mouseUp();
            }
        }
    }
    /**
     * Move animation to Next Frame
     */
    function nextFrame() {
        _me.gotoFrame(_currentFrame + 1);
    }
    /**
     * Redraw entire canvas (usually every frame interval)
     */
    function redraw() {
        var i,
            l = _me.displayList().length,
            d,
            values;
        _ctx.clearRect(0, 0, _width, _height);
        for (i = 0; i < l; i += 1) {
            d = _me.displayList()[i];
            _ctx.save();
            /// Apply alpha
            _ctx.globalAlpha = d.alpha() / 100;
            /// Apply translation to rotate properly
            _ctx.translate(d.handleX(), d.handleY());
            /// Apply rotation
            _ctx.rotate(Danimate.utils.deg2rad(d.rotation()));
            /// Do the drawing
            values = d.drawingValues();
//            console.log(values);
            _ctx.drawImage.apply(_ctx, values);
            /// Reset context
            _ctx.restore();
        }
    }
    /**
     * Add an element to this.displayList()
     * @param {Danimate} d Element to append
     */
    this.addChild = function (d) {
        if (d instanceof Danimate) {
			d.parent = this;
			this.removeChild(d);
            this.displayList().push(d);
        } else {
            throw new Error('Child must be a Danimate Instance');
        }
    };
    /**
     * Adds a single Frame
     */
    this.addFrame = function () {
        _displayList[_currentScene].push([]);
    };
    /**
     * Register a single callback for a specific frame
     * @param {Function} callback Callback function
     * @param {Number}   scene    Zero based Scene Number
     * @param {Number}   frame    Zero based Frame Number
     */
    this.addFrameCallback = function (callback, scene, frame) {
        if (isNaN(scene)) {
            scene = 0;
        }
        if (isNaN(frame)) {
            frame = 0;
        }
        if (undefined === _onFrame[scene]) {
            _onFrame[scene] = [];
        }
        if (undefined === _onFrame[scene][frame]) {
            _onFrame[scene][frame] = [];
        }
        if (typeof callback === 'function') {
            _onFrame[scene][frame].push(callback);
        } else {
			throw new Error('Cannot register listener for frame ' + frame + ' in scene ' + scene);
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
     * Adds a single Scene
     */
    this.addScene = function () {
        _displayList.push([]);
        this.gotoScene(_displayList.length - 1);
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
     * Get current displayList based on scene and frame numbers
     * @returns {Array} An Array of Danimate instances (occasionally also HTMLImageElement are returned)
     */
    this.displayList = function () {
        var op = _displayList[_currentScene][_currentFrame];
        if (op instanceof Array) {
            return op;
        } else {
            throw new Error('_displayList must be an Array');
        }
    };
    this.drawingValues = function () {
        var op = [];
        op.push(this.getImage());
        op.push(_imgCropX || 0);
        op.push(_imgCropY || 0);
        op.push(_imgCropWidth || this.width());
        op.push(_imgCropHeight || this.height());
        if (this.parent) {
            op.push((this.x() - this.handleX()) * this.parent.scaleX());
            op.push((this.y() - this.handleY()) * this.parent.scaleY());
        } else {
            op.push((this.x() - this.handleX()));
            op.push((this.y() - this.handleY()));
        }
        op.push(this.width() * this.scaleX());
        op.push(this.height() * this.scaleY());
        return op;
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
            fillC = Danimate.utils.fixColor(c) || '#006699';
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
	 * Get child by name or index
	 * @param   {Number or String} ref Index or Name
	 * @returns {Danimate}         Child instance
	 */
	this.getChild = function (ref) {
		var i,
            l = this.displayList().length;
		
		if (typeof ref === 'string') {
			/// Search by Name
			for (i = 0; i < l; i++) {
				if (this.displayList()[i].name === 'ref') {
					return this.displayList()[i];
				}
			}
		} else if (typeof ref === 'number') {
			/// Search by Index
			if (parseInt(ref, 10) < this.displayList().length) {
				return this.displayList()[ref];
			}
		}
	};
    /**
     * Generate PNG from Canvas data
     * @returns {HTMLImageElement} An usable Image Object
     */
    this.getImage = function () {
        if (undefined !== _img.src && _imgLoaded === true) {
            return _img;
        }
        var image = new Image();
        if (_canvas instanceof HTMLCanvasElement) {
            image.src = _canvas.toDataURL("image/png");
        }
        return image;
    };
    /**
     * Changes current Frame
     * @param {Number} n Zero based Frame Number
     */
    this.gotoFrame = function (n) {
        var i,
            l;
        if (_displayList[_currentScene][n]) {
            _currentFrame = n;
            if (undefined !== _onFrame[_currentScene]) {
                if (undefined !== _onFrame[_currentScene][_currentFrame]) {
                    l = _onFrame[_currentScene][_currentFrame].length;
                    for (i = 0; i < l; i += 1) {
                        _onFrame[_currentScene][_currentFrame][i].call(_me);
                    }
                }
            }
        } else {
            _currentFrame = 0;
        }
    };
    /**
     * Changes Current Scene
     * @param {Number} n Zero based Scene Number
     */
    this.gotoScene = function (n) {
        if (_displayList[n]) {
            _currentScene = n;
        } else {
            _currentScene = 0;
        }
    };
    this.handleX = function (n) {
        if (n !== undefined) {
            _handleX = parseInt(n, 10) || 0;
        }
        return _handleX;
    };
    this.handleY = function (n) {
        if (n !== undefined) {
            _handleY = parseInt(n, 10) || 0;
        }
        return _handleY;
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
	this.hover = function (val) {
		if (undefined !== val) {
			_hover = !!val;
		}
		return _hover;
	};
    this.loadImage = function (src, x, y, width, height) {
        if (src !== undefined) {
            if (x !== undefined) {
                _imgCropX = x;
            }
            if (y !== undefined) {
                _imgCropY = y;
            }
            if (width !== undefined) {
                _imgCropWidth = width;
            }
            if (height !== undefined) {
                _imgCropHeight = height;
            }
            this.src(src);
        }
    };
    this.loadImageSprite = function (src, frames) {
        var l = frames.length,
            i,
            tempImg;
        /// Init values
        this.canvas(this.name());
        _imgCropX = frames[0][0];
        _imgCropY = frames[0][1];
        _imgCropWidth = frames[0][2];
        _imgCropHeight = frames[0][3];
        _width = frames[0][2];
        _height = frames[0][3];
        
        for (i = 0; i < l; i++) {
            tempImg = new Danimate(this.name() + '_frame_' + i);
            tempImg.loadImage(src, frames[i][0], frames[i][1], frames[i][2], frames[i][3]);
            if (!_displayList[_currentScene]) {
                _displayList[_currentScene] = [];
            }
            if (!_displayList[_currentScene][i]) {
                _displayList[_currentScene][i] = [];
            }
            _displayList[_currentScene][i][0] = tempImg;
        }
        this.play();
        
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
            l = this.displayList().length,
            d,
			foundMouseChild; /// Found the first element under mouse Pointer
		_mouseX = mouseX;
		_mouseY = mouseY;
		
        for (i = l - 1; i >= 0; i -= 1) {
            d = this.displayList()[i];
            if (d && d.mouseEnabled()) {
                d.mouseMoved(mouseX - d.x(), mouseY - d.y());
				if (!foundMouseChild) {
					if (d.mouseIsOver()) {
						if (!d.hover()) {
							d.mouseOver();
							foundMouseChild = true;
						} else {
							foundMouseChild = true;
						}
					} else if (d.hover()) {
						d.mouseOut();
					}
				} else if (d.hover()) {
					d.mouseOut();
				}
			}
        }
    };
	/**
	 * Tells if mouse is over this object (only works on straight rectangles)
	 * @returns {Boolean} True if mouse is over
	 */
	this.mouseIsOver = function () {
		return _mouseX >= 0 && _mouseX <= _width && _mouseY >= 0 && _mouseY <= _height;
	};
	this.mouseOut = mouseOut;
	this.mouseOver = mouseOver;
	this.mouseUp = mouseUp;
	/**
	 * Getter
	 * @returns {Number} _mouseX value
	 */
	this.mouseX = function () {
		return _mouseX;
	};
	/**
	 * Getter
	 * @returns {Number} _mouseY value
	 */
	this.mouseY = function () {
		return _mouseY;
	};
	this.name = function () {
		return _name;
	};
    /**
     * Set _isPlaying = true
     */
    this.play = function () {
        _isPlaying = true;
    };
	this.removeChild = function (element) {
		var i;
		while ((i = this.displayList().indexOf(element)) !== -1) {
			this.displayList().splice(i, 1);
		}
    };
    /**
     * Remove a single EventListener
     * @param {String}   event    Event name
     * @param {Function} callback Callback function
     */
    this.removeListener = function (event, callback) {
        if (Array.isArray(this.eventsList[event]) && typeof callback === 'function') {
            Danimate.utils.array_remove(this.eventsList[event], callback);
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
     * Set or Get Image src
     * @param   {String} src New value or NULL
     * @returns {String} src value
     */
    this.src = function (src) {
        if (undefined !== src) {
            _img.src = src;
        }
        return _img.src;
    };
    /**
     * Activate dragging of this Instance
     */
    this.startDrag = function (left, top, right, bottom) {
		if (_isMain) {
			throw new Error('Cannot drag main canvas.');
		}
        _dragBoundaries.left = undefined !== left ? left : -1e6;
        _dragBoundaries.top = undefined !== top ? top : -1e6;
        _dragBoundaries.right = undefined !== right ? right : 1e6;
        _dragBoundaries.bottom = undefined !== bottom ? bottom : 1e6;
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
    _onEnterFrame.push(nextFrame);
    _onMouseMove.push(this.mouseMoved);
    /// Starts Animation
    enterFrame();
}
Danimate.utils = {
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
    math_mid: function (x1, x2, x3) {
        "use strict";
        var op = [];
        op.push(!isNaN(x1) ? x1 : 0);
        op.push(!isNaN(x2) ? x2 : 0);
        op.push(!isNaN(x3) ? x3 : 0);
        op.sort(function (a, b) {return a - b; });
        return op[1];
    },
    rad2deg: function (rad) {
        "use strict";
        return rad * (180 / Math.PI);
    }
};
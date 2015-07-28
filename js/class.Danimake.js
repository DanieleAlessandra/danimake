/*jslint browser: true, devel: true, nomen: true*/
/*global HTMLCanvasElement,HTMLImageElement*/
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
        _mouseEnabled = false,
        _mouseX = 0,
        _mouseY = 0,
        _name = name,
        _onClick = [],
        _onEnterFrame = [],
        _onMouseMove = [],
        _onMouseOver = [],
        _onMouseOut = [],
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
        _width = 550,
        _x = 0,
        _y = 0;
    function click() {
        var i,
            l = _onClick.length;
        for (i = 0; i < l; i += 1) {
            _onClick[i]();
        }
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
                    _onEnterFrame[i]();
                }
                _globals.then = _globals.now - (_globals.delta % _globals.interval);
            }
        }
    }
    function mouseMove(pos) {
        var i,
            l = _onMouseMove.length;
        for (i = 0; i < l; i += 1) {
            _onMouseMove[i](pos.clientX, pos.clientY);
        }
    }
    function mouseOut() {
        var i,
            l = _onMouseOut.length;
        for (i = 0; i < l; i += 1) {
            _onMouseOut[i]();
        }
    }
    function mouseOver() {
        var i,
            l = _onMouseOver.length;
        for (i = 0; i < l; i += 1) {
            _onMouseOver[i]();
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
        var eventsList = {
            'Click': _onClick,
            'EnterFrame': _onEnterFrame,
            'MouseMove': _onMouseMove,
            'MouseOver': _onMouseOver,
            'MouseOut': _onMouseOut
        },
            eventReference = eventsList[event];
        if (Array.isArray(eventReference) && typeof callback === 'function') {
            eventReference.push(callback);
        }
        console.log(eventReference);
        console.log(eventsList[event]);
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
        }
        _mouseEnabled = true;
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
    /**
     * Getter
     * @returns {Boolean} _mouseEnabled value
     */
    this.mouseEnabled = function () {
        return _mouseEnabled;
    };
    /**
     * Propagate Mouse Events to Children
     * @param {Number} mouseX Mouse X Position relative to this Object
     * @param {Number} mouseY Mouse Y Position relative to this Object
     */
    this.mouseMoved = function (mouseX, mouseY) {
        var i,
            l = _displayList.length,
            d;
        if (mouseX >= 0 && mouseX <= _width && mouseY >= 0 && mouseY <= _height) {
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
    /**
     * Set _isPlaying = true
     */
    this.play = function () {
        _isPlaying = true;
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
     * Set _isPlaying = false
     */
    this.stop = function () {
        _isPlaying = false;
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
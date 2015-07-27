/*jslint browser: true, devel: true, nomen: true*/
/*global HTMLCanvasElement,HTMLImageElement*/
/**
 * Define a basic DisplayObject like the ActionScript one
 * @param   {String} src Path to an existing image
 * @returns {Danimate} Self instance
 */
function Danimage(src) {
    "use strict";
    var _x = 0,
        _y = 0,
        _rotation = 0,
        _width = 550,
        _height = 400,
        _scaleX = 1,
        _scaleY = 1,
        _alpha = 100,
        _hover = false,
        _mouseEnabled = false,
        _mouseOver = function () {
            _scaleX = _scaleY = 1.1;
            _alpha = 50;
        },
        _mouseOut = function () {
            _scaleX = _scaleY = 1;
            _alpha = 100;
        },
        /**
         * Propagate Mouse Events to children
         * TODO: Works only on straight rectangles
         */
        _mouseMoved = function (mouseX, mouseY) {
            if (mouseX >= 0 && mouseX <= _width && mouseY >= 0 && mouseY <= _height) {
                if (!_hover) {
                    _mouseOver();
                    _hover = true;
                }
            } else {
                if (_hover) {
                    _mouseOut();
                    _hover = false;
                }
            }
        },
        _img = new Image(),
        _isReady = false;
    _img.src = src;
    _img.onload = function () {
        _isReady = true;
        _width = _img.width;
        _height = _img.height;
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
     * Read or write _width property
     * @param   {Number} n New value or NULL
     * @returns {Number} Current or new value
     */
    this.width = function (n) {
        if (n !== undefined) {
            _width = parseInt(n, 10) || 0;
            _img.setAttribute('width', _width);
        }
        return _width;
    };
    /**
     * Read or write _height property
     * @param   {Number} n New value or NULL
     * @returns {Number} Current or new value
     */
    this.height = function (n) {
        if (n !== undefined) {
            _height = parseInt(n, 10) || 0;
            _img.setAttribute('height', _height);
        }
        return _height;
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
     * Get Image for printing
     * @returns {HTMLImageElement} An usable Image Object
     */
    this.getImage = function () {
        return _img;
    };
    /**
     * Enable Mouse Events
     */
    this.enableMouse = function () {
        _mouseEnabled = true;
    };
    this.mouseEnabled = function () {
        return _mouseEnabled;
    };
    this.mouseMoved = _mouseMoved;
}
/*jslint browser: true, devel: true, nomen: true*/
/*global Danimate*/
/**
 * Extends Danimate
 * @param   {String} canvas Id of an existing HTMLCanvasElement or NULL
 * @returns {Danimage} Self instance
 */
function Danimage(name) {
    "use strict";
    Danimate.call(this, name);
    var _img = new Image(),
        _imgLoaded = false;
    _img.parent = this;
    
    /**
     * Mark image as Loaded
     */
    _img.onload = function () {
        _imgLoaded = true;
        this.parent.width(_img.width);
        this.parent.height(_img.height);
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
     * Get Image for printing
     * @returns {HTMLImageElement} An usable Image Object
     */
    this.getImage = function () {
        return _img;
    };
}

Danimage.prototype = new Danimate(null);
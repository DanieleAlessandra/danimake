/*jslint browser: true, devel: true, nomen: true*/
/*global Danimake*/
/**
 * Extends Danimake
 * @param   {String} canvas Id of an existing HTMLCanvasElement or NULL
 * @returns {Danimate} Self instance
 */
function Danimate(name) {
    "use strict";
    Danimake.call(this, name);
    this.canvas(name);
}

Danimate.prototype = new Danimake(null);
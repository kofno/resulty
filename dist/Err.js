"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Result_1 = require("./Result");
var Err = (function (_super) {
    __extends(Err, _super);
    function Err(theError) {
        var _this = _super.call(this) || this;
        _this.error = theError;
        return _this;
    }
    Err.prototype.getOrElse = function (defaultValue) {
        return defaultValue;
    };
    Err.prototype.map = function (fn) {
        return this;
    };
    Err.prototype.mapError = function (fn) {
        return new Err(fn(this.error));
    };
    Err.prototype.andThen = function (fn) {
        return this;
    };
    Err.prototype.orElse = function (fn) {
        return fn(this.error);
    };
    Err.prototype.cata = function (matcher) {
        return matcher.Err(this.error);
    };
    Err.prototype.ap = function (result) {
        return this;
    };
    return Err;
}(Result_1.default));
/**
 * A convenience function for creating a new Err.
 */
function err(e) { return new Err(e); }
exports.err = err;
exports.default = Err;
//# sourceMappingURL=Err.js.map
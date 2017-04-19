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
var Ok = (function (_super) {
    __extends(Ok, _super);
    function Ok(theValue) {
        var _this = _super.call(this) || this;
        _this.value = theValue;
        return _this;
    }
    Ok.prototype.getOrElse = function (_) {
        return this.value;
    };
    Ok.prototype.map = function (fn) {
        return new Ok(fn(this.value));
    };
    Ok.prototype.andThen = function (fn) {
        return fn(this.value);
    };
    Ok.prototype.orElse = function (fn) {
        return this;
    };
    Ok.prototype.cata = function (matcher) {
        return matcher.Ok(this.value);
    };
    return Ok;
}(Result_1.default));
function ok(v) { return new Ok(v); }
exports.ok = ok;
exports.default = Ok;
//# sourceMappingURL=Ok.js.map
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
var Event_1 = require("./Event");
var uuid = require("uuid/v4");
var IdentityAddEvent = /** @class */ (function (_super) {
    __extends(IdentityAddEvent, _super);
    function IdentityAddEvent(prevHash, props) {
        var _this = _super.call(this, Event_1.EventType.identityAdd, prevHash) || this;
        if (props == null) {
            props = {};
        }
        if (props.id == null) {
            props.id = _this.generateId();
        }
        _this.props = props;
        _this.hash = _this.generateHash();
        return _this;
    }
    IdentityAddEvent.prototype.generateId = function () {
        return uuid();
    };
    return IdentityAddEvent;
}(Event_1.default));
exports.default = IdentityAddEvent;

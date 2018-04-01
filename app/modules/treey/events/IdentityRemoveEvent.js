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
var IdentityRemoveEvent = /** @class */ (function (_super) {
    __extends(IdentityRemoveEvent, _super);
    function IdentityRemoveEvent(prevHash, props) {
        var _this = _super.call(this, Event_1.EventType.identityRemove, prevHash) || this;
        _this.props = props || null;
        _this.hash = _this.generateHash();
        return _this;
    }
    return IdentityRemoveEvent;
}(Event_1.default));
exports.default = IdentityRemoveEvent;

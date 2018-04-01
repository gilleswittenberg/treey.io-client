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
var DataAddEvent = /** @class */ (function (_super) {
    __extends(DataAddEvent, _super);
    function DataAddEvent(prevHash, props) {
        var _this = _super.call(this, Event_1.EventType.dataAdd, prevHash) || this;
        _this.props = props || null;
        _this.hash = _this.generateHash();
        return _this;
    }
    Object.defineProperty(DataAddEvent.prototype, "keyValues", {
        get: function () {
            var _this = this;
            if (this.props == null)
                return [];
            if (this.props.key != null && this.props.value != null)
                return [{ key: this.props.key, value: this.props.value }];
            if (this.props.data != null) {
                return Object.keys(this.props.data).map(function (key) { return ({ key: key, value: _this.props.data[key] }); });
            }
            return [];
        },
        enumerable: true,
        configurable: true
    });
    return DataAddEvent;
}(Event_1.default));
exports.default = DataAddEvent;

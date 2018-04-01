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
var DataRemoveEvent = /** @class */ (function (_super) {
    __extends(DataRemoveEvent, _super);
    function DataRemoveEvent(prevHash, props) {
        var _this = _super.call(this, Event_1.EventType.dataRemove, prevHash) || this;
        _this.props = props || null;
        _this.hash = _this.generateHash();
        return _this;
    }
    Object.defineProperty(DataRemoveEvent.prototype, "keys", {
        get: function () {
            var _this = this;
            if (this.props == null)
                return [];
            if (this.props.key != null)
                return [this.props.key];
            if (this.props.keys != null)
                return this.props.keys;
            if (this.props.data != null) {
                var dataKeys = Object.keys(this.props.data);
                var keys_1 = [];
                dataKeys.forEach(function (key) { if (_this.props.data[key] === true) {
                    keys_1.push(key);
                } });
                return keys_1;
            }
            return [];
        },
        enumerable: true,
        configurable: true
    });
    return DataRemoveEvent;
}(Event_1.default));
exports.default = DataRemoveEvent;

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
var Treey_1 = require("./Treey");
var objectPath = require("object-path");
var objectAssignDeep = require("object-assign-deep");
var TreeyData = /** @class */ (function (_super) {
    __extends(TreeyData, _super);
    function TreeyData(config, observers) {
        return _super.call(this, config, observers) || this;
    }
    Object.defineProperty(TreeyData.prototype, "data", {
        get: function () { return this._data; },
        enumerable: true,
        configurable: true
    });
    TreeyData.prototype.dataAdd = function (obj, key, value) {
        var s = '.[]';
        var l = s.length;
        var kl = key != null ? key.length : null;
        if (key != null && key.substring(key.length - l) === s) {
            var k = key.substring(0, key.length - l);
            objectPath.push(this._data, k, value);
        }
        else {
            //this._data = objectAssignDeep.withOptions({}, [this._data, obj], { arrayBehaviour: "merge" })
            this._data = objectAssignDeep({}, this._data, obj);
        }
        this.callObservers();
    };
    TreeyData.prototype.dataRemove = function (keys) {
        var _this = this;
        keys = [].concat(keys);
        keys.forEach(function (key) {
            objectPath.del(_this._data, key);
        });
        this.callObservers();
    };
    return TreeyData;
}(Treey_1.default));
exports.default = TreeyData;

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
var TreeyInterface_1 = require("./TreeyInterface");
var Protocol_1 = require("./protocols/Protocol");
var Database_1 = require("./databases/Database");
var BrowserProtocol_1 = require("./protocols/BrowserProtocol");
var DatabaseIndexedDB_1 = require("./databases/DatabaseIndexedDB");
var defaultConfig = {
    protocol: Protocol_1.ProtocolName.browser,
    database: Database_1.DatabaseType.indexedDB
};
var TreeyBrowser = /** @class */ (function (_super) {
    __extends(TreeyBrowser, _super);
    function TreeyBrowser() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._protocol = new BrowserProtocol_1.default();
        _this._database = new DatabaseIndexedDB_1.default();
        return _this;
    }
    return TreeyBrowser;
}(TreeyInterface_1.default));
exports.default = TreeyBrowser;

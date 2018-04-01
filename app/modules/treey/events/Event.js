"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hashString_1 = require("../lib/hashString");
var stringify = require("json-stable-stringify");
var EventType;
(function (EventType) {
    EventType["identityAdd"] = "IDENTITY_ADD";
    EventType["identityRemove"] = "IDENTITY_REMOVE";
    EventType["dataAdd"] = "DATA_ADD";
    EventType["dataRemove"] = "DATA_REMOVE";
    EventType["linksAdd"] = "LINKS_ADD";
    EventType["linksRemove"] = "LINKS_REMOVE";
})(EventType = exports.EventType || (exports.EventType = {}));
var Event = /** @class */ (function () {
    function Event(type, prevHash) {
        this.signatures = [];
        this.props = null;
        this.type = type;
        if (prevHash != null) {
            this.prevHash = prevHash;
        }
    }
    Event.prototype.toObject = function (includeHash) {
        if (includeHash === void 0) { includeHash = true; }
        var obj = {
            type: this.type,
            prevHash: this.prevHash
        };
        if (includeHash) {
            obj.hash = this.hash;
        }
        if (this.props != null) {
            obj.props = this.props;
        }
        return obj;
    };
    Event.prototype.stringify = function (includeHash) {
        if (includeHash === void 0) { includeHash = true; }
        var obj = this.toObject(includeHash);
        return stringify(obj);
    };
    Event.prototype.generateHash = function () {
        var str = this.stringify(false);
        return hashString_1.default(str);
    };
    Event.prototype.sign = function (signature) {
        this.signatures.push(signature);
    };
    Event.prototype.getSignatures = function (protocol) {
        return this.signatures.filter(function (signature) { return signature.protocol === protocol; });
    };
    return Event;
}());
exports.default = Event;

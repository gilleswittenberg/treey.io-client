"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var NodeId_1 = require("../nodes/NodeId");
var Event_1 = require("../events/Event");
var createEvent_1 = require("../events/createEvent");
var DatabaseType;
(function (DatabaseType) {
    DatabaseType[DatabaseType["memory"] = 0] = "memory";
    DatabaseType[DatabaseType["json"] = 1] = "json";
    DatabaseType[DatabaseType["indexedDB"] = 2] = "indexedDB";
})(DatabaseType = exports.DatabaseType || (exports.DatabaseType = {}));
var Database = /** @class */ (function () {
    function Database() {
        this.events = [];
        this.signatures = [];
    }
    Database.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    Database.prototype.createEvents = function (arr) {
        return arr
            .map(function (event) {
            if (event.type == null)
                return null;
            return createEvent_1.default(event.type, event.prevHash, event.props);
        })
            .filter(function (event) { return event != null; });
    };
    Database.prototype.clear = function () {
        this.events = [];
        this.signatures = [];
    };
    Database.prototype.addEvent = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.getEvent(event.hash) != null)
                    return [2 /*return*/, false];
                this.events.push(event);
                return [2 /*return*/, true];
            });
        });
    };
    Database.prototype.getEvent = function (hash) {
        var event = this.events.find(function (event) { return event.hash === hash; });
        if (event == null)
            return null;
        event.signatures = this.getSignatures(event.hash);
        return event;
    };
    Database.prototype.getGenesisEvents = function () {
        return this.events.filter(function (event) { return event.prevHash == null; });
    };
    Database.prototype.getEventChain = function (hash) {
        // event
        var event = this.getEvent(hash);
        // guard against non existing event
        if (event == null)
            return [];
        // older events
        var events = [event];
        while (events[0].prevHash != null) {
            var event_1 = this.getEvent(events[0].prevHash);
            if (event_1 != null) {
                events.unshift(event_1);
            }
        }
        // newer events
        var nextEvent = event;
        do {
            nextEvent = this.events.find(function (event) { return event.prevHash === nextEvent.hash; });
            if (nextEvent != null) {
                events.push(nextEvent);
            }
        } while (nextEvent != null);
        return events;
    };
    Database.prototype.getEventByNodeIdString = function (string) {
        var events = this.events.filter(function (event) { return event.type === Event_1.EventType.identityAdd; });
        var nodeId = new NodeId_1.default(null, null, string);
        return events.find(function (event) { return event.signatures.find(function (signature) { return signature.protocol === nodeId.protocol && event.props.id === nodeId.id; }) != null; });
    };
    Database.prototype.addSignature = function (signature) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.signatures.push(signature);
                return [2 /*return*/, true];
            });
        });
    };
    Database.prototype.getSignatures = function (hash) {
        return this.signatures.filter(function (signature) { return signature.hash === hash; });
    };
    return Database;
}());
exports.default = Database;

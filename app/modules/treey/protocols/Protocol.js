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
var createEvent_1 = require("../events/createEvent");
var stringify = require("json-stable-stringify");
var ProtocolName;
(function (ProtocolName) {
    ProtocolName["null"] = "";
    ProtocolName["self"] = "self";
    ProtocolName["treey"] = "treey";
    ProtocolName["browser"] = "browser";
})(ProtocolName = exports.ProtocolName || (exports.ProtocolName = {}));
var Protocol = /** @class */ (function () {
    function Protocol() {
        this.name = ProtocolName.null;
    }
    Protocol.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    Protocol.prototype.createAndSignEvent = function (type, prevHash, props) {
        return __awaiter(this, void 0, void 0, function () {
            var event;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        event = createEvent_1.default(type, prevHash, props);
                        // guard against invalid event
                        if (event == null)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, this.signEvent(event)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // @TODO: Async (also verifying events)
    // @TODO: use filter instead of let, forEach
    Protocol.prototype.validateEventChain = function (events, fromGenesis) {
        if (fromGenesis === void 0) { fromGenesis = true; }
        // guard agains empty events
        if (events.length === 0)
            return false;
        // genesis event
        if (fromGenesis && events[0].prevHash != null)
            return false;
        // prevHashes
        var l = events.filter(function (event, index) {
            if (index === 0)
                return true;
            var prevHash = events[index - 1].hash;
            return event.prevHash === prevHash;
        }).length;
        if (l < events.length)
            return false;
        return true;
    };
    Protocol.prototype.signEvent = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var hash, protocol, publicKey, signature, created, eventSignature;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hash = event.hash;
                        protocol = this.name;
                        publicKey = this.publicKey;
                        return [4 /*yield*/, this.getEventSignature(event)];
                    case 1:
                        signature = _a.sent();
                        created = new Date();
                        eventSignature = { hash: hash, protocol: protocol, publicKey: publicKey, signature: signature, created: created };
                        event.sign(eventSignature);
                        return [2 /*return*/, event];
                }
            });
        });
    };
    Protocol.prototype.verifyEvent = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var signatures, verifiedEvents;
            return __generator(this, function (_a) {
                signatures = event.getSignatures(this.name);
                if (signatures.length === 0)
                    return [2 /*return*/, false];
                verifiedEvents = signatures.filter(function (signature) { return stringify(event) === signature; });
                return [2 /*return*/, verifiedEvents.length > 0];
            });
        });
    };
    Protocol.prototype.getEventSignature = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, event.stringify()];
            });
        });
    };
    return Protocol;
}());
exports.default = Protocol;

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
var Protocol_1 = require("./protocols/Protocol");
var Database_1 = require("./databases/Database");
var Nodes_1 = require("./nodes/Nodes");
var Treey = /** @class */ (function () {
    function Treey(config, observers) {
        this._protocol = new Protocol_1.default();
        this._database = new Database_1.default();
        this._nodes = new Nodes_1.default();
        this._observers = [];
        if (observers) {
            this.addObservers(observers);
        }
    }
    Object.defineProperty(Treey.prototype, "nodes", {
        get: function () { return this._nodes.nodes; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Treey.prototype, "root", {
        get: function () { return this._nodes.getRoot(this._protocol.name); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Treey.prototype, "tree", {
        get: function () { return this._nodes == null ? [] : this._nodes.toTree(this._protocol.name); },
        enumerable: true,
        configurable: true
    });
    Treey.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Promise.all([
                                this._database.init(),
                                this._protocol.init()
                            ])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.initNodesFromDatabase()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.error(err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Treey.prototype.addObservers = function (observers) {
        this._observers = this._observers.concat(observers);
        var lastIndex = this._observers.length - 1;
        if (typeof observers === "function" || observers.length === 1) {
            return lastIndex;
        }
        var arr = [];
        for (var i = lastIndex; i > lastIndex - observers.length; i--) {
            arr.unshift(i);
        }
        return arr;
    };
    Treey.prototype.removeObservers = function (index) {
        if (this._observers[index] == null)
            return;
        this._observers[index] = null;
    };
    Treey.prototype.callObservers = function () {
        this._observers.filter(function (f) { return f != null; }).forEach(function (f) { return f(); });
    };
    Treey.prototype.addEvents = function (events) {
        var _this = this;
        events = [].concat(events);
        // validate and verify
        // save to database
        events.forEach(function (event) {
            _this._database.addEvent(event);
            event.signatures.forEach(function (signature) {
                var eventSignature = Object.assign({}, signature, { hash: event.hash });
                _this._database.addSignature(eventSignature);
            });
        });
        // apply to nodes
        events.forEach(function (event) {
            if (event.prevHash == null) {
                _this._nodes.createNode(event);
            }
            else {
                var nodes = _this._nodes.getNodesByEventHash(event.prevHash);
                nodes.forEach(function (node) { return node.addEvents(event); });
            }
        });
        this.callObservers();
    };
    Treey.prototype.initNodesFromDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var genesisEvents;
            return __generator(this, function (_a) {
                this._nodes = new Nodes_1.default();
                genesisEvents = this._database.getGenesisEvents();
                genesisEvents.forEach(function (event) {
                    var events = _this._database.getEventChain(event.hash);
                    _this._nodes.createNode(events);
                });
                this.callObservers();
                return [2 /*return*/];
            });
        });
    };
    return Treey;
}());
exports.default = Treey;

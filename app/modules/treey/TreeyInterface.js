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
var Event_1 = require("./events/Event");
var NodeId_1 = require("./nodes/NodeId");
var is_1 = require("./lib/utils/is");
var TreeyData_1 = require("./TreeyData");
var TreeyInterface = /** @class */ (function (_super) {
    __extends(TreeyInterface, _super);
    function TreeyInterface(config, observers) {
        return _super.call(this, config, observers) || this;
    }
    TreeyInterface.prototype.add = function (parentId, id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var props, identityAddEvent, prevHash, dataAddProps, dataAddEvent, events, parentNode, prevHash_1, nodeId, linksAddEvent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        props = {};
                        if (id != null) {
                            props.id = id;
                        }
                        if (parentId == null && this._nodes.length === 0) {
                            props.isRoot = true;
                        }
                        return [4 /*yield*/, this._protocol.createAndSignEvent(Event_1.EventType.identityAdd, null, props)];
                    case 1:
                        identityAddEvent = _a.sent();
                        prevHash = identityAddEvent.hash;
                        dataAddProps = data != null ? { data: data } : { key: 'text', value: id };
                        return [4 /*yield*/, this._protocol.createAndSignEvent(Event_1.EventType.dataAdd, prevHash, dataAddProps)];
                    case 2:
                        dataAddEvent = _a.sent();
                        events = [identityAddEvent, dataAddEvent];
                        if (!(parentId != null)) return [3 /*break*/, 4];
                        parentNode = this._nodes.getNodeById(parentId);
                        if (!(parentNode != null)) return [3 /*break*/, 4];
                        prevHash_1 = parentNode.getLastEventHash();
                        nodeId = new NodeId_1.default(this._protocol.name, identityAddEvent.props.id);
                        return [4 /*yield*/, this._protocol.createAndSignEvent(Event_1.EventType.linksAdd, prevHash_1, { link: nodeId.string })];
                    case 3:
                        linksAddEvent = _a.sent();
                        events.push(linksAddEvent);
                        _a.label = 4;
                    case 4:
                        this.addEvents(events);
                        return [2 /*return*/, events];
                }
            });
        });
    };
    TreeyInterface.prototype.update = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var node, prevHash, props, dataAddEvent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        node = this._nodes.getNodeById(id);
                        // guard against non existing node
                        if (node == null)
                            throw "Non existing node";
                        prevHash = node.getLastEventHash();
                        props = is_1.isString(data) ? { key: 'text', value: data } : { data: data };
                        return [4 /*yield*/, this._protocol.createAndSignEvent(Event_1.EventType.dataAdd, prevHash, props)];
                    case 1:
                        dataAddEvent = _a.sent();
                        this.addEvents(dataAddEvent);
                        return [2 /*return*/, [dataAddEvent]];
                }
            });
        });
    };
    TreeyInterface.prototype.remove = function (parentId, id) {
        return __awaiter(this, void 0, void 0, function () {
            var parentNode, parents, prevHash, linksRemoveEvent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (parentId != null) {
                            parentNode = this._nodes.getNodeById(parentId);
                        }
                        else {
                            parents = this._nodes.getParentsOfNodeId(id);
                            if (parents.length > 0) {
                                parentNode = parents[0];
                            }
                        }
                        // guard against non existing parent
                        if (parentNode == null)
                            throw "Non existing parent node";
                        prevHash = parentNode.getLastEventHash();
                        return [4 /*yield*/, this._protocol.createAndSignEvent(Event_1.EventType.linksRemove, prevHash, { link: id })];
                    case 1:
                        linksRemoveEvent = _a.sent();
                        this.addEvents(linksRemoveEvent);
                        return [2 /*return*/, [linksRemoveEvent]];
                }
            });
        });
    };
    TreeyInterface.prototype.move = function (newParentId, id) {
        return __awaiter(this, void 0, void 0, function () {
            var parents, parentNode, newParentNode, parentPrevHash, linksRemoveEvent, newParentPrevHash, linksAddEvent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parents = this._nodes.getParentsOfNodeId(id);
                        // guard against non existing parent
                        if (parents.length === 0)
                            throw "Non existing parent node";
                        parentNode = parents[0];
                        newParentNode = this._nodes.getNodeById(newParentId);
                        // guard against non existing new parent node
                        if (newParentNode == null)
                            throw "Non existing new parent node";
                        parentPrevHash = parentNode.getLastEventHash();
                        return [4 /*yield*/, this._protocol.createAndSignEvent(Event_1.EventType.linksRemove, parentPrevHash, { link: id })
                            // LINKS_ADD event
                        ];
                    case 1:
                        linksRemoveEvent = _a.sent();
                        newParentPrevHash = newParentNode.getLastEventHash();
                        return [4 /*yield*/, this._protocol.createAndSignEvent(Event_1.EventType.linksAdd, newParentPrevHash, { link: id })
                            // add events
                        ];
                    case 2:
                        linksAddEvent = _a.sent();
                        // add events
                        this.addEvents([linksRemoveEvent, linksAddEvent]);
                        return [2 /*return*/, [linksRemoveEvent, linksAddEvent]];
                }
            });
        });
    };
    return TreeyInterface;
}(TreeyData_1.default));
exports.default = TreeyInterface;

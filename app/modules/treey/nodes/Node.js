"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NodeId_1 = require("./NodeId");
var Event_1 = require("../events/Event");
var objectPath = require("object-path");
var Node = /** @class */ (function () {
    function Node(events) {
        this.isRootForProtocol = [];
        this.events = events;
        this.build();
    }
    Node.prototype.build = function () {
        this.clear();
        this.buildFromEvents();
    };
    Node.prototype.clear = function () {
        this.ids = [];
        this.links = [];
        this.data = {};
    };
    Node.prototype.buildFromEvents = function () {
        var _this = this;
        this.events.forEach(function (event) { return _this.applyEvent(event); });
    };
    Node.prototype.applyEvent = function (event) {
        var _this = this;
        switch (event.type) {
            case Event_1.EventType.identityAdd: {
                var identityAddEvent = event;
                var _a = identityAddEvent.props, id_1 = _a.id, isRoot_1 = _a.isRoot;
                if (identityAddEvent.signatures.length === 0) {
                    var nodeId = new NodeId_1.default(null, id_1);
                    this.ids.push(nodeId.string);
                }
                else {
                    identityAddEvent.signatures.forEach(function (signature) {
                        var nodeId = new NodeId_1.default(signature.protocol, id_1);
                        _this.ids.push(nodeId.string);
                        if (isRoot_1 === true) {
                            _this.isRootForProtocol.push(signature.protocol);
                        }
                    });
                }
                break;
            }
            case Event_1.EventType.identityRemove: {
                var identityRemoveEvent = event;
                var id_2 = identityRemoveEvent.props.id;
                identityRemoveEvent.signatures.forEach(function (signature) {
                    var nodeId = new NodeId_1.default(signature.protocol, id_2);
                    var index = _this.ids.findIndex(function (id) { return id === nodeId.string; });
                    if (index > -1) {
                        _this.ids.splice(index, 1);
                    }
                });
                break;
            }
            case Event_1.EventType.dataAdd: {
                var dataAddEvent = event;
                var keyValues = dataAddEvent.keyValues;
                keyValues.forEach(function (keyValue) { return objectPath.set(_this.data, keyValue.key, keyValue.value); });
                break;
            }
            case Event_1.EventType.dataRemove: {
                var dataRemoveEvent = event;
                var keys = dataRemoveEvent.keys;
                keys.forEach(function (key) { return objectPath.del(_this.data, key); });
                break;
            }
            case Event_1.EventType.linksAdd: {
                var linksAddEvent = event;
                var _b = linksAddEvent.props, link = _b.link, index = _b.index;
                if (index != null) {
                    this.links.splice(index, 0, link);
                }
                else {
                    this.links.push(link);
                }
                break;
            }
            case Event_1.EventType.linksRemove: {
                var linksRemoveEvent = event;
                var index = linksRemoveEvent.props ? linksRemoveEvent.props.index : null;
                if (index != null) {
                    this.links.splice(index, 1);
                }
                else {
                    this.links.pop();
                }
                break;
            }
        }
    };
    Node.prototype.addEvents = function (events) {
        var _this = this;
        // @LINK: https://stackoverflow.com/questions/35749833/typescript-function-taking-one-or-array-of-objects
        events = [].concat(events);
        this.events = this.events.concat(events);
        events.forEach(function (event) { return _this.applyEvent(event); });
    };
    Node.prototype.getLastEventHash = function () {
        var length = this.events.length;
        return length > 0 ? this.events[length - 1].hash : null;
    };
    return Node;
}());
exports.default = Node;

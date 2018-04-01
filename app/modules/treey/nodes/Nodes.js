"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Node_1 = require("./Node");
var clone_1 = require("../lib/utils/clone");
var Nodes = /** @class */ (function () {
    function Nodes() {
        this.nodes = [];
    }
    Object.defineProperty(Nodes.prototype, "length", {
        get: function () { return this.nodes.length; },
        enumerable: true,
        configurable: true
    });
    Nodes.prototype.createNode = function (events) {
        events = [].concat(events);
        var node = new Node_1.default(events);
        this.nodes.push(node);
        return node;
    };
    Nodes.prototype.getRoot = function (protocol) {
        return this.nodes.find(function (node) { return node.isRootForProtocol.includes(protocol); });
    };
    Nodes.prototype.getNodeById = function (string) {
        return this.nodes.find(function (node) { return node.ids.includes(string); });
    };
    Nodes.prototype.getNodesByEventHash = function (hash) {
        return this.nodes.filter(function (node) { return node.events.find(function (event) { return event.hash === hash; }); });
    };
    Nodes.prototype.getParentsOfNodeId = function (string) {
        return this.nodes.filter(function (node) { return node.links.includes(string); });
    };
    Nodes.prototype.toTree = function (protocol) {
        var node = this.getRoot(protocol);
        // guard against non existing node
        if (node == null)
            return null;
        return [this.toTreeNode(node)];
    };
    Nodes.prototype.toTreeNode = function (node) {
        var _this = this;
        var n = clone_1.default(node);
        n.links = n.links
            .map(function (link) {
            var node = _this.getNodeById(link);
            if (node == null)
                return null;
            return _this.toTreeNode(node);
        })
            .filter(function (link) { return link != null; });
        return n;
    };
    return Nodes;
}());
exports.default = Nodes;

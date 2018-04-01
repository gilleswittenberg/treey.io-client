"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Protocol_1 = require("../protocols/Protocol");
var NodeId = /** @class */ (function () {
    function NodeId(protocol, id, string) {
        if (protocol != null) {
            this.protocol = protocol;
        }
        if (id != null) {
            this.id = id;
            this.string = this.getNodeIdString();
        }
        if (string != null) {
            this.string = string;
            this.parse(this.string);
        }
    }
    NodeId.prototype.getNodeIdString = function () {
        var protocolString = "";
        switch (this.protocol) {
            case Protocol_1.ProtocolName.self:
            case Protocol_1.ProtocolName.browser:
                protocolString = "%";
                break;
            case Protocol_1.ProtocolName.treey:
                protocolString = "%treey";
                break;
        }
        var idString = "@" + this.id;
        return protocolString + idString;
    };
    NodeId.prototype.parse = function (string) {
        var regex = /(%([a-zA-Z]+))?@([a-zA-Z]+)/;
        var matches = string.match(regex);
        // guard against invalid string
        if (matches == null)
            return false;
        // parse protocol, id
        var protocolString = matches[2];
        var protocol = Protocol_1.ProtocolName.null;
        switch (protocolString) {
            case undefined:
                if (string[0] === "%") {
                    protocol = Protocol_1.ProtocolName.self;
                }
                break;
            case "treey":
                protocol = Protocol_1.ProtocolName.treey;
                break;
        }
        this.protocol = protocol;
        var id = matches[3];
        this.id = id;
        return true;
    };
    return NodeId;
}());
exports.default = NodeId;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Event_1 = require("../events/Event");
var IdentityAddEvent_1 = require("../events/IdentityAddEvent");
var IdentityRemoveEvent_1 = require("../events/IdentityRemoveEvent");
var DataAddEvent_1 = require("../events/DataAddEvent");
var DataRemoveEvent_1 = require("../events/DataRemoveEvent");
var LinksAddEvent_1 = require("../events/LinksAddEvent");
var LinksRemoveEvent_1 = require("../events/LinksRemoveEvent");
var createEvent = function (type, prevHash, props) {
    switch (type) {
        case Event_1.EventType.identityAdd:
            return new IdentityAddEvent_1.default(prevHash, props);
        case Event_1.EventType.identityRemove:
            return new IdentityRemoveEvent_1.default(prevHash, props);
        case Event_1.EventType.dataAdd:
            return new DataAddEvent_1.default(prevHash, props);
        case Event_1.EventType.dataRemove:
            return new DataRemoveEvent_1.default(prevHash, props);
        case Event_1.EventType.linksAdd:
            return new LinksAddEvent_1.default(prevHash, props);
        case Event_1.EventType.linksRemove:
            return new LinksRemoveEvent_1.default(prevHash, props);
        default:
            return null;
    }
};
exports.default = createEvent;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
exports.default = clone;

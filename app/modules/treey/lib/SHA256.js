"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
exports.default = function (str) { return crypto.createHash("sha256").update(str, "utf8").digest("hex"); };

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
var Database_1 = require("./Database");
var DatabaseIndexedDB = /** @class */ (function (_super) {
    __extends(DatabaseIndexedDB, _super);
    function DatabaseIndexedDB() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DatabaseIndexedDB.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.initIndexedDB()];
                    case 1:
                        _a.db = (_b.sent());
                        return [4 /*yield*/, this.read()];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DatabaseIndexedDB.prototype.initIndexedDB = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        /*
                        window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
                        window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || { READ_WRITE: "readwrite" }
                        window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
                        */
                        if (!window.indexedDB) {
                            reject("IndexedDB not supported");
                        }
                        var request = window.indexedDB.open("Treey", 1);
                        request.onerror = function (event) {
                            console.error("request.onerror", event);
                            reject(event);
                        };
                        request.onsuccess = function (event) {
                            console.log("request.onsuccess", event);
                            var request = event.target;
                            var db = request.result;
                            db.onerror = function (event) {
                                console.error("db.onerror", event);
                                reject(event);
                            };
                            resolve(db);
                        };
                        request.onupgradeneeded = function (event) {
                            console.log("request.onupgradeneeded", event);
                            if (event.oldVersion < 1) {
                                var request_1 = event.target;
                                var db = request_1.result;
                                // events
                                var eventsObjectStore = db.createObjectStore("events", { autoIncrement: true });
                                eventsObjectStore.createIndex("hash", "hash", { unique: true });
                                // signatures
                                var signaturesObjectStore = db.createObjectStore("signatures", { autoIncrement: true });
                                signaturesObjectStore.createIndex("hash", "hash", { unique: false });
                                signaturesObjectStore.createIndex("protocol", "protocol", { unique: false });
                            }
                        };
                    })];
            });
        });
    };
    DatabaseIndexedDB.prototype.read = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var signatures, events;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.readSignatures()];
                    case 1:
                        signatures = _a.sent();
                        signatures.forEach(function (signature) { return _super.prototype.addSignature.call(_this, signature); });
                        return [4 /*yield*/, this.readEvents()];
                    case 2:
                        events = _a.sent();
                        events.map(function (event) { return event.signatures = _this.signatures.filter(function (signature) { return signature.hash === event.hash; }); });
                        events.forEach(function (event) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, _super.prototype.addEvent.call(this, event)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); });
                        return [2 /*return*/];
                }
            });
        });
    };
    DatabaseIndexedDB.prototype.readEvents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var transaction = _this.db.transaction(["events"], "readonly");
                        var objectStore = transaction.objectStore("events");
                        var eventObjects = [];
                        objectStore.openCursor().onsuccess = function (event) {
                            var request = event.target;
                            var cursor = request.result;
                            if (cursor) {
                                eventObjects.push(cursor.value);
                                cursor.continue();
                            }
                            else {
                                var events = _this.createEvents(eventObjects);
                                resolve(events);
                            }
                        };
                    })];
            });
        });
    };
    DatabaseIndexedDB.prototype.readSignatures = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var transaction = _this.db.transaction(["signatures"], "readonly");
                        var objectStore = transaction.objectStore("signatures");
                        var signatures = [];
                        objectStore.openCursor().onsuccess = function (event) {
                            var request = event.target;
                            var cursor = request.result;
                            if (cursor) {
                                signatures.push(cursor.value);
                                cursor.continue();
                            }
                            else {
                                resolve(signatures);
                            }
                        };
                    })];
            });
        });
    };
    DatabaseIndexedDB.prototype.addEvent = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var added;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.addEvent.call(this, event)];
                    case 1:
                        added = _a.sent();
                        if (added === false)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, this.writeEvent(event)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    DatabaseIndexedDB.prototype.addSignature = function (signature) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _super.prototype.addSignature.call(this, signature);
                        return [4 /*yield*/, this.writeSignature(signature)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    DatabaseIndexedDB.prototype.writeEvent = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var transaction = _this.db.transaction(["events"], "readwrite");
                        transaction.oncomplete = function (event) {
                            console.log("writeEvent transaction.oncomplete", event);
                        };
                        transaction.onerror = function (event) {
                            console.error("writeEvent transaction.onerror", event);
                            reject();
                        };
                        var objectStore = transaction.objectStore("events");
                        var request = objectStore.add(event);
                        request.onsuccess = function (event) {
                            console.log("writeEvent request.onsuccess", event);
                            resolve();
                        };
                    })];
            });
        });
    };
    DatabaseIndexedDB.prototype.writeSignature = function (signature) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var transaction = _this.db.transaction(["signatures"], "readwrite");
                        transaction.oncomplete = function (event) {
                            console.log("writeSignature transaction.oncomplete", event);
                        };
                        transaction.onerror = function (event) {
                            console.error("writeSignature transaction.onerror", event);
                            reject();
                        };
                        var objectStore = transaction.objectStore("signatures");
                        var request = objectStore.add(signature);
                        request.onsuccess = function (event) {
                            console.log("writeSignature request.onsuccess", event);
                            resolve();
                        };
                    })];
            });
        });
    };
    return DatabaseIndexedDB;
}(Database_1.default));
exports.default = DatabaseIndexedDB;

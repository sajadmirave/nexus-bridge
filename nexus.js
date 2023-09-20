"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NexusBridge = void 0;
require("dotenv/config");
var fs = require("fs");
var path = require("path");
var cookie = require("cookie");
// const __dirname = path.dirname(new URL(import.meta.url).pathname);
var NexusBridge = /** @class */ (function () {
    function NexusBridge() {
        this.path = 'storage/session';
        this.secret = process.env.NEXUS_BRIDGE_SECRET;
        this.IdLength = 8;
        this.setCookieHeader = 'Set-Cookie'; //save sessionId in http only cookie
        this.session = new Map();
    }
    NexusBridge.prototype.createStructure = function () {
        var directoryPath = path.join(__dirname, this.path);
        if (!fs.existsSync(directoryPath)) {
            // Create the directory and any missing parent directories (recursively)
            fs.mkdirSync(directoryPath, { recursive: true });
        }
    };
    // session id length
    NexusBridge.prototype.init = function () {
        this.createStructure();
    };
    NexusBridge.prototype.generateSessionId = function () {
        var char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxys1234567890";
        var result = '';
        for (var i = 0; i < this.IdLength; i++) {
            var random = Math.floor(Math.random() * char.length);
            result += char[random];
        }
        return result;
    };
    NexusBridge.prototype.checkExistsSession = function (key) {
        var existsSession = this.session.get(key);
        if (existsSession !== undefined && fs.existsSync(path.join(__dirname, this.path, existsSession))) {
            return true;
        }
        return false;
    };
    /**
     * @param key
     * @param value
     * @param response
     * @returns
     */
    NexusBridge.prototype.set = function (key, value, response) {
        if (this.checkExistsSession(key))
            return;
        var sessionId = this.generateSessionId();
        var sessionFilePath = path.join(__dirname, this.path, sessionId);
        this.createStructure();
        fs.writeFileSync(sessionFilePath, JSON.stringify(value), 'utf-8');
        // save session id in cookie
        var cookies = cookie.serialize(key, sessionId, {
            maxAge: 7 * 24 * 60 * 60,
            httpOnly: true,
            path: '/', // The path for which the cookie is valid (root path)
        });
        this.session.set(key, sessionId);
        return response.setHeader(this.setCookieHeader, cookies);
    };
    NexusBridge.prototype.get = function (key, request) {
        var cookies = cookie.parse(request.headers.cookie || '');
        var sessionId = cookies[key];
        var data = fs.readFileSync(path.join(__dirname, this.path, sessionId), 'utf-8');
        return data;
    };
    return NexusBridge;
}());
exports.NexusBridge = NexusBridge;

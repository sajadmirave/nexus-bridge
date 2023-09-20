"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NexusBridge = void 0;
require("dotenv/config");
var fs = require("fs");
var path = require("path");
var cookie = require("cookie");
var NexusBridge = /** @class */ (function () {
    function NexusBridge(options) {
        if (options === void 0) { options = {}; }
        /**
         * session saved path
         * @type {string}
         */
        this.path = 'storage/session';
        /**
         * session secret
         * @type {string}
         */
        this.secret = process.env.NEXUS_BRIDGE_SECRET;
        // ---------------------------------
        /**
         * set header for create cookie
         * @type {header}
         */
        this.setCookieHeader = 'Set-Cookie'; //save sessionId in http only cookie
        /**
         * save session id in here
         * @type {Map}
         */
        this.session = new Map();
        this.createStructure();
        this.IdLength = options.sessionIdLength !== undefined ? options.sessionIdLength : 8;
    }
    /**
     * Create folder structure to save session
     *
     * @returns {File} - Create folder
     */
    NexusBridge.prototype.createStructure = function () {
        var directoryPath = path.join(__dirname, this.path);
        if (!fs.existsSync(directoryPath)) {
            // Create the directory and any missing parent directories (recursively)
            fs.mkdirSync(directoryPath, { recursive: true });
        }
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
    /**
     * check session is exists or not
     *
     * @param {string} key - The key to check for a session
     * @returns {boolean} - True if a session exists, false otherwaise
     * @throws {Error} - Throws an error when the session check fails and `err` is true.
     */
    NexusBridge.prototype.checkExistsSession = function (key) {
        var existsSession = this.session.get(key);
        if (existsSession !== undefined && fs.existsSync(path.join(__dirname, this.path, existsSession))) {
            return true;
        }
        return false;
    };
    /**
     * get session data
     *
     * @param {string} key
     * @param {any} value
     * @param {Response} response
     * @returns {Headers} - Save sessionId in http only cookie
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
    /**
     *
     * @param {string} key
     * @param {Request} request
     * @returns {data} - Return session data
     */
    NexusBridge.prototype.get = function (key, request) {
        var cookies = cookie.parse(request.headers.cookie || '');
        var sessionId = cookies[key];
        var data = fs.readFileSync(path.join(__dirname, this.path, sessionId), 'utf-8');
        return data;
    };
    return NexusBridge;
}());
exports.NexusBridge = NexusBridge;

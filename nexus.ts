import "dotenv/config"
import * as fs from "fs";
import * as path from "path";
import * as cookie from "cookie"
import * as http from "http"


interface InitOptions {
    /**
     * set length for session id
     * 
     * @type {number}
     */
    sessionIdLength?: number;
}

class NexusBridge {
    /**
     * session saved path
     * @type {string}
     */
    private path = 'storage/session'

    /**
     * session secret
     * @type {string}
     */
    private secret = process.env.NEXUS_BRIDGE_SECRET

    /**
     * sessionId length
     * @type {number}
     */
    private IdLength: number;

    // ---------------------------------
    /**
     * set header for create cookie 
     * @type {header}
     */
    private setCookieHeader: string = 'Set-Cookie' //save sessionId in http only cookie

    /**
     * save session id in here
     * @type {Map}
     */
    private session = new Map()

    /**
     * save flash
     * @type {Map}
     */
    private flashStorage = new Map()

    constructor(options: InitOptions = {}) {
        this.createStructure()

        // options
        this.IdLength = options.sessionIdLength !== undefined ? options.sessionIdLength : 8
    }

    /**
     * Create folder structure to save session
     * 
     * @returns {File} - Create folder
     */
    private createStructure() {
        const directoryPath = path.join(__dirname, this.path)

        if (!fs.existsSync(directoryPath)) {
            // Create the directory and any missing parent directories (recursively)
            fs.mkdirSync(directoryPath, { recursive: true });
        }
    }

    private generateSessionId() {
        const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxys1234567890"
        let result = '';

        for (let i = 0; i < this.IdLength; i++) {
            const random = Math.floor(Math.random() * char.length)
            result += char[random]
        }

        return result
    }

    /**
     * check session is exists or not
     * 
     * @param {string} key - The key to check for a session 
     * @returns {boolean} - True if a session exists, false otherwaise
     * @throws {Error} - Throws an error when the session check fails and `err` is true. 
     */
    private checkExistsSession(key: string): boolean {
        let existsSession = this.session.get(key)
        if (existsSession !== undefined && fs.existsSync(path.join(__dirname, this.path, existsSession))) {
            return true
        }

        return false
    }

    /**
     * get session data
     * 
     * @param {string} key
     * @param {any} value
     * @param {Response} response 
     * @returns {Headers} - Save sessionId in http only cookie
     */
    public set(key: string, value: string, response: http.ServerResponse) {
        if (this.checkExistsSession(key)) return;

        const sessionId = this.generateSessionId()
        const sessionFilePath = path.join(__dirname, this.path, sessionId)

        this.createStructure()

        fs.writeFileSync(sessionFilePath, JSON.stringify(value), 'utf-8')

        // save session id in cookie
        const cookies = cookie.serialize(key, sessionId, {
            maxAge: 7 * 24 * 60 * 60, // Expires in 7 days
            httpOnly: true, // Makes the cookie accessible only through HTTP (not JavaScript)
            path: '/', // The path for which the cookie is valid (root path)
        });

        this.session.set(key, sessionId)
        return response.setHeader(this.setCookieHeader, cookies)
    }

    /**
     * 
     * @param {string} key 
     * @param {Request} request 
     * @returns {data} - Return session data
     */
    public get(key: string, request: http.IncomingMessage) {
        const cookies = cookie.parse(request.headers.cookie || '');
        const sessionId = cookies[key];

        const data = fs.readFileSync(path.join(__dirname, this.path, sessionId), 'utf-8')
        return data;
    }

    // 
    private createFlash(key: string, value: any) {
        return this.flashStorage.set(key, value)
    }

    private getFlash(key: string) {
        return this.flashStorage.get(key)
    }

    public flash(key: string, value: any) {
        key && value ? this.createFlash(key, value) : this.getFlash(key);
    }
}

export { NexusBridge }
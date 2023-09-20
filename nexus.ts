import "dotenv/config"
import * as fs from "fs";
import * as path from "path";
import * as cookie from "cookie"
import * as http from "http"

// const __dirname = path.dirname(new URL(import.meta.url).pathname);
class NexusBridge {
    private path = 'storage/session'
    private secret = process.env.NEXUS_BRIDGE_SECRET
    private IdLength = 8
    private setCookieHeader: string = 'Set-Cookie' //save sessionId in http only cookie
    private session = new Map()

    private createStructure() {
        const directoryPath = path.join(__dirname, this.path)

        if (!fs.existsSync(directoryPath)) {
            // Create the directory and any missing parent directories (recursively)
            fs.mkdirSync(directoryPath, { recursive: true });
        }
    }

    // session id length
    public init() {
        this.createStructure()
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

    private checkExistsSession(key: string): boolean {
        let existsSession = this.session.get(key)
        if (existsSession !== undefined && fs.existsSync(path.join(__dirname, this.path, existsSession))) {
            return true
        }

        return false
    }

    /**
     * @param key
     * @param value
     * @param response 
     * @returns 
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

    public get(key: string, request: http.IncomingMessage) {
        const cookies = cookie.parse(request.headers.cookie || '');
        const sessionId = cookies[key];

        const data = fs.readFileSync(path.join(__dirname,this.path,sessionId),'utf-8')
        return data;
    }
}

export { NexusBridge }
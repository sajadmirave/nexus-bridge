const fs = require("fs")
require("dotenv/config") //read env file
const path = require('path')
// http only
// encryption
// root 13
// secret key
// header
// nexus bridge

class Session {
    constructor(app) {
        // this.app = app
        this.session = new Map()
        this.path = 'storage/session'
        this.secret = process.env.SESSION_SECRET
        this.app = app


    }

    init() {
        // options: write in file, securty, cookie, secret, write in memory

        // create session folder
        if (!fs.existsSync('storage'))
            fs.mkdirSync('storage')

        if (!fs.existsSync(this.path))
            fs.mkdirSync('storage/session')

        const cookieParser = require("cookie-parser")
        this.app.use(cookieParser())
    }

    // generate session id
    generateID() {
        const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxys1234567890"
        let len = 8
        let result = '';

        for (let i = 0; i < len; i++) {
            const random = Math.floor(Math.random() * char.length)
            result += char[random]
        }

        return result
    }

    storeInCookie(res, key, sessionID) {
        return res.cookie(key, sessionID)
    }

    create(key, value, response, request) {
        // check key, if key is exits then not created new session. just return
        if (request.cookies && request.cookies[key]) {
            // Key already exists, return without creating a new session
            if (fs.existsSync(path.join(this.path, request.cookies[key]))) {
                // the session is exists and dont create new one...
                return
            }
        }

        const sessionID = this.generateID();
        const sessionFilePath = path.join(this.path, sessionID);

        // Ensure the directory exists
        const dirPath = path.dirname(sessionFilePath);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true }); // Create the directory and any missing parent directories
        }

        // save key and session id in cookie, and when user is get session then send key 
        // store key and session id in cookie
        this.storeInCookie(response, key, sessionID)

        // set seestion
        this.session.set(sessionID, value)
        fs.writeFileSync(sessionFilePath, JSON.stringify(value), 'utf-8')

        //set session id in http only cookie
        return sessionID
    }

    checkSecret(secret) {
        if (this.secret != secret) {
            return 0
        }

        return 1
    }

    // {lang:"2313"}
    getFromCookie(req, key) {
        let cookie = req.cookies
        return cookie
    }

    // get(sessionID, secret, req) {
    //     // check secret
    //     let result = this.checkSecret(secret)
    //     if (result != 1) return 'invalid secret'

    //     this.path += `/${sessionID}`
    //     if (!fs.existsSync(this.path)) {
    //         return "Invalid Session Id"
    //     }

    //     const session = fs.readFileSync(this.path, 'utf-8')
    //     // return session;
    //     return this.getFromCookie(req)
    // }
    get(key, secret, request) {
        const sessionID = this.getFromCookie(request, key)
        return sessionID
        // this.path += `/${sessionID}`
        // if (!fs.existsSync(this.path)) {
        //     return "Invalid Session Id"
        // }

        // const session = fs.readFileSync(this.path, 'utf-8')
        // return session;
    }

    remove(sessionID) {
        this.path += `/${sessionID}`

        if (fs.existsSync(this.path)) {
            fs.unlinkSync(this.path)
            return "session cleared"
        }

        return "invalid session id"
    }
}


module.exports = { Session }
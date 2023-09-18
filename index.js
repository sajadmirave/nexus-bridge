const fs = require("fs")
require("dotenv/config") //read env file
const { response } = require("express")
// http only
// encryption
// root 13
// secret key
// header
// nexus bridge

class Session {
    constructor() {
        // this.app = app
        this.session = new Map()
        this.path = 'storage/session'
        this.secret = process.env.SESSION_SECRET
    }

    init() {
        // options: write in file, securty, cookie, secret, write in memory

        // create session folder
        if (!fs.existsSync('storage'))
            fs.mkdirSync('storage')

        if (!fs.existsSync(this.path))
            fs.mkdirSync('storage/session')
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

    create(key, value, response) {
        const sessionID = this.generateID()
        this.path += `/${sessionID}`
        // save key and session id in cookie, and when user is get session then send key 
        // store key and session id in cookie
        // response.cookie('sessionid', sessionID)
        this.storeInCookie(response, key, sessionID)

        // set seestion
        this.session.set(sessionID, value)
        fs.writeFileSync(this.path, JSON.stringify(value), 'utf-8')

        //set session id in http only cookie
        return sessionID
    }

    checkSecret(secret) {
        if (this.secret != secret) {
            return 0
        }

        return 1
    }

    get(sessionID, secret) {
        // check secret
        let result = this.checkSecret(secret)
        if (result != 1) return 'invalid secret'

        this.path += `/${sessionID}`
        if (!fs.existsSync(this.path)) {
            return "Invalid Session Id"
        }

        const session = fs.readFileSync(this.path, 'utf-8')
        return session;
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
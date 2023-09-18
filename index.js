const fs = require("fs")
// http only
// encryption
// root 13
// secret key
// header
// nexus bridge

class Session {
    constructor() {

        this.session = new Map()
        this.path = 'storage/session'
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

    create(content) {
        const sessionID = this.generateID()
        this.path += `/${sessionID}`

        // set seestion
        this.session.set(sessionID, content)
        fs.writeFileSync(this.path, content, 'utf-8')

        //set session id in http only cookie
        return sessionID
    }

    get(sessionID) {
        const session = fs.readFileSync(`${sessionID}`, 'utf-8')
        return session;
    }

    remove(sessionID) {

    }
}


const mysession = new Session()
mysession.init()
mysession.create('hello world')
console.log(mysession.get("drnglnu1"))



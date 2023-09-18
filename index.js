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

        // set seestion
        this.session.set(sessionID, content)
        fs.writeFileSync(`${sessionID}`, content, 'utf-8')

        //set session id in http only cookie
        return sessionID
    }

    get(sessionID) {
        const session = fs.readFileSync(`${sessionID}`, 'utf-8')
        return session;
    }

    remove(sessionID){

    }
}

const mysession = new Session()
// mysession.create('meow')
console.log(mysession.get("drnglnu1"))



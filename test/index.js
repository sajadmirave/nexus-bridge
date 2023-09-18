const express = require("express")
const app = express()

const { Session } = require('../index')
const nexus = new Session(app)
nexus.init()

app.get("/", (req, res) => {
    // session.create("language", "python", res)
    nexus.create('lang', 'javascript', res, req)
    // console.log(nexus.get("",'',req))
    res.send("meow🐾")
})

app.listen(3000, () => console.log("server is running on port 3000"))
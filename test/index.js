const express = require("express")
const app = express()
// const { myRoute } = require("./se")

// Usage in another file
// const { myRoute } = require('./se');
// myRoute(app);
const { Session } = require("../index")
const session = new Session(app)
session.init()

app.get("/", (req, res) => {
    session.create("language", "python", res)
    res.send("Hello World :D")
})

app.listen(3000, () => console.log("server is running on port 3000"))
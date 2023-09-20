const express = require("express")
const app = express()

// var cookie = require('cookie');
const { NexusBridge } = require('../nexus')
const nexus = new NexusBridge({
    sessionIdLength: 30
})

app.get("/", (req, res) => {
    nexus.set('cat', 'meow', res)
    console.log(nexus.get('cat', req))
    res.send("meow🐾")
})

app.listen(3000, () => console.log("server is running on port 3000"))
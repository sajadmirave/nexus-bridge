# Nexus Bridge
![](public/logo.png)

open source library for creating file system session

### Instalation

```bash
npm i nexus-bridge
```

### Useage
-----
### set session
- import pakage
- use nexus as object
```js
const { Nexus } = require('nexus-bridge')
const nexus = new Nexus()
```

- nexus configiration
change sessionId length
```js
const nexus = new Nexus({
    sessionIdLength: 13 //defualt is 8
})
```
- set new session
```js
nexus.set(key,value,response)
```

create simple session:
```js
const express = require('express')
const app = express()
const nexus = require("nexus-bridge")

// use nexus as object
const nexus = new Nexus({
    sessionIdLength:13
})

app.get('/',(req,res)=>{
    //create new session with nexus
    nexus.set('cat','meow',res)

    res.send("Hello From Server :D")
})

app.listen(3000,()=>{
    console.log('app is running on port 3000')
})
```

---
### get session
- using get method
```js
nexus.get(key,request)
```

get session:
```js
const express = require('express')
const app = express()
const nexus = require("nexus-bridge")

// use nexus as object
const nexus = new Nexus({
    sessionIdLength:13
})

app.get('/',(req,res)=>{
    //create new session with nexus
    nexus.get('cat',req)

    res.send("Hello From Server :D")
})

app.listen(3000,()=>{
    console.log('app is running on port 3000')
})
```
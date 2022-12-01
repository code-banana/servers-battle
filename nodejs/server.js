const express = require('express')
const app = express()
const port = 8080
let kvStore = {}

app.get('/isAlive', (req, res) => {
    res.send("Boss is always fine: Nodejs")
})

app.get('/find', (req, res) => {
    key = req.query.key
    if(kvStore[key] == null) {
        res.status(400).send("Error! key is not correct")
        return;
    }
    res.send(kvStore[key])
})

app.get('/insert', (req, res) => {
    key = req.query.key
    value = req.query.value
    if(value == null) {
        res.status(400).send("Error! value is not correct")
        return;
    }
    kvStore[key] =  value
    res.send(kvStore[key])
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
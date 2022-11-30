const express = require('express')
const app = express()
const port = 8080
let dict = {}
app.get('/find', (req, res) => {
    key = req.query.key
    if(dict[key] == null) {
        res.status(400).send("Error! key is not correct")
        return;
    }
    res.send(dict[key])
})

app.get('/insert', (req, res) => {
    key = req.query.key
    value = req.query.value
    if(value == null) {
        res.status(400).send("Error! value is not correct")
        return;
    }
    dict[key] =  value
    res.send(dict[key])
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
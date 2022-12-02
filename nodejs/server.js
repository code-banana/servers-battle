const express = require('express')
const client = require('prom-client')
const app = express()
const port = 8080
let kvStore = {}

const register = new client.Registry();

client.collectDefaultMetrics({
    app: 'node-application-monitoring-app',
    prefix: 'node_',
    timeout: 10000,
    gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
    register
});

const httpRequestTimer = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2,5,10]
  });

register.registerMetric(httpRequestTimer);


app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
  });

app.get('/isAlive', (req, res) => {
    res.send("Boss is always fine: Nodejs")
})

app.get('/find', (req, res) => {
    const end = httpRequestTimer.startTimer();
    const route = req.route.path;
    key = req.query.key
    if(kvStore[key] == null) {
        res.status(400).send("Error! key is not correct")
    } else {
        res.send(kvStore[key])
    }
    end({ route, code: res.statusCode, method: req.method });
})

app.get('/insert', (req, res) => {
    const end = httpRequestTimer.startTimer();
    const route = req.route.path;
    key = req.query.key
    value = req.query.value
    if(value == null) {
        res.status(400).send("Error! value is not correct")
    } else {
        kvStore[key] =  value
        res.send(kvStore[key])
    }
    end({ route, code: res.statusCode, method: req.method });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
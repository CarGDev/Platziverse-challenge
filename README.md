# Project platziverse
---
## platziverse-db

### `Usage`

``` js
const setupDataBase = require('platziverse-challenge')

setupDataBase(config).then(db => {
  const { Agent, Metric } = db
}).catch(err => console.error(err))

```
---
### Platziverse-mqtt

### `agent/connected`

``` js
{
  agent: {
    uuid, // auto generated
    username, // config by definition
    name, // config by definition
    hostname, // get by SO
    pid // get by process
  }
}

```

### `agent/disconnected`

```js

{
  agent: {
    uuid
  }
}

```

### `agent/message`

``` js
{
  agent: {
    uuid, // auto generated
    username, // config by definition
    name, // config by definition
    hostname, // get by SO
    pid // get by process
  },
  metric: [
    {
      type,
      value
    }
  ],
  timestamp // generated once create the message
}
```

---

## Platziverse-agent

### Usage

```js

const PlatziverseAgent = require('platziverse-agent')

const agent = new PlatziverseAgent({
  name: 'myapp',
  username: 'admin',
  interval: 2000
})

agent.addMetric('rss', function getRss () {
  return process.memoryUsage().rss
})

agent.addMetric('promiseMetric', function getRandomPromise () {
  return Promise.resolve(Math.random())
})

agent.addMetric('callbackMetric', function getRandomCallBack (callback) {
  setTimeout (() => {
    callback(null, Math.random())
  }, 1000)
})

agent.connect()

// this agent only
agent.on('connected', handler)
agent.on('disconnected', handler)
agent.on('message', handler)

// Other Agents
agent.on('agent/connected', handler)
agent.on('agent/disconnected', handler)
agent.on('agent/message', payload => {
  console.log(payload)
})

setTimeout (() => agent.disconnect(), 20000)
```

---
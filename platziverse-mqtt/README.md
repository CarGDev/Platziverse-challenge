# Platziverse-mqtt

## `agent/connected`

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

## `agent/disconnected`

```js

{
  agent: {
    uuid
  }
}

```

## `agent/message`

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
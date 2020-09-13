# Platziverse-challenge
This is a challenge from Node.js curse advanced [Node curse](https://platzi.com/clases/nodejs/)

## Usage

``` js
const setupDataBase = require('platziverse-challenge')

setupDataBase(config).then(db => {
  const { Agent, Metric } = db
}).catch(err => console.error(err))

```
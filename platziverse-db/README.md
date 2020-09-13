# Usage

``` js
const setupDataBase = require('platziverse-challenge')

setupDataBase(config).then(db => {
  const { Agent, Metric } = db
}).catch(err => console.error(err))

```
const debug = require('debug')('platziverse:db:setup')

module.exports = function config(configExtra) {
  let config = null

  if (configExtra) {
    config = {
      database: process.env.DB_NAME || 'platziverse',
      username: process.env.DB_USER || 'platzi',
      password: process.env.DB_PASS || 'platzi',
      hostname: process.env.DB_HOST || 'localhost',
      dialect: 'postgres',
      loggin: s => debug(s),
      setup: true
    }
  } else {
    config = {
      database: process.env.DB_NAME || 'platziverse',
      username: process.env.DB_USER || 'platzi',
      password: process.env.DB_PASS || 'platzi',
      hostname: process.env.DB_HOST || 'localhost',
      dialect: 'postgres',
      loggin: s => debug(s),
    }
  }

  return config
}

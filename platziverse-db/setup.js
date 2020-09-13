'use strict'

const db = require('./')
const debug = require('debug')('platziverse:db:setup')
const chalk = require('chalk')
const inquirer = require('inquirer')

const prompt = inquirer.createPromptModule()

async function setup () {
  const answer = await prompt([
    {
      type: 'confirm',
      name: 'setup',
      message: 'This will destroy your database, are you sure?'
    }
  ])

  if (!answer.setup) {
    return console.log(chalk.green('Nothing happened :)'))
  }

  const config = {
    database: process.env.DB_NAME || 'platziverse',
    username: process.env.DB_USER || 'platzi',
    password: process.env.DB_PASS || 'platzi',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => debug(s),
    setup: true
  }
  console.log(chalk.grey(config.database))
  console.log(chalk.grey(config.username))
  console.log(chalk.grey(config.password))
  console.log(chalk.grey(config.host))
  console.log(chalk.grey(config.dialect))
  console.log(chalk.grey(config.logging))
  console.log(chalk.grey(config.setup))
  await db(config).catch(handleFatalError)

  console.log(`${chalk.bgGreen.white('[Connected]:')} Success!`)
  process.exit(0)
}

function handleFatalError (err) {
  console.error(`${chalk.bgRed.white('[fatal error]:')} ${err.message}`)
  console.error(`${chalk.bgRed.white('[Error]:')} ${err.stack}`)
  process.exit(1)
}

setup()
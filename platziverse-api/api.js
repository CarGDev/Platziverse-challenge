'use strict'

const debug = require('debug')('platziverse:api:routes')
const express = require('express')
const db = require("platziverse-app")
const asyncify = require('express-asyncify')
const config = require('../platziverse-db/config')

const api = asyncify(express.Router())

let services
let Agent
let Metric

api.use('*', async (req, res, next) => {
  if (!services) {
    try {
      services = await db(config())
    } catch (e) {
      return next(e)
    }
    Agent = services.Agent
    Metric = services.Metric
  }
  next()
})

api.get('/agents', (req, res) => {
  debug('A request has come to /agents')
  res.send({})
})
api.get('/agents/:uuid', (req, res, next) => {
  const { uuid } = req.params

  if (uuid !== 'yyy') {
    return next(new Error('Agent not found'))
  }
  res.send({ uuid })
})
api.get('metrics/:uuid', (req, res) => {
  const { uuid } = req.params
  res.send({ uuid })
})
api.get('/metrics/:uuid/:type', (req, res) => {
  const { uuid, type } = req.params
  res.send({ uuid, type })
})

module.exports = api

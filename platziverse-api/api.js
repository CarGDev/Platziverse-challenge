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
    debug('Connecting to database')
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

api.get('/agents', async (req, res, next) => {
  debug('A request has come to /agents')

  let agents = []
  try {
    agents = await Agent.findConnected()
  } catch (e) {
    next(e)
  }
  res.send(agents)
})
api.get('/agents/:uuid', async (req, res, next) => {
  const { uuid } = req.params

  debug(`request to /agent/${uuid}`)

  let agent
  try {
    agent = await Agent.findByUuid(uuid)
  } catch (e) {
    return next(e)
  }

  if (!agent) {
    return next(new Error(`Agent not found with uuid ${uuid}`))
  }
  res.send(agent)
})
api.get('metrics/:uuid', async (req, res, next) => {
  const { uuid } = req.params

  debug(`request to /metrics/${uuid}`)

  let metrics

  try {
    metric = await Metric.findByAgentUuid(uuid)
  } catch (e) {
    return next(e)
  }
  if (!metrics || metrics.length === 0) {
    return next(new Error(`Metrics not found for agent with uuid ${uuid}`))
  }
  res.send(metrics)
})

api.get('/metrics/:uuid/:type', async (req, res, next) => {
  const { uuid, type } = req.params

  debug(`request to /metrics/${uuid}/${type}`)

  let metrics = []

  try {
    metrics = await Metric.findByTypeAgentUuid(type, uuid)
  } catch (e) {
    return next(e) 
  }
  if (!metrics || metrics.length === 0) {
    return next(new Error(`Metrics not found for agent with uuid ${uuid}`))
  }
  res.send(metrics)
})

module.exports = api

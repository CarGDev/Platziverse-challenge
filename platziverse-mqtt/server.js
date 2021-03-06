'use strict'

const debug = require('debug')('platziverse:mqtt')
const mosca = require('mosca')
const redis = require('redis')
const chalk = require('chalk')
const db = require('platziverse-app')
const conf = require('../platziverse-db/config')
const config = conf()
const { parsePayload } = require('./utils')

const backend = {
  type: 'redis',
  redis,
  return_buffers: true
}

const settings = {
  port: 1883,
  backend
}

const server = new mosca.Server(settings)
const clients = new Map()
let Agent, Metric

server.on('clientConnected', client => {
  debug(`Client Connected: ${client.id}`)
  clients.set(client.id, null)
})

server.on('clientDisconnected', async client => {
  debug(`Client Disconnected: ${client.id}`)
  const agent = clients.get(client.id)
  if (agent) {
    // Mark Agent as Disconnected
    agent.connected = false
    try {
      await Agent.createOrUpdate(agent)
    } catch (e) {
      return handleError(e)
    }
    // Delete Agent from Clients list
    clients.delete(client.id)

    server.publish({
      topic: 'agent/disconnected',
      payload: JSON.stringify({
        agent: {
          uuid: agent.uuid
        }
      })
    })
    debug(`Client ${client.id} associated to Agent ${agent.uuid} market as disconnected`)
  }
})

server.on('published', async (packet, client) => {
  debug(`Recieved: ${packet.topic}`)
  let payload = null
  switch (packet.topic) {
    case 'agent/connected':
    case 'agent/disconnected':
      debug(`Payload: ${packet.payload}`)
      break
    case 'agent/message':
      debug(`Payload: ${packet.payload}`)
      payload = parsePayload(packet.payload)
      if (payload) {
        payload.agent.connected = true
        let agent
        try {
          agent = await Agent.createOrUpdate(payload.agent)
        } catch (e) {
          return handleError(e)
        }
        debug(`Agent ${agent.uuid} saved`)

        // Notify Agent is connected
        if (!clients.get(client.id)) {
          clients.set(client.id, agent)
          server.publish({
            topic: 'agent/connected',
            payload: JSON.stringify({
              agent: {
                uuid: agent.uuid,
                name: agent.name,
                hostname: agent.hostname,
                pid: agent.pid,
                connected: agent.connected
              }
            })
          })
        }

        // Store Metric
        const metricStore = payload.metrics.map(async (metric) => {
          let createdMetric
          try {
            createdMetric = await Metric.create(agent.uuid, metric)
          } catch (e) {
            return handleError(e)
          }
          debug(`Metric ${createdMetric.id} saved on agent ${agent.uuid}`)
        })
        try {
          await Promise.all(metricStore)
        } catch (e) {
          return handleError(e)
        }
      }
      break
  }
})

server.on('ready', async () => {
  const services = await db(config).catch(handleFatalError)

  Agent = services.Agent
  Metric = services.Metric

  console.log(`${chalk.bgGreen.black('[platziverse-mqtt]:')} server is running`)
})

server.on('error', handleFatalError)

function handleFatalError (err) {
  console.error(`${chalk.bgRed.black('[Fatal error]:')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

function handleError (err) {
  console.error(`${chalk.bgRed.black('[Fatal error]:')} ${err.message}`)
  console.error(err.stack)
}

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)

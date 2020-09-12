'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')
const config = {
  loggin: function () {}
}

const MetricStub = {
  belongsTo: function () {}
}

let AgentSub = null
let db = null

test.beforeEach(async () => {
  AgentSub = {
    hasMany: function () {}
  }
  const setupDatabase = proxyquire('../', {
    './models/agent': () => AgentSub,
    './models/metric': () => MetricStub
  })
  db = await setupDatabase(config)
})

test('Agent', t => {
  t.truthy(db.Agent, 'Agent service should exist')
})

'use strict'

const test = require('ava')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

const agentFixtures = require('./fixtures/agent')

const config = {
  loggin: function () {}
}

const MetricStub = {
  belongsTo: sinon.spy()
}

const single = Object.assign({}, agentFixtures.single)
const id = 1
let AgentSub = null
let db = null
let sandbox = null

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()
  AgentSub = {
    hasMany: sandbox.spy()
  }

  // Model findById Stub
  AgentSub.findById = sandbox.stub()
  AgentSub.findById.withArgs(id).returns(Promise.resolve(agentFixtures.byId(id)))
  const setupDatabase = proxyquire('../', {
    './models/agent': () => AgentSub,
    './models/metric': () => MetricStub
  })
  db = await setupDatabase(config)
})

test.afterEach(() => {
  sandbox && sandbox.restore()
})

test('Agent', t => {
  t.truthy(db.Agent, 'Agent service should exist')
})

test.serial('Setup', t => {
  t.true(AgentSub.hasMany.called, 'AgentModel.hasMany was executed')
  t.true(AgentSub.hasMany.calledWith(MetricStub), 'Argument should be the MetricModel')
  t.true(MetricStub.belongsTo.called, 'MetricModel.belongsTo was executed')
  t.true(MetricStub.belongsTo.calledWith(AgentSub), 'Argument needs to be the AgentModel')
})

test.serial('Agent#findById', async t => {
  const agent = await db.Agent.findById(id)
  t.true(AgentSub.findById.called, 'findById should be called on model')
  t.true(AgentSub.findById.calledOnce, 'findById should be called once')
  t.true(AgentSub.findById.calledWith(id), 'findById should be called with id specified')
  t.deepEqual(agent, agentFixtures.byId(id), 'should be the same')
})

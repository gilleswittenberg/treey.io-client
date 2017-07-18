/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any
declare var afterEach: any

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import multi from 'redux-multi'
import nock from 'nock'
import {
  getNodes,
  addNodeTransaction,
  updateNodeTransactionStatus,
  create,
  update,
  remove,
  move
} from '../../app/actions/nodes'
import { uuid, uuid1, uuid2, uuid3, uuid4, uuid5 } from '../uuid'

const middlewares = [thunk, multi]
const mockStore = configureMockStore(middlewares)

const hostname = /treey\.io/
const datetime = new Date()

describe('nodes actions', () => {

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getNodes', () => {

    it('INTERNAL_SERVER_ERROR', () => {
      nock(hostname)
        .get(`/nodes/${ uuid }`)
        .reply(500)

      const store = mockStore({ nodes: null })

      return store.dispatch(getNodes(uuid))
        .then(
          () => {
            const lastAction = store.getActions().pop()
            expect(lastAction.type).toEqual('HAS_ERRORS')
          }
        )
    })

    it('NOT_FOUND', () => {
      nock(hostname)
        .get(`/nodes/${ uuid }`)
        .reply(404)

      const store = mockStore({ nodes: null })

      return store.dispatch(getNodes(uuid))
        .then(() => {
          const lastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('HAS_ERRORS')
        })
    })

    it('BAD_REQUEST', () => {
      nock(hostname)
        .get(`/nodes/${ uuid }`)
        .reply(400)

      const store = mockStore({ nodes: null })

      return store.dispatch(getNodes(uuid))
        .then(() => {
          const lastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('HAS_ERRORS')
        })
    })

    it('OK', () => {

      const body = {
        nodes: [{
          uuid,
          data: { title: 'John Doe' },
          nodes: [uuid1, uuid2]
        }, {
          uuid: uuid1,
          data: { title: 'ToDo' },
          nodes: []
        }, {
          uuid: uuid2,
          data: { title: 'clean the house' },
          nodes: [uuid3, uuid4, uuid5]
        }, {
          uuid: uuid3,
          data: { title: 'Star Wars: Episode IV - A New Hope (1977)' },
          nodes: []
        }, {
          uuid: uuid4,
          data: { title: 'The Terminator (1984)' },
          nodes: []
        }, {
          uuid: uuid5,
          data: { title: 'The Matrix (1999)' },
          nodes: []
        }]
      }

      nock(hostname)
        .get(`/nodes/${ uuid }`)
        .reply(200, body)

      const store = mockStore({ nodes: null })

      return store.dispatch(getNodes(uuid))
        .then(() => {
          const lastAction = store.getActions().pop()
          const secondLastAction = store.getActions().pop()
          const thirdLastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('SET_UI_KEY')
          expect(secondLastAction.type).toEqual('SET_EXPANDED')
          expect(thirdLastAction.type).toEqual('INDEX_NODES')
          expect(thirdLastAction.data.nodes).toEqual(body.nodes)
        })
    })
  })

  describe('addNodeTransaction', () => {

    it('action', () => {

      const node = {
        uuid,
        nodes: []
      }
      const store = mockStore({ nodes: [node] })
      const transaction = {
        uuid,
        node: uuid,
        type: 'SET',
        status: 'PENDING',
        data: { title: 'Title' },
        modified: datetime,
        created: datetime
      }

      store.dispatch(addNodeTransaction(transaction))
      const lastAction = store.getActions().pop()
      expect(lastAction.type).toEqual('ADD_NODE_TRANSACTION')
      expect(lastAction.data.transaction).toEqual(transaction)
    })
  })

  describe('updateNodeTransactionStatus', () => {

    it('action', () => {

      const transaction = {
        uuid,
        node: uuid,
        type: 'SET',
        data: { title: 'Title' },
        status: 'PENDING',
        modified: datetime,
        created: datetime
      }

      const node = {
        uuid,
        data: { title: '' },
        nodes: [],
        transactions: [transaction]
      }
      const store = mockStore({ nodes: [node] })
      store.dispatch(updateNodeTransactionStatus(transaction, 'COMMITTED'))
      const lastAction = store.getActions().pop()
      expect(lastAction.type).toEqual('UPDATE_NODE_TRANSACTION_STATUS')
      expect(lastAction.data.transaction).toEqual(transaction)
      expect(lastAction.data.status).toEqual('COMMITTED')
    })
  })

  describe('create', () => {

    it('actions', () => {

      const response = {
        transactions: [
          { status: 'COMMITTED', auth: { user: 'johndoe' } },
          { status: 'COMMITTED' },
          { status: 'COMMITTED' }
        ]
      }
      nock(hostname)
        .post('/nodes/transactions')
        .reply(201, response)

      const store = mockStore({ nodes: [] })
      const actions = store.dispatch(create([uuid], { title: 'Create' }))
      return actions[actions.length - 1].then(() => {
        const lastAction = store.getActions().pop()
        const secondLastAction = store.getActions().pop()
        const thirdLastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('UPDATE_NODE_TRANSACTION_STATUS')
        expect(lastAction.data.status).toEqual('COMMITTED')
        expect(secondLastAction.type).toEqual('UPDATE_NODE_TRANSACTION_STATUS')
        expect(secondLastAction.data.status).toEqual('COMMITTED')
        expect(thirdLastAction.type).toEqual('UPDATE_NODE_TRANSACTION_STATUS')
        expect(thirdLastAction.data.status).toEqual('COMMITTED')
        expect(thirdLastAction.data.transaction.auth).toEqual({ user: 'johndoe' })
      })
    })
  })

  describe('update', () => {

    it('actions', () => {

      const response = {
        transactions: [
          { status: 'COMMITTED' }
        ]
      }
      nock(hostname)
        .post('/nodes/transactions')
        .reply(201, response)

      const store = mockStore({ nodes: [] })
      const actions = store.dispatch(update([uuid], { title: 'Update' }))
      return actions[actions.length - 1].then(() => {
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('UPDATE_NODE_TRANSACTION_STATUS')
        expect(lastAction.data.status).toEqual('COMMITTED')
      })
    })
  })

  describe('remove', () => {

    it('actions', () => {

      const response = {
        transactions: [
          { status: 'COMMITTED' }
        ]
      }
      nock(hostname)
        .post('/nodes/transactions')
        .reply(201, response)

      const store = mockStore({ nodes: [] })
      const actions = store.dispatch(remove([uuid, uuid1]))
      return actions[actions.length - 1].then(() => {
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('UPDATE_NODE_TRANSACTION_STATUS')
        expect(lastAction.data.status).toEqual('COMMITTED')
      })
    })
  })

  describe('move', () => {

    it('actions', () => {

      const response = {
        transactions: [
          { status: 'COMMITTED' },
          { status: 'COMMITTED' }
        ]
      }
      nock(hostname)
        .post('/nodes/transactions')
        .reply(201, response)

      const store = mockStore({ nodes: [] })
      const actions = store.dispatch(move([uuid, uuid2], [uuid1]))
      return actions[actions.length - 1].then(() => {
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('UPDATE_NODE_TRANSACTION_STATUS')
        expect(lastAction.data.status).toEqual('COMMITTED')
      })
    })
  })
})

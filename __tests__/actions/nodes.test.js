/* @flow */

// required for Flow type
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
import { uid, uid1, uid2, uid3, uid4, uid5 } from '../uid'
import { uuid } from '../uuid'

const middlewares = [thunk, multi]
const mockStore = configureMockStore(middlewares)

const hostname = /treey\.io/

describe('nodes actions', () => {

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getNodes', () => {

    it('INTERNAL_SERVER_ERROR', () => {
      nock(hostname)
        .get(`/nodes/${ uid }`)
        .reply(500)

      const store = mockStore({ nodes: null })

      return store.dispatch(getNodes(uid))
        .then(
          () => {
            const lastAction = store.getActions().pop()
            expect(lastAction.type).toEqual('HAS_ERRORS')
          }
        )
    })

    it('NOT_FOUND', () => {
      nock(hostname)
        .get(`/nodes/${ uid }`)
        .reply(404)

      const store = mockStore({ nodes: null })

      return store.dispatch(getNodes(uid))
        .then(() => {
          const lastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('HAS_ERRORS')
        })
    })

    it('BAD_REQUEST', () => {
      nock(hostname)
        .get(`/nodes/${ uid }`)
        .reply(400)

      const store = mockStore({ nodes: null })

      return store.dispatch(getNodes(uid))
        .then(() => {
          const lastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('HAS_ERRORS')
        })
    })

    it('OK', () => {

      const body = {
        nodes: [{
          uid,
          data: { title: 'John Doe' },
          nodes: [uid1, uid2]
        }, {
          uid: uid1,
          data: { title: 'ToDo' },
          nodes: []
        }, {
          uid: uid2,
          data: { title: 'clean the house' },
          nodes: [uid3, uid4, uid5]
        }, {
          uid: uid3,
          data: { title: 'Star Wars: Episode IV - A New Hope (1977)' },
          nodes: []
        }, {
          uid: uid4,
          data: { title: 'The Terminator (1984)' },
          nodes: []
        }, {
          uid: uid5,
          data: { title: 'The Matrix (1999)' },
          nodes: []
        }]
      }

      nock(hostname)
        .get(`/nodes/${ uid }`)
        .reply(200, body)

      const store = mockStore({ nodes: null })

      return store.dispatch(getNodes(uid))
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
        uid,
        nodes: []
      }
      const store = mockStore({ nodes: [node] })
      const transaction = {
        uuid,
        uid,
        type: 'SET',
        data: { title: 'Title' },
        status: 'PENDING'
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
        uid,
        type: 'SET',
        data: { title: 'Title' },
        status: 'PENDING'
      }

      const node = {
        uid,
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
          { status: 'COMMITTED' },
          { status: 'COMMITTED' },
          { status: 'COMMITTED' }
        ]
      }
      nock(hostname)
        .post('/nodes/transactions')
        .reply(201, response)

      const store = mockStore({ nodes: [] })
      const actions = store.dispatch(create([uid], { title: 'Create' }))
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
      const actions = store.dispatch(update([uid], { title: 'Update' }))
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
      const actions = store.dispatch(remove([uid, uid1]))
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
      const actions = store.dispatch(move([uid, uid2], [uid1]))
      return actions[actions.length - 1].then(() => {
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('UPDATE_NODE_TRANSACTION_STATUS')
        expect(lastAction.data.status).toEqual('COMMITTED')
      })
    })
  })
})

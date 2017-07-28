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
  setNodeTransactionIsSyncing,
  syncTransaction,
  cancelTransaction,
  revertTransaction,
  create,
  update,
  remove,
  move
} from '../../app/actions/nodes'
import { uuid, uuid1, uuid2, uuid3, uuid4, uuid5 } from '../uuid'
import date from '../date'

const middlewares = [thunk, multi]
const mockStore = configureMockStore(middlewares)

const hostname = /treey\.io/

describe('actions nodes', () => {

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
            expect(lastAction.type).toBe('HAS_ERRORS')
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
          expect(lastAction.type).toBe('HAS_ERRORS')
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
          expect(lastAction.type).toBe('HAS_ERRORS')
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
          expect(lastAction.type).toBe('SET_UI_KEY')
          expect(secondLastAction.type).toBe('SET_EXPANDED')
          expect(thirdLastAction.type).toBe('INDEX_NODES')
          expect(thirdLastAction.data.nodes).toEqual(body.nodes)
        })
    })
  })

  describe('transactions', () => {

    describe('addNodeTransaction', () => {

      it('action', () => {

        const transaction = {
          uuid,
          node: uuid,
          type: 'SET',
          status: 'PENDING',
          data: { title: 'Title' },
          modified: date,
          created: date
        }
        const store = mockStore()
        store.dispatch(addNodeTransaction(transaction))
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toBe('ADD_NODE_TRANSACTION')
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
          modified: date,
          created: date
        }
        const store = mockStore()
        store.dispatch(updateNodeTransactionStatus(transaction, 'COMMITTED'))
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toBe('UPDATE_NODE_TRANSACTION_STATUS')
        expect(lastAction.data.transaction).toEqual(transaction)
        expect(lastAction.data.status).toBe('COMMITTED')
      })
    })

    describe('setNodeTransactionIsSyncing', () => {

      it('action', () => {

        const transaction = {
          uuid,
          node: uuid,
          type: 'SET',
          data: { title: 'Title' },
          status: 'PENDING',
          modified: date,
          created: date
        }
        const store = mockStore()
        store.dispatch(setNodeTransactionIsSyncing(transaction, true))
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toBe('SET_NODE_TRANSACTION_IS_SYNCING')
        expect(lastAction.data.transaction).toEqual(transaction)
        expect(lastAction.data.isSyncing).toBe(true)
      })
    })

    describe('invalid response', () => {

      it('actions', () => {

        const response = { invalid: 'JSON' }
        nock(hostname)
          .post('/nodes/transactions')
          .reply(201, response)

        const store = mockStore({ nodes: [] })
        const actions = store.dispatch(create([uuid], { title: 'Create' }))
        return actions[actions.length - 1].then(() => {
          const lastAction = store.getActions().pop()
          const secondLastAction = store.getActions().pop()
          const thirdLastAction = store.getActions().pop()
          const fourthLastAction = store.getActions().pop()
          expect(fourthLastAction.type).toBe('STOP_SYNCING')
          expect(thirdLastAction.type).toBe('SET_NODE_TRANSACTION_IS_SYNCING')
          expect(secondLastAction.type).toBe('SET_NODE_TRANSACTION_IS_SYNCING')
          expect(lastAction.type).toBe('SET_NODE_TRANSACTION_IS_SYNCING')
        })
      })
    })

    describe('404', () => {

      it('actions', () => {

        nock(hostname)
          .post('/nodes/transactions')
          .reply(404)

        const store = mockStore({ nodes: [] })
        const actions = store.dispatch(create([uuid], { title: 'Create' }))
        return actions[actions.length - 1].then(() => {
          const lastAction = store.getActions().pop()
          const secondLastAction = store.getActions().pop()
          const thirdLastAction = store.getActions().pop()
          const fourthLastAction = store.getActions().pop()
          const fifthLastAction = store.getActions().pop()
          expect(fifthLastAction.type).toBe('STOP_SYNCING')
          expect(fourthLastAction.type).toBe('SET_NODE_TRANSACTION_IS_SYNCING')
          expect(thirdLastAction.type).toBe('SET_NODE_TRANSACTION_IS_SYNCING')
          expect(secondLastAction.type).toBe('SET_NODE_TRANSACTION_IS_SYNCING')
          expect(lastAction.type).toBe('HAS_ERRORS')
        })
      })
    })

    describe('syncTransaction', () => {

      it('guard status is PENDING', () => {

        const transaction = {
          uuid,
          node: uuid,
          type: 'SET',
          data: { title: 'Title' },
          status: 'COMMITTED',
          modified: date,
          created: date
        }
        expect(syncTransaction(transaction)).not.toBeDefined()
      })

      it('calls postTransactions', () => {

        const transaction = {
          uuid,
          node: uuid,
          type: 'SET',
          data: { title: 'Title' },
          status: 'PENDING',
          modified: date,
          created: date
        }
        const transactionCommitted = { ...transaction, status: 'COMMITTED' }
        const response = {
          transactions: [transactionCommitted]
        }
        nock(hostname)
          .post('/nodes/transactions')
          .reply(201, response)

        const store = mockStore({ nodes: [] })

        const action = store.dispatch(syncTransaction(transaction))
        return action.then(() => {
          const lastAction = store.getActions().pop()
          expect(lastAction.type).toBe('UPDATE_NODE_TRANSACTION_STATUS')
          expect(lastAction.data.status).toBe('COMMITTED')
        })
      })
    })

    describe('cancelTransaction', () => {

      it('guard status is PENDING, not syncing', () => {

        const transaction = {
          uuid,
          node: uuid,
          type: 'SET',
          data: { title: 'Title' },
          status: 'COMMITTED',
          isSyncing: false,
          modified: date,
          created: date
        }
        expect(cancelTransaction(transaction)).not.toBeDefined()
      })

      it('guard status is PENDING, not syncing', () => {

        const transaction = {
          uuid,
          node: uuid,
          type: 'SET',
          data: { title: 'Title' },
          status: 'PENDING',
          isSyncing: true,
          modified: date,
          created: date
        }
        expect(cancelTransaction(transaction)).not.toBeDefined()
      })

      it('calls updateNodeTransactionStatus', () => {

        const transaction = {
          uuid,
          node: uuid,
          type: 'SET',
          data: { title: 'Title' },
          status: 'PENDING',
          isSyncing: false,
          modified: date,
          created: date
        }

        const action = cancelTransaction(transaction)
        expect(action).toBeDefined()
        if (action != null) {
          expect(action.type).toBe('UPDATE_NODE_TRANSACTION_STATUS')
          expect(action.data.transaction).toEqual(transaction)
          expect(action.data.status).toBe('CANCELLED')
        }
      })
    })

    describe('revertTransaction', () => {

      it('guard status is COMMITTED', () => {

        const transaction = {
          uuid,
          node: uuid,
          type: 'SET',
          data: { title: 'Title' },
          status: 'PENDING',
          modified: date,
          created: date
        }
        expect(revertTransaction(transaction)).not.toBeDefined()
      })

      it('calls addNodeTransaction, postTransactions', () => {

        const transaction = {
          uuid,
          node: uuid,
          type: 'SET',
          data: { title: 'Title' },
          status: 'COMMITTED',
          modified: date,
          created: date
        }

        const actions = revertTransaction(transaction)
        expect(actions).toBeDefined()
        if (actions != null) {
          expect(actions.length).toBe(2)
          expect(actions[0].type).toBe('ADD_NODE_TRANSACTION')
        }
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
          expect(lastAction.type).toBe('UPDATE_NODE_TRANSACTION_STATUS')
          expect(lastAction.data.status).toBe('COMMITTED')
          expect(secondLastAction.type).toBe('UPDATE_NODE_TRANSACTION_STATUS')
          expect(secondLastAction.data.status).toBe('COMMITTED')
          expect(thirdLastAction.type).toBe('UPDATE_NODE_TRANSACTION_STATUS')
          expect(thirdLastAction.data.status).toBe('COMMITTED')
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
          expect(lastAction.type).toBe('UPDATE_NODE_TRANSACTION_STATUS')
          expect(lastAction.data.status).toBe('COMMITTED')
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
        const actions0 = store.getActions()
        for (let i = 0; i < 3; i++) actions0.pop()
        const fourthLastAction = actions0.pop()
        expect(fourthLastAction.type).toBe('UNSET_EXPANDED_DEEP')
        expect(fourthLastAction.data.treePath).toEqual([uuid, uuid1])
        return actions[actions.length - 1].then(() => {
          const lastAction = store.getActions().pop()
          expect(lastAction.type).toBe('UPDATE_NODE_TRANSACTION_STATUS')
          expect(lastAction.data.status).toBe('COMMITTED')
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
        const actions0 = store.getActions()
        for (let i = 0; i < 5; i++) actions0.pop()
        const sixthLastAction = actions0.pop()
        expect(sixthLastAction.type).toBe('SET_UI_KEY')
        expect(sixthLastAction.data.key).toBe('active')
        expect(sixthLastAction.data.treePath).toEqual([uuid1, uuid2])
        const seventhLastAction = actions0.pop()
        expect(seventhLastAction.type).toBe('UNSET_EXPANDED_DEEP')
        expect(seventhLastAction.data.treePath).toEqual([uuid, uuid2])
        return actions[actions.length - 1].then(() => {
          const lastAction = store.getActions().pop()
          expect(lastAction.type).toBe('UPDATE_NODE_TRANSACTION_STATUS')
          expect(lastAction.data.status).toBe('COMMITTED')
        })
      })
    })
  })
})

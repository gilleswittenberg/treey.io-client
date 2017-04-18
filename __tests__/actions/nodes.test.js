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
import * as actions from '../../app/actions/nodes'
import { uid, uid1, uid2, uid3, uid4, uid5 } from '../uid'

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

      return store.dispatch(actions.getNodes(uid))
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

      return store.dispatch(actions.getNodes(uid))
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

      return store.dispatch(actions.getNodes(uid))
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

      return store.dispatch(actions.getNodes(uid))
        .then(() => {
          const lastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('INDEX_NODES')
          expect(lastAction.data.nodes).toEqual(body.nodes)
        })
    })
  })

  describe('addNodeTransaction', () => {

    it('action', () => {

      const store = mockStore({ nodes: [] })
      const transaction = {
        uuid: '',
        uid,
        type: 'SET',
        data: { title: 'Title' },
        status: 'PENDING'
      }

      store.dispatch(actions.addNodeTransaction(transaction))
      const lastAction = store.getActions().pop()
      expect(lastAction.type).toEqual('ADD_NODE_TRANSACTION')
      expect(lastAction.data.transaction).toEqual(transaction)
    })
  })
})

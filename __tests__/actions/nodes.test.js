/* @flow */

// @TODO: clean up
declare var describe: any
declare var it: any
declare var expect: any
declare var afterEach: any

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import * as actions from '../../app/actions/nodes'
import { uid, uid1, uid2, uid3, uid4, uid5 } from '../uid'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const hostname = /treey\.io/

describe('nodes actions', () => {

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getNodes', () => {

    it('INTERNAL_SERVER_ERROR', () => {
      nock(hostname)
        .get(`/node/${ uid }`)
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
        .get(`/node/${ uid }`)
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
        .get(`/node/${ uid }`)
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
        uid,
        title: 'John Doe',
        nodes: [
          {
            title: 'ToDo',
            nodes: [
              { uid: uid1, title: 'bring home the milk' },
              { uid: uid2, title: 'clean the house' }
            ]
          },
          {
            title: 'Movies',
            nodes: [
              { uid: uid3, title: 'Star Wars: Episode IV - A New Hope (1977)' },
              { uid: uid4, title: 'The Terminator (1984)' },
              { uid: uid5, title: 'The Matrix (1999)' }
            ]
          }
        ]
      }

      nock(hostname)
        .get(`/node/${ uid }`)
        .reply(200, body)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.getNodes(uid))
        .then(() => {
          const lastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('INDEX_NODES')
          expect(lastAction.data.tree).toEqual(body)
        })
    })
  })

  describe('postNode', () => {

    it('INTERNAL_SERVER_ERROR', () => {
      nock(hostname)
        .post(`/node/${ uid }`)
        .reply(500)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.postNode(uid, [], { title: '' }))
        .then(
          () => {
            const lastAction = store.getActions().pop()
            expect(lastAction.type).toEqual('HAS_ERRORS')
          }
        )
    })

    it('BAD_REQUEST', () => {
      nock(hostname)
        .post(`/node/${ uid }`)
        .reply(400)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.postNode(uid, [], { title: '' }))
        .then(() => {
          const lastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('HAS_ERRORS')
        })
    })

    it('OK', () => {

      const parent = uid
      const path = [uid]

      const data = {
        title: 'New User'
      }

      const body = {
        uid,
        title: 'New User'
      }

      const actionData = {
        data: {
          title: 'New User'
        }
      }

      nock(hostname)
        .post(`/node/${ parent }`, data)
        .reply(200, body)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.postNode(parent, path, data))
        .then(() => {
          const lastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('ADD_NODE')
          expect(lastAction.data).toEqual({ path, node: actionData })
        })
    })
  })

  describe('putNode', () => {

    it('INTERNAL_SERVER_ERROR', () => {
      nock(hostname)
        .put(`/node/${ uid }`)
        .reply(500)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.putNode(uid, [], { title: '' }))
        .then(
          () => {
            const lastAction = store.getActions().pop()
            expect(lastAction.type).toEqual('HAS_ERRORS')
          }
        )
    })

    it('BAD_REQUEST', () => {
      nock(hostname)
        .put(`/node/${ uid }`)
        .reply(400)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.putNode(uid, [], { title: '' }))
        .then(() => {
          const lastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('HAS_ERRORS')
        })
    })

    it('OK', () => {

      const path = [uid]

      const data = {
        title: 'New User'
      }

      const body = {
        title: 'New User'
      }

      const actionData = {
        data: {
          title: 'New User'
        }
      }

      nock(hostname)
        .put(`/node/${ uid }`, data)
        .reply(200, body)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.putNode(uid, path, data))
        .then(() => {
          const lastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('UPDATE_NODE')
          expect(lastAction.data).toEqual({ path, node: actionData })
        })
    })
  })

  describe('deleteNode', () => {

    it('INTERNAL_SERVER_ERROR', () => {

      nock(hostname)
        .delete(`/node/${ uid }/${ uid1 }`)
        .reply(500)

      const store = mockStore({ nodes: null })

      // @TODO: remove parent, uid arguments
      return store.dispatch(actions.deleteNode([], parent, uid))
        .then(
          () => {
            const lastAction = store.getActions().pop()
            expect(lastAction.type).toEqual('HAS_ERRORS')
          }
        )
    })

    it('BAD_REQUEST', () => {

      nock(hostname)
        .delete(`/node/${ uid }/${ uid1 }`)
        .reply(400)

      const store = mockStore({ nodes: null })

      // @TODO: remove parent, uid arguments
      return store.dispatch(actions.deleteNode([], uid, uid1))
        .then(() => {
          const lastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('HAS_ERRORS')
        })
    })

    it('OK', () => {

      const path = []

      nock(hostname)
        .delete(`/node/${ uid }/${ uid1 }`)
        .reply(200)

      const store = mockStore({ tree: null })

      // @TODO: remove parent, uid arguments
      return store.dispatch(actions.deleteNode([], uid, uid1))
        .then(() => {
          const lastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('REMOVE_NODE')
          expect(lastAction.data).toEqual({ path })
        })
    })
  })

  describe('putMoveNode', () => {

    it('INTERNAL_SERVER_ERROR', () => {

      nock(hostname)
        .put(`/node/move/${ uid }/${ uid1 }/${ uid2 }/`)
        .reply(500)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.putMoveNode(uid, uid1, uid2))
        .then(
          () => {
            const lastAction = store.getActions().pop()
            expect(lastAction.type).toEqual('HAS_ERRORS')
          }
        )
    })

    it('BAD_REQUEST', () => {

      nock(hostname)
        .put(`/node/move/${ uid }/${ uid1 }/${ uid2 }/`)
        .reply(400)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.putMoveNode(uid, uid1, uid2))
        .then(() => {
          const lastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('HAS_ERRORS')
        })
    })

    it('OK', () => {

      nock(hostname)
        .put(`/node/move/${ uid }/${ uid1 }/${ uid2 }/`)
        .reply(200)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.putMoveNode(uid, uid1, uid2))
        .then(() => {
          const lastAction = store.getActions().pop()
          const secondLastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('STOP_SYNCING')
          expect(secondLastAction.type).toEqual('MOVE_NODE')
          expect(secondLastAction.data).toEqual({ parent: uid, uid: uid1, newParent: uid2 })
        })
    })
  })

})

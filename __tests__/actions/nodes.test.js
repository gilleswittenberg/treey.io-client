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
        data: { title: 'John Doe' },
        nodes: [
          {
            data: { title: 'ToDo' },
            nodes: [
              { uid: uid1, title: 'bring home the milk' },
              { uid: uid2, title: 'clean the house' }
            ]
          },
          {
            data: { title: 'Movies' },
            nodes: [
              { uid: uid3, data: { title: 'Star Wars: Episode IV - A New Hope (1977)' } },
              { uid: uid4, data: { title: 'The Terminator (1984)' } },
              { uid: uid5, data: { title: 'The Matrix (1999)' } }
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

    it('null path', () => {
      expect(actions.postNode([], { title: '' })).toBe(undefined)
    })

    it('INTERNAL_SERVER_ERROR', () => {
      nock(hostname)
        .post(`/node/${ uid }`)
        .reply(500)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.postNode([uid], { title: '' }))
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

      return store.dispatch(actions.postNode([uid], { title: '' }))
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
        uid,
        data: {
          title: 'New User'
        }
      }

      nock(hostname)
        .post(`/node/${ uid }`, { data })
        .reply(200, body)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.postNode(path, data))
        .then(() => {
          const lastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('ADD_NODE')
          expect(lastAction.data).toEqual({ path, nodeData: data, uid })
        })
    })
  })

  describe('putNode', () => {

    it('null path', () => {
      expect(actions.putNode([], { title: '' })).toBe(undefined)
    })

    it('INTERNAL_SERVER_ERROR', () => {
      nock(hostname)
        .put(`/node/${ uid }`)
        .reply(500)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.putNode([uid], { title: '' }))
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

      return store.dispatch(actions.putNode([uid], { title: '' }))
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
        uid,
        data: {
          title: 'New User'
        }
      }

      nock(hostname)
        .put(`/node/${ uid }`, { data })
        .reply(200, body)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.putNode(path, data))
        .then(() => {
          const lastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('UPDATE_NODE')
          expect(lastAction.data).toEqual({ path, nodeData: data })
        })
    })
  })

  describe('patchNode', () => {

    it('null path', () => {
      expect(actions.patchNode([], { title: '' })).toBe(undefined)
    })

    it('INTERNAL_SERVER_ERROR', () => {
      nock(hostname)
        .patch(`/node/${ uid }`)
        .reply(500)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.patchNode([uid], { title: '' }))
        .then(
          () => {
            const lastAction = store.getActions().pop()
            expect(lastAction.type).toEqual('HAS_ERRORS')
          }
        )
    })

    it('BAD_REQUEST', () => {
      nock(hostname)
        .patch(`/node/${ uid }`)
        .reply(400)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.patchNode([uid], { title: '' }))
        .then(() => {
          const lastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('HAS_ERRORS')
        })
    })

    it('OK', () => {

      const path = [uid]
      const data = { title: 'New User' }
      const transaction = { type: 'SET', data }

      nock(hostname)
        .patch(`/node/${ uid }`, { transaction })
        .reply(200)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.patchNode(path, data))
        .then(() => {
          const lastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('UPDATE_NODE_TRANSACTIONS')
          expect(lastAction.data).toEqual({ path, transaction })
        })
    })
  })

  describe('deleteNode', () => {

    it('null path', () => {
      expect(actions.deleteNode([], { title: '' })).toBe(undefined)
    })

    it('INTERNAL_SERVER_ERROR', () => {

      nock(hostname)
        .delete(`/node/${ uid }/${ uid1 }`)
        .reply(500)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.deleteNode([uid, uid1]))
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

      return store.dispatch(actions.deleteNode([uid, uid1]))
        .then(() => {
          const lastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('HAS_ERRORS')
        })
    })

    it('OK', () => {

      const path = [uid, uid1]

      nock(hostname)
        .delete(`/node/${ uid }/${ uid1 }`)
        .reply(200)

      const store = mockStore({ tree: null })

      return store.dispatch(actions.deleteNode(path))
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

      return store.dispatch(actions.putMoveNode([uid, uid1], [uid2]))
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

      return store.dispatch(actions.putMoveNode([uid, uid1], [uid2]))
        .then(() => {
          const lastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('HAS_ERRORS')
        })
    })

    it('OK', () => {

      const path = [uid, uid1]
      const newPath = [uid2]

      nock(hostname)
        .put(`/node/move/${ uid }/${ uid1 }/${ uid2 }/`)
        .reply(200)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.putMoveNode([uid, uid1], [uid2]))
        .then(() => {
          const lastAction = store.getActions().pop()
          const secondLastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('STOP_SYNCING')
          expect(secondLastAction.type).toEqual('MOVE_NODE')
          expect(secondLastAction.data).toEqual({ path, newPath })
        })
    })
  })

  describe('ui', () => {

    describe('clearUIEditingAdding', () => {

      it('action', () => {

        const store = mockStore({ nodes: null })

        store.dispatch(actions.clearUIEditingAdding())
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('CLEAR_NODE_UI')
        expect(lastAction.data).toEqual({ keys: ['editing', 'adding'] })
      })
    })

    describe('setUIEditing', () => {

      it('actions', () => {

        const store = mockStore({ nodes: null })

        store.dispatch(actions.setUIEditing([]))
        const lastAction = store.getActions().pop()
        const secondLastAction = store.getActions().pop()
        expect(secondLastAction.type).toEqual('CLEAR_NODE_UI')
        expect(lastAction.type).toEqual('UPDATE_NODE_UI')
        expect(lastAction.data.key).toBe('editing')
        expect(lastAction.data.value).toBe(true)
      })
    })

    describe('setUIAdding', () => {

      it('actions', () => {

        const store = mockStore({ nodes: null })

        store.dispatch(actions.setUIAdding([]))
        const lastAction = store.getActions().pop()
        const secondLastAction = store.getActions().pop()
        expect(secondLastAction.type).toEqual('CLEAR_NODE_UI')
        expect(secondLastAction.data.keys).toEqual(['editing', 'adding'])
        expect(lastAction.type).toEqual('UPDATE_NODE_UI')
        expect(lastAction.data.key).toBe('adding')
        expect(lastAction.data.value).toBe(true)
      })
    })

    describe('setUIExpanded', () => {

      it('actions', () => {

        const store = mockStore({ nodes: null })

        store.dispatch(actions.setUIExpanded([]))
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('UPDATE_NODE_UI')
        expect(lastAction.data.key).toBe('expanded')
        expect(lastAction.data.value).toBe(true)
      })
    })

    describe('clearUIMovingChild', () => {

      it('actions', () => {
        const store = mockStore({ nodes: null })
        store.dispatch(actions.clearUIMovingChild())
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('CLEAR_NODE_UI')
        expect(lastAction.data.keys).toEqual(['movingChild'])
      })
    })

    describe('clearUIButtonsShown', () => {

      it('actions', () => {
        const store = mockStore({ nodes: null })
        store.dispatch(actions.clearUIButtonsShown())
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('CLEAR_NODE_UI')
        expect(lastAction.data.keys).toEqual(['buttonsShown'])
      })
    })

    describe('clearUIDragging', () => {

      it('actions', () => {
        const store = mockStore({ nodes: null })
        store.dispatch(actions.clearUIDragging())
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('CLEAR_NODE_UI')
        expect(lastAction.data.keys).toEqual(['dragging'])
      })
    })

    describe('setUIMovingChild', () => {

      it('actions', () => {

        const store = mockStore({ nodes: null })

        store.dispatch(actions.setUIMovingChild([]))
        const lastAction = store.getActions().pop()
        const secondLastAction = store.getActions().pop()
        expect(secondLastAction.type).toEqual('CLEAR_NODE_UI')
        expect(secondLastAction.data.keys).toEqual(['movingChild'])
        expect(lastAction.type).toEqual('UPDATE_NODE_UI')
        expect(lastAction.data.key).toBe('movingChild')
        expect(lastAction.data.value).toBe(true)
      })
    })

    describe('setUIDragging', () => {

      it('actions', () => {

        const store = mockStore({ nodes: null })

        store.dispatch(actions.setUIDragging([]))
        const lastAction = store.getActions().pop()
        const secondLastAction = store.getActions().pop()
        expect(secondLastAction.type).toEqual('CLEAR_NODE_UI')
        expect(secondLastAction.data.keys).toEqual(['dragging'])
        expect(lastAction.type).toEqual('UPDATE_NODE_UI')
        expect(lastAction.data.key).toBe('dragging')
        expect(lastAction.data.value).toBe(true)
      })
    })

    describe('setUIActive', () => {

      it('actions', () => {

        const store = mockStore({ nodes: null })

        store.dispatch(actions.setUIActive([]))
        const lastAction = store.getActions().pop()
        const secondLastAction = store.getActions().pop()
        expect(secondLastAction.type).toEqual('CLEAR_NODE_UI')
        expect(secondLastAction.data.keys).toEqual(['active'])
        expect(lastAction.type).toEqual('UPDATE_NODE_UI')
        expect(lastAction.data.key).toBe('active')
        expect(lastAction.data.value).toBe(true)
      })
    })

    describe('setUIButtonsShown', () => {

      it('actions', () => {

        const store = mockStore({ nodes: null })

        store.dispatch(actions.setUIButtonsShown([]))
        const lastAction = store.getActions().pop()
        const secondLastAction = store.getActions().pop()
        expect(secondLastAction.type).toEqual('CLEAR_NODE_UI')
        expect(secondLastAction.data.keys).toEqual(['buttonsShown'])
        expect(lastAction.type).toEqual('UPDATE_NODE_UI')
        expect(lastAction.data.key).toBe('buttonsShown')
        expect(lastAction.data.value).toBe(true)
      })
    })

    describe('updateActiveNodeUI', () => {

      it('actions', () => {

        const store = mockStore({ nodes: null })

        store.dispatch(actions.updateActiveNodeUI('editing'))
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('UPDATE_ACTIVE_NODE_UI')
        expect(lastAction.data.key).toBe('editing')
        expect(lastAction.data.value).toBe(true)
      })
    })

    describe('setNextUIActive', () => {

      it('actions', () => {
        const store = mockStore({ nodes: null })
        store.dispatch(actions.setNextUIActive())
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('SET_NEXT_UI_ACTIVE')
      })
    })

    describe('setPrevUIActive', () => {

      it('actions', () => {
        const store = mockStore({ nodes: null })
        store.dispatch(actions.setPrevUIActive())
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('SET_PREV_UI_ACTIVE')
      })
    })
  })
})

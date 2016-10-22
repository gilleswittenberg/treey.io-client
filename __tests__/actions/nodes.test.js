import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import * as actions from '../../app/actions/nodes'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const hostname = /treey\.io/

describe('nodes actions', () => {

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getNodes', () => {

    const uid = '57bedc40e81b0620300d769a'

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
              { uid: '57ebc46eb0bf9b00106a3c5e', title: 'bring home the milk' },
              { uid: '57ebc46eb0bf9b00106a3c5f', title: 'clean the house' }
            ]
          },
          {
            title: 'Movies',
            nodes: [
              { uid: '57ebc46eb0bf9b00106a3c60', title: 'Star Wars: Episode IV - A New Hope (1977)' },
              { uid: '57ebc46eb0bf9b00106a3c62', title: 'The Terminator (1984)' },
              { uid: '57ebc46eb0bf9b00106a3c61', title: 'The Matrix (1999)' }
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
        .post('/node/57bedc40e81b0620300d769a')
        .reply(500)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.postNode('57bedc40e81b0620300d769a'))
        .then(
          () => {
            const lastAction = store.getActions().pop()
            expect(lastAction.type).toEqual('HAS_ERRORS')
          }
        )
    })

    it('BAD_REQUEST', () => {
      nock(hostname)
        .post('/node/57bedc40e81b0620300d769a')
        .reply(400)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.postNode('57bedc40e81b0620300d769a'))
        .then(() => {
          const lastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('HAS_ERRORS')
        })
    })

    it('OK', () => {

      const parent = '57bedc40e81b0620300d769a'

      const data = {
        title: 'New User'
      }

      const body = {
        uid: '57bedc40e81b0620300d7691',
        title: 'New User'
      }

      nock(hostname)
        .post(`/node/${ parent }`, data)
        .reply(200, body)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.postNode(parent, data))
        .then(() => {
          const lastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('ADD_NODE')
          expect(lastAction.data).toEqual({ parent, node: body })
        })
    })
  })

  describe('putNode', () => {

    it('INTERNAL_SERVER_ERROR', () => {
      nock(hostname)
        .put('/node/57bedc40e81b0620300d769a')
        .reply(500)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.putNode('57bedc40e81b0620300d769a'))
        .then(
          () => {
            const lastAction = store.getActions().pop()
            expect(lastAction.type).toEqual('HAS_ERRORS')
          }
        )
    })

    it('BAD_REQUEST', () => {
      nock(hostname)
        .put('/node/57bedc40e81b0620300d769a')
        .reply(400)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.putNode('57bedc40e81b0620300d769a'))
        .then(() => {
          const lastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('HAS_ERRORS')
        })
    })

    it('OK', () => {

      const uid = '57bedc40e81b0620300d769a'

      const data = {
        title: 'New User'
      }

      const body = {
        uid,
        title: 'New User'
      }

      nock(hostname)
        .put(`/node/${ uid }`, data)
        .reply(200, body)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.putNode(uid, data))
        .then(() => {
          const lastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('UPDATE_NODE')
          expect(lastAction.data).toEqual({ uid, node: body })
        })
    })
  })

  describe('deleteNode', () => {

    const parent = '57bedc40e81b0620300d769a'
    const uid = '57bedc40e81b0620300d769b'

    it('INTERNAL_SERVER_ERROR', () => {

      nock(hostname)
        .delete(`/node/${ parent }/${ uid }`)
        .reply(500)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.deleteNode(parent, uid))
        .then(
          () => {
            const lastAction = store.getActions().pop()
            expect(lastAction.type).toEqual('HAS_ERRORS')
          }
        )
    })

    it('BAD_REQUEST', () => {

      nock(hostname)
        .delete(`/node/${ parent }/${ uid }`)
        .reply(400)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.deleteNode(parent, uid))
        .then(() => {
          const lastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('HAS_ERRORS')
        })
    })

    it('OK', () => {

      nock(hostname)
        .delete(`/node/${ parent }/${ uid }`)
        .reply(200)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.deleteNode(parent, uid))
        .then(() => {
          const lastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('REMOVE_NODE')
          expect(lastAction.data).toEqual({ parent, uid })
        })
    })
  })

  describe('putMoveNode', () => {

    const parent = '57bedc40e81b0620300d769a'
    const uid = '57bedc40e81b0620300d769b'
    const newParent = '57bedc40e81b0620300d769c'

    it('INTERNAL_SERVER_ERROR', () => {

      nock(hostname)
        .put(`/node/move/${ parent }/${ uid }/${ newParent }/`)
        .reply(500)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.putMoveNode(parent, uid, newParent))
        .then(
          () => {
            const lastAction = store.getActions().pop()
            expect(lastAction.type).toEqual('HAS_ERRORS')
          }
        )
    })

    it('BAD_REQUEST', () => {

      nock(hostname)
        .put(`/node/move/${ parent }/${ uid }/${ newParent }/`)
        .reply(400)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.putMoveNode(parent, uid, newParent))
        .then(() => {
          const lastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('HAS_ERRORS')
        })
    })

    it('OK', () => {

      nock(hostname)
        .put(`/node/move/${ parent }/${ uid }/${ newParent }/`)
        .reply(200)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.putMoveNode(parent, uid, newParent))
        .then(() => {
          const lastAction = store.getActions().pop()
          const secondLastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('STOP_SYNCING')
          expect(secondLastAction.type).toEqual('MOVE_NODE')
          expect(secondLastAction.data).toEqual({ parent, uid, newParent })
        })
    })
  })

})

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import * as actions from '../../app/actions/nodes'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const hostname = /treey\.io/

describe('action nodes', () => {

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getNodes', () => {

    it('INTERNAL_SERVER_ERROR', () => {
      nock(hostname)
        .get(`/node/${ actions.rootUid }`)
        .reply(500)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.getNodes())
        .then(
          () => {
            const lastAction = store.getActions().pop()
            expect(lastAction.type).toEqual('HAS_ERRORS')
          }
        )
    })

    it('NOT_FOUND', () => {
      nock(hostname)
        .get(`/node/${ actions.rootUid }`)
        .reply(404)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.getNodes())
        .then(() => {
          const lastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('HAS_ERRORS')
        })
    })

    it('BAD_REQUEST', () => {
      nock(hostname)
        .get(`/node/${ actions.rootUid }`)
        .reply(400)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.getNodes())
        .then(() => {
          const lastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('HAS_ERRORS')
        })
    })

    it('OK', () => {

      const body = {
        uid: '57bedc40e81b0620300d769a',
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
        .get(`/node/${ actions.rootUid }`)
        .reply(200, body)

      const store = mockStore({ nodes: null })

      return store.dispatch(actions.getNodes())
        .then(() => {
          const lastAction = store.getActions().pop()
          expect(lastAction.type).toEqual('INDEX_NODES')
          expect(lastAction.data.tree).toEqual(body)
        })
    })
  })
})

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
import * as actions from '../../app/actions/user'

const middlewares = [thunk, multi]
const mockStore = configureMockStore(middlewares)

const hostname = /treey\.io/
import { uuid } from '../uuid'

describe('actions user', () => {

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getUser', () => {

    it('UNAUTHORIZED', () => {
      nock(hostname)
        .get('/user')
        .reply(401)

      const store = mockStore()

      return store.dispatch(actions.getUser())
        .then(
          () => {
            const lastAction = store.getActions().pop()
            expect(lastAction.type).toEqual('UNAUTHENTICATED')
          }
        )
    })

    it('OK', () => {
      const body = { username: 'gilleswittenberg' }
      nock(hostname)
        .get('/user')
        .reply(200, body)

      const store = mockStore()

      return store.dispatch(actions.getUser())
        .then(
          () => {
            store.getActions().pop()
            const secondLastAction = store.getActions().pop()
            expect(secondLastAction.type).toEqual('AUTHENTICATE')
          }
        )
    })
  })

  describe('postAuthenticate', () => {

    it('UNAUTHORIZED', () => {
      nock(hostname)
        .post('/user/authenticate')
        .reply(401)

      const store = mockStore()

      return store.dispatch(actions.postAuthenticate('gilleswittenberg', 'incorrect'))
        .then(
          () => {
            const lastAction = store.getActions().pop()
            expect(lastAction.type).toEqual('AUTHENTICATION_FAILED')
          }
        )
    })

    it('ERROR', () => {
      nock(hostname)
        .post('/user/authenticate')
        .reply(500)

      const store = mockStore()

      return store.dispatch(actions.postAuthenticate('gilleswittenberg', 'incorrect'))
        .then(
          () => {
            const lastAction = store.getActions().pop()
            expect(lastAction.type).toEqual('AUTHENTICATION_ERROR')
          }
        )
    })

    it('OK', () => {
      const body = {
        username: 'gilleswittenberg',
        rootNode: uuid
      }
      nock(hostname)
        .post('/user/authenticate')
        .reply(200, body)

      const store = mockStore()

      return store.dispatch(actions.postAuthenticate('gilleswittenberg', 'hardcoded'))
        .then(
          () => {
            store.getActions().pop()
            const secondLastAction = store.getActions().pop()
            expect(secondLastAction.type).toEqual('AUTHENTICATE')
          }
        )
    })
  })

  describe('postSignOut', () => {

    it('ERROR', () => {
      nock(hostname)
        .post('/user/signout')
        .reply(500)

      const store = mockStore()

      return store.dispatch(actions.postSignOut())
        .then(
          () => {
            const lastAction = store.getActions().pop()
            expect(lastAction.type).toEqual('SIGN_OUT_FAILED')
          }
        )
    })

    it('OK', () => {
      nock(hostname)
        .post('/user/signout')
        .reply(200)

      const store = mockStore()

      return store.dispatch(actions.postSignOut())
        .then(
          () => {
            const lastAction = store.getActions().pop()
            expect(lastAction.type).toEqual('UNAUTHENTICATED')
          }
        )
    })
  })

  describe('postRegister', () => {

    it('ERROR', () => {
      nock(hostname)
        .post('/user/register')
        .reply(500)

      const store = mockStore()

      return store.dispatch(actions.postRegister('johndoe', '12345678', '12345678'))
        .then(
          () => {
            const lastAction = store.getActions().pop()
            expect(lastAction.type).toEqual('REGISTRATION_ERROR')
          }
        )
    })

    it('FAILURE', () => {
      nock(hostname)
        .post('/user/register')
        .reply(400)

      const store = mockStore()

      return store.dispatch(actions.postRegister('johndoe', '12345678', '12345678'))
        .then(
          () => {
            const lastAction = store.getActions().pop()
            expect(lastAction.type).toEqual('REGISTRATION_FAILED')
          }
        )
    })

    it('OK', () => {
      const body = {
        username: 'gilleswittenberg',
        rootNode: uuid
      }
      nock(hostname)
        .post('/user/register')
        .reply(201, body)

      const store = mockStore()

      return store.dispatch(actions.postRegister('johndoe', '12345678', '12345678'))
        .then(
          () => {
            store.getActions().pop()
            const secondLastAction = store.getActions().pop()
            expect(secondLastAction.type).toEqual('AUTHENTICATE')
          }
        )
    })
  })
})

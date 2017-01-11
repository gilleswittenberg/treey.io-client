/* @flow */

// required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import reducer from '../../app/reducers/user'
import {
  UNAUTHENTICATED,
  AUTHENTICATE,
  AUTHENTICATION_FAILED,
  AUTHENTICATION_ERROR,
  SIGN_OUT_FAILED
} from '../../app/actions/user'
import { uid } from '../uid'
import { defaultState } from '../../app/reducers/user'

describe('user reducer', () => {

  it('UNAUTHENTICATED', () => {
    expect(reducer(undefined, { type: UNAUTHENTICATED, data: {} }).loggedIn).toBe(false)
  })

  describe('AUTHENTICATE', () => {

    it('AUTHENTICATE', () => {
      const data = { username: 'gilleswittenberg', rootId: uid }
      const state = reducer(undefined, { type: AUTHENTICATE, data })
      expect(state.username).toBe('gilleswittenberg')
      expect(state.rootId).toBe(uid)
    })

    it('clear failure and error', () => {
      const data = { username: 'gilleswittenberg', rootId: uid }
      const state = { ...defaultState, authenticationFailed: true, authenticationError: true }
      const state2 = reducer(state, { type: AUTHENTICATE, data })
      expect(state2.authenticationFailed).toBe(false)
      expect(state2.authenticationError).toBe(false)
    })
  })

  it('AUTHENTICATION_FAILED', () => {
    const state = { ...defaultState, authenticationError: true }
    const state2 = reducer(state, { type: AUTHENTICATION_FAILED, data: {} })
    expect(state2.authenticationFailed).toBe(true)
    expect(state2.authenticationError).toBe(false)
  })

  it('AUTHENTICATION_ERROR', () => {
    const state = { ...defaultState, authenticationFailed: true }
    const state2 = reducer(state, { type: AUTHENTICATION_ERROR, data: {} })
    expect(state2.authenticationError).toBe(true)
    expect(state2.authenticationFailed).toBe(false)
  })

  it('SIGN_OUT_FAILED', () => {
    expect(reducer(undefined, { type: SIGN_OUT_FAILED, data: {} }).signOutFailed).toBe(true)
  })

  it('sign out', () => {
    const state = { ...defaultState, loggedIn: true, username: 'gilleswittenberg', rootId: uid }
    const state2 = reducer(state, { type: UNAUTHENTICATED, data: {} })
    expect(state2.username).toBe(null)
    expect(state2.rootId).toBe(null)
    expect(state2.loggedIn).toBe(false)
  })
})

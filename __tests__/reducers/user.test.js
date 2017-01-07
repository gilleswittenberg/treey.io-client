/* @flow */

// required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import reducer from '../../app/reducers/user'
import {
  UNAUTHENTICATED,
  AUTHENTICATE,
  AUTHENTICATION_FAILED
} from '../../app/actions/user'
import { uid } from '../uid'
import { defaultState } from '../../app/reducers/user'

describe('user reducer', () => {

  it('UNAUTHENTICATED', () => {
    expect(reducer(undefined, { type: UNAUTHENTICATED, data: {} }).loggedIn).toBe(false)
  })

  it('AUTHENTICATE', () => {
    const data = { username: 'gilleswittenberg', rootId: uid }
    const state = reducer(undefined, { type: AUTHENTICATE, data })
    expect(state.username).toBe('gilleswittenberg')
    expect(state.rootId).toBe(uid)
  })

  it('AUTHENTICATION_FAILED', () => {
    expect(reducer(undefined, { type: AUTHENTICATION_FAILED, data: {} }).authenticationFailed).toBe(true)
  })
})

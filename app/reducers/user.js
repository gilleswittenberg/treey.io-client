/* @flow */

import type { UserState, UserAction } from '../../flow/types'
import * as types from '../actions/user'

export const defaultState: UserState = {
  username: 'gilleswittenberg',
  authenticationFailed: false,
  loggedIn: null,
  rootId: null,
  signOutFailed: false
}

export default function user (state: UserState = defaultState, action: UserAction) {
  switch (action.type) {
  case types.UNAUTHENTICATED:
    return { ...state, loggedIn: false, username: null, rootId: null }
  case types.AUTHENTICATE:
    return { ...state, loggedIn: true, username: action.data.username, rootId: action.data.rootId }
  case types.AUTHENTICATION_FAILED:
    return { ...state, authenticationFailed: true }
  case types.SIGN_OUT_FAILED:
    return { ...state, signOutFailed: true }
  default:
    return { ...state }
  }
}

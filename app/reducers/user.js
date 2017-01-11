/* @flow */

import type { UserState, UserAction } from '../../flow/types'
import * as types from '../actions/user'

export const defaultState: UserState = {
  username: null,
  authenticationFailed: false,
  authenticationError: false,
  loggedIn: null,
  rootId: null,
  signOutFailed: false
}

export default function user (state: UserState = defaultState, action: UserAction) {
  switch (action.type) {
  case types.UNAUTHENTICATED:
    return { ...state, loggedIn: false, username: null, rootId: null }
  case types.AUTHENTICATE:
    return {
      ...state,
      username: action.data.username,
      authenticationFailed: false,
      authenticationError: false,
      loggedIn: true,
      rootId: action.data.rootId
    }
  case types.AUTHENTICATION_FAILED:
    return { ...state, authenticationFailed: true, authenticationError: false }
  case types.AUTHENTICATION_ERROR:
    return { ...state, authenticationError: true, authenticationFailed: false }
  case types.SIGN_OUT_FAILED:
    return { ...state, signOutFailed: true }
  default:
    return { ...state }
  }
}

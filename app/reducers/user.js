/* @flow */

import type { UserState, UserAction } from '../../flow/types'
import * as types from '../actions/user'
import { browserHistory } from 'react-router'

export const defaultState: UserState = {
  authenticationFailed: false,
  authenticationError: false,
  registrationFailed: false,
  registrationError: false,
  signOutFailed: false,
  loggedIn: null,
  username: null,
  rootId: null
}

export default function user (state: UserState = defaultState, action: UserAction) {
  switch (action.type) {
  case types.UNAUTHENTICATED:
    browserHistory.push('/login')
    // @TODO: Set signOutFailed to false
    return { ...state, loggedIn: false, username: null, rootId: null }
  case types.AUTHENTICATE:
    browserHistory.push('/')
    return {
      ...state,
      authenticationFailed: false,
      authenticationError: false,
      registerFailed: false,
      registerError: false,
      loggedIn: true,
      username: action.data.username,
      rootId: action.data.rootId
    }
  case types.AUTHENTICATION_FAILED:
    // @TODO: Set registrationError, registrationFailed to false
    return { ...state, authenticationFailed: true, authenticationError: false }
  case types.AUTHENTICATION_ERROR:
    // @TODO: Set registrationError, registrationFailed to false
    return { ...state, authenticationError: true, authenticationFailed: false }
  case types.SIGN_OUT_FAILED:
    return { ...state, signOutFailed: true }
  case types.REGISTRATION_FAILED:
    // @TODO: Set authenticationError, authenticationFailed to false
    return { ...state, registrationFailed: true, registrationError: false }
  case types.REGISTRATION_ERROR:
    // @TODO: Set authenticationError, authenticationFailed to false
    return { ...state, registrationFailed: false, registrationError: true }
  default:
    return { ...state }
  }
}

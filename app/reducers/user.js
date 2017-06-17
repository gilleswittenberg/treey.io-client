/* @flow */

import type { UserState, UserAction } from '../../flow/types'
import {
  UNAUTHENTICATED,
  AUTHENTICATE,
  AUTHENTICATION_FAILED,
  AUTHENTICATION_ERROR,
  SIGN_OUT_FAILED,
  REGISTRATION_FAILED,
  REGISTRATION_ERROR
} from '../actions/user'
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
  case UNAUTHENTICATED:
    // Indicates running from test
    // @TODO: Clean up
    if (browserHistory.getCurrentLocation().pathname !== 'blank') {
      browserHistory.replace('/login')
    }
    // @TODO: Set signOutFailed to false
    return { ...state, loggedIn: false, username: null, rootId: null }
  case AUTHENTICATE:
    // Indicates running from test
    // @TODO: Clean up
    if (browserHistory.getCurrentLocation().pathname !== 'blank') {
      browserHistory.replace('/')
    }
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
  case AUTHENTICATION_FAILED:
    // @TODO: Set registrationError, registrationFailed to false
    return { ...state, authenticationFailed: true, authenticationError: false }
  case AUTHENTICATION_ERROR:
    // @TODO: Set registrationError, registrationFailed to false
    return { ...state, authenticationError: true, authenticationFailed: false }
  case SIGN_OUT_FAILED:
    return { ...state, signOutFailed: true }
  case REGISTRATION_FAILED:
    // @TODO: Set authenticationError, authenticationFailed to false
    return { ...state, registrationFailed: true, registrationError: false }
  case REGISTRATION_ERROR:
    // @TODO: Set authenticationError, authenticationFailed to false
    return { ...state, registrationFailed: false, registrationError: true }
  default:
    return { ...state }
  }
}

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

export const defaultState: UserState = {
  authenticationFailed: false,
  authenticationError: false,
  registrationFailed: false,
  registrationError: false,
  signOutFailed: false,
  loggedIn: null,
  username: null,
  rootNode: null
}

export default function user (state: UserState = defaultState, action: UserAction) {

  switch (action.type) {
  case UNAUTHENTICATED:
    return {
      ...state,
      loggedIn: false,
      username: null,
      rootNode: null
    }
  case AUTHENTICATE:
    return {
      ...state,
      authenticationFailed: false,
      authenticationError: false,
      registerFailed: false,
      registerError: false,
      loggedIn: true,
      username: action.data.username,
      rootNode: action.data.rootNode
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

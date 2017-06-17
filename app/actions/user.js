/* @flow */

import type { NodeId } from '../../flow/tree'

import fetch from 'isomorphic-fetch'
import host from '../settings/host'
import { getNodes } from './nodes'
import fetchOptions from '../lib/utils/fetchOptions'

export const AUTHENTICATE = 'AUTHENTICATE'
export const authenticate = (username: string, rootId: NodeId) => {
  return {
    type: AUTHENTICATE,
    data: {
      username,
      rootId
    }
  }
}

export const UNAUTHENTICATED = 'UNAUTHENTICATED'
export const unauthenticated = () => {
  return {
    type: UNAUTHENTICATED
  }
}

export const AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED'
export const authenticationFailed = () => {
  return {
    type: AUTHENTICATION_FAILED
  }
}

export const AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR'
export const authenticationError = () => {
  return {
    type: AUTHENTICATION_ERROR
  }
}

export const SIGN_OUT_FAILED = 'SIGN_OUT_FAILED'
export const signOutFailed = () => {
  return {
    type: SIGN_OUT_FAILED
  }
}

export const REGISTRATION_FAILED = 'REGISTRATION_FAILED'
export const registrationFailed = () => {
  return {
    type: REGISTRATION_FAILED
  }
}

export const REGISTRATION_ERROR = 'REGISTRATION_ERROR'
export const registrationError = () => {
  return {
    type: REGISTRATION_ERROR
  }
}

export const getUser = () => {

  return (dispatch: () => void) => {

    const url = `${ host }/user`
    const options = fetchOptions()
    return fetch(url, options)
      .then(
        response => {
          if (response.ok === false) {
            return Promise.reject(new Error(response.statusText))
          }
          return response.json()
        }
      )
      .then(
        json => {
          dispatch(authenticate(json.username, json.rootId))
          dispatch(getNodes(json.rootId))
        },
        () => {
          dispatch(unauthenticated())
        }
      )
  }
}

export const postAuthenticate = (username: string, password: string) => {

  return (dispatch: () => void) => {

    const url = `${ host }/user/authenticate`
    const options = fetchOptions('POST', { username, password })

    return fetch(url, options)
      .then(
        response => {
          if (response.ok === false) {
            return Promise.reject(new Error(response.status))
          }
          return response.json()
        }
      )
      .then(
        json => {
          dispatch(authenticate(json.username, json.rootId))
          dispatch(getNodes(json.rootId))
        },
        error => {
          if (error.message === '401') {
            dispatch(authenticationFailed())
          } else {
            dispatch(authenticationError())
          }
        }
      )
  }
}

export const postSignOut = () => {

  return (dispatch: () => void) => {

    const url = `${ host }/user/signout`
    const options = fetchOptions('POST')

    return fetch(url, options)
      .then(
        response => {
          if (response.ok === false) {
            return Promise.reject(new Error(response.statusText))
          }
        }
      )
      .then(
        () => {
          dispatch(unauthenticated())
        },
        () => {
          dispatch(signOutFailed())
        }
      )
  }
}

export const postRegister = (username: string, password: string, passwordConfirm: string) => {

  return (dispatch: () => void) => {

    const url = `${ host }/user/register`
    const options = fetchOptions('POST', { username, password, passwordConfirm })

    return fetch(url, options)
      .then(
        response => {
          if (response.ok === false) {
            return Promise.reject(new Error(response.status))
          }
          return response.json()
        }
      )
      .then(
        json => {
          dispatch(authenticate(json.username, json.rootId))
          dispatch(getNodes(json.rootId))
        },
        error => {
          if (error.message === '400') {
            dispatch(registrationFailed())
          } else {
            dispatch(registrationError())
          }
        }
      )
  }
}

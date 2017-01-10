/* @flow */

import type { NodeId } from '../../flow/tree'

import fetch from 'isomorphic-fetch'
import host from '../settings/host'
import { getNodes } from './nodes'


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

export const SIGN_OUT_FAILED = 'SIGN_OUT_FAILED'
export const signOutFailed = () => {
  return {
    type: SIGN_OUT_FAILED
  }
}

export const getUser = () => {

  return function (dispatch: () => void) {

    const url = `${ host }/user`
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
      credentials: 'include'
    }

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

  return function (dispatch: () => void) {

    const url = `${ host }/user/authenticate`
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    }

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
          dispatch(authenticationFailed())
        }
      )
  }
}

export const postSignOut = () => {

  return function (dispatch: () => void) {

    const url = `${ host }/user/signout`
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }

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

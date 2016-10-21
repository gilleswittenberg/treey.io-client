/* @flow */

import fetch from 'isomorphic-fetch'
import type { Node, NodeData } from '../../flow/types'

let host
switch (process.env.NODE_ENV) {
case 'production':
  host = 'http://api.kee.plus:8081'
  break
case 'test':
  host = 'http://test.api.treey.io'
  break
case 'development':
default:
  host = `http://${ window.location.hostname }:8081`
}

const rootUid = '57bedc40e81b0620300d769a'

export const START_SYNCING = 'START_SYNCING'
export function startSyncing () {
  return {
    type: START_SYNCING
  }
}

export const STOP_SYNCING = 'STOP_SYNCING'
export function stopSyncing () {
  return {
    type: STOP_SYNCING
  }
}

export const HAS_ERRORS = 'HAS_ERRORS'
export function hasErrors () {
  return {
    type: HAS_ERRORS
  }
}

export const INDEX_NODES = 'INDEX_NODES'
export function indexNodes (tree: Node) {
  return {
    type: INDEX_NODES,
    data: {
      tree
    }
  }
}

export const GET_NODES = 'GET_NODES'
export function getNodes () {
  return function (dispatch: () => void) {
    dispatch(startSyncing())
    const url = `${ host }/node/${ rootUid }`
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    }
    return fetch(url, options)
      .then(
        response => {
          if (response.ok === false) {
            return Promise.reject(response.statusText)
          }
          return response.json()
        }
      )
      .then(
        json => {
          dispatch(stopSyncing())
          dispatch(indexNodes(json))
        },
        () => { // (error)
          dispatch(stopSyncing())
          dispatch(hasErrors())
        }
      )
  }
}

export const ADD_NODE = 'ADD_NODE'
export function addNode (parent: string, node: Node) {
  return {
    type: ADD_NODE,
    data: {
      node,
      parent
    }
  }
}

export const POST_NODE = 'POST_NODE'
export function postNode (parent: string, data: NodeData) {
  return function (dispatch: () => void) {
    dispatch(startSyncing())
    const url = `${ host }/node/${ parent }`
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
    return fetch(url, options)
      .then(
        response => {
          if (response.ok === false) {
            return Promise.reject(response.statusText)
          }
          return response.json()
        }
      )
      .then(
        json => {
          dispatch(stopSyncing())
          dispatch(addNode(parent, json))
        },
        () => {
          dispatch(stopSyncing())
          dispatch(hasErrors())
        }
      )
  }
}

export const UPDATE_NODE = 'UPDATE_NODE'
export function updateNode (uid: string, node: Node) {
  return {
    type: UPDATE_NODE,
    data: {
      uid,
      node
    }
  }
}

export const PUT_NODE = 'PUT_NODE'
export function putNode (uid: string, data: NodeData) {
  return function (dispatch: () => void) {
    dispatch(startSyncing())
    const url = `${ host }/node/${ uid }`
    const options = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
    return fetch(url, options)
      .then(
        response => {
          if (response.ok === false) {
            return Promise.reject(response.statusText)
          }
          return response.json()
        }
      )
      .then(
        json => {
          dispatch(stopSyncing())
          dispatch(updateNode(uid, json))
        },
        () => {
          dispatch(stopSyncing())
          dispatch(hasErrors())
        }
      )
  }
}

export const REMOVE_NODE = 'REMOVE_NODE'
export function removeNode (parent: string, uid: string) {
  return {
    type: REMOVE_NODE,
    data: {
      parent,
      uid
    }
  }
}

export const DELETE_NODE = 'DELETE_NODE'
export function deleteNode (parent: string, uid: string) {
  return function (dispatch: () => void) {
    dispatch(startSyncing())
    const url = `${ host }/node/${ parent }/${ uid }`
    const options = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json'
      }
    }
    fetch(url, options)
      .then(
        response => {
          dispatch(stopSyncing())
          if (response.ok === false) {
            throw new Error(response.statusText)
          } else {
            dispatch(removeNode(parent, uid))
          }
        },
        response => {
          dispatch(stopSyncing())
          throw new Error(response)
        }
      )
      .catch(() => dispatch(hasErrors()))
  }
}

export const MOVE_NODE = 'MOVE_NODE'
export function moveNode (parent: string, uid: string, newParent: string, before: string) {
  return {
    type: MOVE_NODE,
    data: {
      parent,
      uid,
      newParent,
      before
    }
  }
}

export const PUT_MOVE_NODE = 'PUT_MOVE_NODE'
export function putMoveNode (parent: string, uid: string, newParent: string, before: string) {
  return function (dispatch: () => void) {
    dispatch(startSyncing())
    dispatch(moveNode(parent, uid, newParent, before))
    before = before || ''
    const url = `${ host }/node/move/${ parent }/${ uid }/${ newParent }/${ before }`
    const options = {
      method: 'PUT',
      headers: {
        Accept: 'application/json'
      }
    }
    fetch(url, options)
      .then(
        response => {
          dispatch(stopSyncing())
          if (response.ok === false) {
            throw new Error(response.statusText)
          }
        },
        response => {
          dispatch(stopSyncing())
          throw new Error(response)
        }
      )
      .catch(() => dispatch(hasErrors()))
  }
}

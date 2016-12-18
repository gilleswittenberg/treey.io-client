/* @flow */

import fetch from 'isomorphic-fetch'
import type { TreePath, NodeId, NodeData } from '../../flow/tree'
import { getParentFromPath, getUidFromPath } from '../../app/lib/tree/TreeUtils'

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

// backend
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
export function indexNodes (tree: any) {
  return {
    type: INDEX_NODES,
    data: {
      tree
    }
  }
}

// ui
export const CLEAR_NODE_UI = 'CLEAR_NODE_UI'
export const UPDATE_NODE_UI = 'UPDATE_NODE_UI'

export function clearUIEditingAdding () {
  return {
    type: CLEAR_NODE_UI,
    data: {
      keys: ['editing', 'adding']
    }
  }
}

export const SET_UI_EDITING = 'SET_UI_EDITING'
export function setUIEditing (path: TreePath, value: boolean = true) {
  return [
    clearUIEditingAdding(),
    {
      type: UPDATE_NODE_UI,
      data: {
        path,
        key: 'editing',
        value
      }
    }
  ]
}

export const SET_UI_ADDING = 'SET_UI_ADDING'
export function setUIAdding (path: TreePath, value: boolean = true) {
  return [
    clearUIEditingAdding(),
    {
      type: UPDATE_NODE_UI,
      data: {
        path,
        key: 'adding',
        value
      }
    }
  ]
}

export function setUIActive (path: TreePath, value: boolean = true) {
  return [
    {
      type: CLEAR_NODE_UI,
      data: {
        keys: ['active']
      }
    },
    {
      type: UPDATE_NODE_UI,
      data: {
        path,
        key: 'active',
        value
      }
    }
  ]
}

export function setUIExpanded (path: TreePath, value: boolean = true) {
  return {
    type: UPDATE_NODE_UI,
    data: {
      path,
      key: 'expanded',
      value
    }
  }
}

export function clearUIMovingChild () {
  return {
    type: CLEAR_NODE_UI,
    data: {
      keys: ['movingChild']
    }
  }
}

export function clearUIButtonsShown () {
  return {
    type: CLEAR_NODE_UI,
    data: {
      keys: ['buttonsShown']
    }
  }
}

export function clearUIDragging () {
  return {
    type: CLEAR_NODE_UI,
    data: {
      keys: ['dragging']
    }
  }
}

// @TODO: movingChild is unique, so CLEAR_NODE_UI
export function setUIMovingChild (path: TreePath, value: boolean = true) {
  return {
    type: UPDATE_NODE_UI,
    data: {
      path,
      key: 'movingChild',
      value
    }
  }
}

// @TODO: dragging is unique, so CLEAR_NODE_UI
export function setUIDragging (path: TreePath, value: boolean = true) {
  return {
    type: UPDATE_NODE_UI,
    data: {
      path,
      key: 'dragging',
      value
    }
  }
}

// @TODO: buttonsShown is unique, so CLEAR_NODE_UI
export function setUIButtonsShown (path: TreePath, value: boolean = true) {
  return {
    type: UPDATE_NODE_UI,
    data: {
      path,
      key: 'buttonsShown',
      value
    }
  }
}

export const UPDATE_ACTIVE_NODE_UI = 'UPDATE_ACTIVE_NODE_UI'
export function updateActiveNodeUI (key: string, value: boolean = true) {
  return {
    type: UPDATE_ACTIVE_NODE_UI,
    data: {
      key,
      value
    }
  }
}

export const SET_NEXT_UI_ACTIVE = 'SET_NEXT_UI_ACTIVE'
export function setNextUIActive () {
  return {
    type: SET_NEXT_UI_ACTIVE
  }
}
export const SET_PREV_UI_ACTIVE = 'SET_PREV_UI_ACTIVE'
export function setPrevUIActive () {
  return {
    type: SET_PREV_UI_ACTIVE
  }
}

export const GET_NODES = 'GET_NODES'
export function getNodes (uid: NodeId) {
  return function (dispatch: () => void) {
    dispatch(startSyncing())
    const url = `${ host }/node/${ uid }`
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
            return Promise.reject(new Error(response.statusText))
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
export function addNode (path: TreePath, json: any) {
  const node = {
    data: {
      title: json.title
    }
  }
  return {
    type: ADD_NODE,
    data: {
      path,
      node
    }
  }
}

export const POST_NODE = 'POST_NODE'
export function postNode (path: TreePath, data: NodeData) {

  const parent = getUidFromPath(path)

  // guard
  if (parent == null) { return }

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
            return Promise.reject(new Error(response.statusText))
          }
          return response.json()
        }
      )
      .then(
        json => {
          dispatch(stopSyncing())
          dispatch(addNode(path, json))
        },
        () => {
          dispatch(stopSyncing())
          dispatch(hasErrors())
        }
      )
  }
}

export const UPDATE_NODE = 'UPDATE_NODE'
export function updateNode (path: TreePath, json: any) {
  const node = {
    data: {
      title: json.title
    }
  }
  return {
    type: UPDATE_NODE,
    data: {
      path,
      node
    }
  }
}

export const PUT_NODE = 'PUT_NODE'
export function putNode (path: TreePath, data: NodeData) {

  const uid = getUidFromPath(path)

  // guard
  if (uid == null) { return }

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
            return Promise.reject(new Error(response.statusText))
          }
          return response.json()
        }
      )
      .then(
        json => {
          dispatch(stopSyncing())
          dispatch(updateNode(path, json))
        },
        () => {
          dispatch(stopSyncing())
          dispatch(hasErrors())
        }
      )
  }
}

export const REMOVE_NODE = 'REMOVE_NODE'
export function removeNode (path: TreePath) {
  return {
    type: REMOVE_NODE,
    data: {
      path
    }
  }
}

export const DELETE_NODE = 'DELETE_NODE'
export function deleteNode (path: TreePath) {

  const parent = getParentFromPath(path)
  const uid = getUidFromPath(path)

  // guard
  if (parent == null || uid == null) { return }

  return function (dispatch: () => void) {
    dispatch(startSyncing())
    const url = `${ host }/node/${ parent }/${ uid }`
    const options = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json'
      }
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
          dispatch(stopSyncing())
          dispatch(removeNode(path))
        },
        () => {
          dispatch(stopSyncing())
          dispatch(hasErrors())
        }
      )
  }
}

export const MOVE_NODE = 'MOVE_NODE'
// @TODO: use path, newPath argument
// @TODO: remove parent, uid arguments, extract parent, uid from path
export function moveNode (path: TreePath, newPath: TreePath, before?: NodeId) {

  return {
    type: MOVE_NODE,
    data: {
      path,
      newPath,
      before
    }
  }
}

export const PUT_MOVE_NODE = 'PUT_MOVE_NODE'
// @TODO: remove parent, uid arguments, extract parent, uid from path
export function putMoveNode (path: TreePath, newPath: TreePath, before?: NodeId) {

  const parent = getParentFromPath(path)
  const uid = getUidFromPath(path)
  const newParent = getUidFromPath(newPath)

  // guard
  if (parent == null || uid == null || newParent == null) { return }

  return function (dispatch: () => void) {
    dispatch(startSyncing())
    dispatch(moveNode(path, newPath, before))
    before = before || ''
    const url = `${ host }/node/move/${ parent }/${ uid }/${ newParent }/${ before }`
    const options = {
      method: 'PUT',
      headers: {
        Accept: 'application/json'
      }
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
          dispatch(stopSyncing())
        },
        () => {
          dispatch(stopSyncing())
          dispatch(hasErrors())
        }
      )
  }
}

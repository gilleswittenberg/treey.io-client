/* @flow */

import fetch from 'isomorphic-fetch'
import type { TreePath, NodeId, NodeData, Transaction, TransactionStatus } from '../../flow/tree'
import { getParentFromPath, getUidFromPath } from '../../app/lib/tree/TreeUtils'
import createTransaction from '../../app/lib/tree/createTransaction'

import host from '../settings/host'

// backend
export const START_SYNCING = 'START_SYNCING'
export const startSyncing = () => {
  return {
    type: START_SYNCING
  }
}

export const STOP_SYNCING = 'STOP_SYNCING'
export const stopSyncing = () => {
  return {
    type: STOP_SYNCING
  }
}

export const HAS_ERRORS = 'HAS_ERRORS'
export const hasErrors = () => {
  return {
    type: HAS_ERRORS
  }
}

export const INDEX_NODES = 'INDEX_NODES'
export const indexNodes = (tree: {}) => {
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

export const clearUIEditingAdding = () => {
  return {
    type: CLEAR_NODE_UI,
    data: {
      keys: ['editing', 'adding']
    }
  }
}

export const SET_UI_EDITING = 'SET_UI_EDITING'
export const setUIEditing = (path: TreePath, value: boolean = true) => {
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
export const setUIAdding = (path: TreePath, value: boolean = true) => {
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

export const setUIActive = (path: TreePath, value: boolean = true) => {
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

export const setUIExpanded = (path: TreePath, value: boolean = true) => {
  return {
    type: UPDATE_NODE_UI,
    data: {
      path,
      key: 'expanded',
      value
    }
  }
}

export const clearUIMovingChild = () => {
  return {
    type: CLEAR_NODE_UI,
    data: {
      keys: ['movingChild']
    }
  }
}

export const clearUIButtonsShown = () => {
  return {
    type: CLEAR_NODE_UI,
    data: {
      keys: ['buttonsShown']
    }
  }
}

export const clearUIDragging = () => {
  return {
    type: CLEAR_NODE_UI,
    data: {
      keys: ['dragging']
    }
  }
}

export const setUIMovingChild = (path: TreePath, value: boolean = true) => {
  return [
    clearUIMovingChild(),
    {
      type: UPDATE_NODE_UI,
      data: {
        path,
        key: 'movingChild',
        value
      }
    }
  ]
}

export const setUIDragging = (path: TreePath, value: boolean = true) => {
  return [
    clearUIDragging(),
    {
      type: UPDATE_NODE_UI,
      data: {
        path,
        key: 'dragging',
        value
      }
    }
  ]
}

export const setUIButtonsShown = (path: TreePath, value: boolean = true) => {
  return [
    clearUIButtonsShown(),
    {
      type: UPDATE_NODE_UI,
      data: {
        path,
        key: 'buttonsShown',
        value
      }
    }
  ]
}

export const UPDATE_ACTIVE_NODE_UI = 'UPDATE_ACTIVE_NODE_UI'
export const updateActiveNodeUI = (key: string, value: boolean = true) => {
  return {
    type: UPDATE_ACTIVE_NODE_UI,
    data: {
      key,
      value
    }
  }
}

export const SET_NEXT_UI_ACTIVE = 'SET_NEXT_UI_ACTIVE'
export const setNextUIActive = () => {
  return {
    type: SET_NEXT_UI_ACTIVE
  }
}
export const SET_PREV_UI_ACTIVE = 'SET_PREV_UI_ACTIVE'
export const setPrevUIActive = () => {
  return {
    type: SET_PREV_UI_ACTIVE
  }
}

export const GET_NODES = 'GET_NODES'
export const getNodes = (rootId: NodeId) => {
  return function (dispatch: () => void) {
    dispatch(startSyncing())
    const url = `${ host }/node/${ rootId }`
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
export const addNode = (path: TreePath, json: any) => {
  const uid = json.uid
  const nodeData = json.data
  return {
    type: ADD_NODE,
    data: {
      path,
      uid,
      nodeData
    }
  }
}

export const POST_NODE = 'POST_NODE'
export const postNode = (path: TreePath, data: NodeData) => {

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
      credentials: 'include',
      body: JSON.stringify({ data })
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
export const updateNode = (path: TreePath, json: any) => {
  const nodeData = json.data
  return {
    type: UPDATE_NODE,
    data: {
      path,
      nodeData
    }
  }
}

export const PUT_NODE = 'PUT_NODE'
export const putNode = (path: TreePath, data: NodeData) => {

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
      credentials: 'include',
      body: JSON.stringify({ data })
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

export const ADD_NODE_TRANSACTION = 'ADD_NODE_TRANSACTION'
export const addNodeTransaction = (path: TreePath, transaction: Transaction) => {
  return {
    type: ADD_NODE_TRANSACTION,
    data: {
      path,
      transaction
    }
  }
}

export const UPDATE_NODE_TRANSACTION_STATUS = 'UPDATE_NODE_TRANSACTION_STATUS'
export const updateNodeTransactionStatus = (path: TreePath, transaction: Transaction, status: TransactionStatus) => {
  return {
    type: UPDATE_NODE_TRANSACTION_STATUS,
    data: {
      path,
      transaction,
      status
    }
  }
}

export const create = (parentPath: TreePath, data: NodeData) => {
  return (dispatch: () => void) => {
    const transaction0 = createTransaction('CREATE')
    dispatch(addNodeTransaction(parentPath, transaction0))
    const transaction1 = createTransaction('SET', data)
    const path = parentPath.concat([transaction0.uid])
    dispatch(addNodeTransaction(path, transaction1))
    const transaction2 = createTransaction('ADD_CHILD', parentPath, transaction0.uid)
    dispatch(addNodeTransaction(parentPath, transaction2))
    dispatch(postNodeTransactions(path, [transaction0, transaction1]))
    return dispatch(patchNode(parentPath, transaction2))
  }
}

export const update = (path: TreePath, data: NodeData) => {
  return (dispatch: () => void) => {
    const transaction = createTransaction('SET', data)
    dispatch(addNodeTransaction(path, transaction))
    return dispatch(patchNode(path, transaction))
  }
}

export const removeChild = (path: TreePath) => {

  const parent = getParentFromPath(path)
  const uid = getUidFromPath(path)

  // guard
  if (parent == null || uid == null) return

  const parentPath = path.slice(0, -1)

  return (dispatch: () => void) => {
    const transaction = createTransaction('REMOVE_CHILD', undefined, uid)
    dispatch(addNodeTransaction(parentPath, transaction))
    return dispatch(patchNode(parentPath, transaction))
  }
}

export const addChild = (path: TreePath, uid: NodeId, before?: NodeId) => {

  return (dispatch: () => void) => {
    const transaction = createTransaction('ADD_CHILD', undefined, uid, before)
    dispatch(addNodeTransaction(path, transaction))
    return dispatch(patchNode(path, transaction))
  }
}

export const move = (path: TreePath, newPath: TreePath, before?: NodeId) => {

  const uid = getUidFromPath(path)

  // guard
  if (!uid) return

  return (dispatch: () => void) => {
    dispatch(removeChild(path))
    dispatch(addChild(newPath, uid, before))
  }
}

export const postNodeTransactions = (path: TreePath, transactions: Transaction[]) => {

  return (dispatch: () => void) => {
    dispatch(startSyncing())
    const url = `${ host }/node_transactions`
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ transactions })
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
          transactions.forEach(transaction => {
            dispatch(updateNodeTransactionStatus(path, transaction, json.status))
          })
        },
        () => {
          dispatch(stopSyncing())
          dispatch(hasErrors())
        }
      )
  }
}

export const patchNode = (path: TreePath, transaction: Transaction) => {

  const uid = getUidFromPath(path)

  // guard
  if (uid == null) return

  return (dispatch: () => void) => {
    dispatch(startSyncing())
    const url = `${ host }/node/${ uid }`
    const options = {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ transaction })
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
          dispatch(updateNodeTransactionStatus(path, transaction, json.status))
        },
        () => {
          dispatch(stopSyncing())
          dispatch(hasErrors())
        }
      )
  }
}

export const REMOVE_NODE = 'REMOVE_NODE'
export const removeNode = (path: TreePath) => {
  return {
    type: REMOVE_NODE,
    data: {
      path
    }
  }
}

export const DELETE_NODE = 'DELETE_NODE'
export const deleteNode = (path: TreePath) => {

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
export const moveNode = (path: TreePath, newPath: TreePath, before?: NodeId) => {

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
export const putMoveNode = (path: TreePath, newPath: TreePath, before?: NodeId) => {

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
          dispatch(stopSyncing())
        },
        () => {
          dispatch(stopSyncing())
          dispatch(hasErrors())
        }
      )
  }
}

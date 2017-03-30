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

export const ADD_NODE_TRANSACTION = 'ADD_NODE_TRANSACTION'
export const addNodeTransaction = (transaction: Transaction) => {
  return {
    type: ADD_NODE_TRANSACTION,
    data: {
      transaction
    }
  }
}

export const UPDATE_NODE_TRANSACTION_STATUS = 'UPDATE_NODE_TRANSACTION_STATUS'
export const updateNodeTransactionStatus = (transaction: Transaction, status: TransactionStatus) => {
  return {
    type: UPDATE_NODE_TRANSACTION_STATUS,
    data: {
      transaction,
      status
    }
  }
}

export const create = (parentPath: TreePath, data: NodeData) => {
  return (dispatch: () => void) => {
    const transaction0 = createTransaction('CREATE')
    const transaction1 = createTransaction('SET', transaction0.uid, data)
    const uid = getUidFromPath(parentPath)
    const transaction2 = createTransaction('ADD_CHILD', uid, transaction0.uid)
    dispatch(addNodeTransaction(transaction0))
    dispatch(addNodeTransaction(transaction1))
    dispatch(addNodeTransaction(transaction2))
    return dispatch(postTransactions([transaction0, transaction1, transaction2]))
  }
}

export const update = (path: TreePath, data: NodeData) => {

  const uid = getUidFromPath(path)

  // guard
  if (uid == null) return

  return (dispatch: () => void) => {
    const transaction = createTransaction('SET', uid, data)
    dispatch(addNodeTransaction(transaction))
    return dispatch(postTransactions([transaction]))
  }
}

export const remove = (path: TreePath) => {

  const parent = getParentFromPath(path)
  const uid = getUidFromPath(path)

  // guard
  if (parent == null || uid == null) return

  return (dispatch: () => void) => {
    const transaction = createTransaction('REMOVE_CHILD', parent, undefined, uid)
    dispatch(addNodeTransaction(transaction))
    return dispatch(postTransactions([transaction]))
  }
}

export const move = (path: TreePath, newPath: TreePath, before?: NodeId) => {

  const uid = getUidFromPath(path)
  const parent = getParentFromPath(path)
  const newParent = getUidFromPath(newPath)

  // guard
  if (uid == null || parent == null || newParent == null) return

  return (dispatch: () => void) => {
    const transaction0 = createTransaction('REMOVE_CHILD', parent, undefined, uid)
    const transaction1 = createTransaction('ADD_CHILD', newParent, undefined, uid, before)
    return dispatch(postTransactions([transaction0, transaction1]))
  }
}

export const postTransactions = (transactions: Transaction[]) => {

  return (dispatch: () => void) => {
    dispatch(startSyncing())
    const url = `${ host }/nodes/transactions`
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
          transactions.forEach((transaction, index) => {
            const status = json.transactions[index].status
            dispatch(updateNodeTransactionStatus(transaction, status))
          })
        },
        () => {
          dispatch(stopSyncing())
          dispatch(hasErrors())
        }
      )
  }
}

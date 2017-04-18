/* @flow */

import fetch from 'isomorphic-fetch'
import type { TreePath, Nodes, NodeId, NodeData, Transaction, TransactionStatus } from '../../flow/tree'
import { getParentFromPath, getUidFromPath } from '../../app/lib/tree/TreeUtils2'
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
export const indexNodes = (nodes: Nodes) => {
  return {
    type: INDEX_NODES,
    data: {
      nodes
    }
  }
}

export const GET_NODES = 'GET_NODES'
export const getNodes = (rootId: NodeId) => {
  return function (dispatch: () => void) {
    dispatch(startSyncing())
    const url = `${ host }/nodes/${ rootId }`
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
          dispatch(indexNodes(json.nodes))
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

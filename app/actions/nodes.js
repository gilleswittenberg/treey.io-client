/* @flow */

import fetch from 'isomorphic-fetch'
import type { TreePath, Nodes, NodeId, NodeData, Transaction, TransactionStatus } from '../../flow/tree'
import { getParentFromTreePath, getNodeFromTreePath } from '../lib/tree/TreeUtils'
import createTransaction from '../lib/node/createTransaction'
import { initUIRoot, unsetUIExpanded } from './ui'
import fetchOptions from '../lib/utils/fetchOptions'

import host from '../settings/host'

// Actions
export const START_SYNCING = 'START_SYNCING'
export const STOP_SYNCING = 'STOP_SYNCING'
export const HAS_ERRORS = 'HAS_ERRORS'
export const INDEX_NODES = 'INDEX_NODES'
export const GET_NODES = 'GET_NODES'
export const ADD_NODE_TRANSACTION = 'ADD_NODE_TRANSACTION'
export const UPDATE_NODE_TRANSACTION_STATUS = 'UPDATE_NODE_TRANSACTION_STATUS'

// Action creators
export const startSyncing = () => {
  return {
    type: START_SYNCING
  }
}

export const stopSyncing = () => {
  return {
    type: STOP_SYNCING
  }
}

export const hasErrors = () => {
  return {
    type: HAS_ERRORS
  }
}

export const indexNodes = (nodes: Nodes) => {
  return {
    type: INDEX_NODES,
    data: {
      nodes
    }
  }
}

export const getNodes = (rootNode: NodeId) => {
  return (dispatch: (action: any) => void) => {
    dispatch(startSyncing())
    const url = `${ host }/nodes/${ rootNode }`
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
          dispatch(initUIRoot(json.nodes))
        },
        () => { // (error)
          dispatch(stopSyncing())
          dispatch(hasErrors())
        }
      )
  }
}

export const addNodeTransaction = (transaction: Transaction) => {
  return {
    type: ADD_NODE_TRANSACTION,
    data: {
      transaction
    }
  }
}

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
  const transaction0 = createTransaction('CREATE')
  const node = transaction0.node
  const transaction1 = createTransaction('SET', node, data)
  const parent = getNodeFromTreePath(parentPath)
  const transaction2 = createTransaction('ADD_CHILD', parent, undefined, node)
  return [
    addNodeTransaction(transaction0),
    addNodeTransaction(transaction1),
    addNodeTransaction(transaction2),
    postTransactions([transaction0, transaction1, transaction2])
  ]
}

export const update = (path: TreePath, data: NodeData) => {

  const node = getNodeFromTreePath(path)

  // Guard
  if (node == null) return

  const transaction = createTransaction('SET', node, data)

  return [
    addNodeTransaction(transaction),
    postTransactions([transaction])
  ]
}

export const remove = (path: TreePath) => {

  const parent = getParentFromTreePath(path)
  const node = getNodeFromTreePath(path)

  // Guard
  if (parent == null || node == null) return

  const transaction = createTransaction('REMOVE_CHILD', parent, undefined, node)

  return [
    unsetUIExpanded(path),
    addNodeTransaction(transaction),
    postTransactions([transaction])
  ]
}

export const move = (path: TreePath, newPath: TreePath, before?: NodeId) => {

  const node = getNodeFromTreePath(path)
  const parent = getParentFromTreePath(path)
  const newParent = getNodeFromTreePath(newPath)

  // Guard
  if (node == null || parent == null || newParent == null) return

  const transaction0 = createTransaction('REMOVE_CHILD', parent, undefined, node)
  const transaction1 = createTransaction('ADD_CHILD', newParent, undefined, node, before)

  return [
    unsetUIExpanded(path),
    addNodeTransaction(transaction0),
    addNodeTransaction(transaction1),
    postTransactions([transaction0, transaction1])
  ]
}

const postTransactions = (transactions: Transaction[]) => {

  return (dispatch: (action: any) => void) => {
    dispatch(startSyncing())
    const url = `${ host }/nodes/transactions`
    const options = fetchOptions('POST', { transactions })
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
          json.transactions.forEach((transaction, index) => {
            // Guard
            if (!Array.isArray(json.transactions) || json.transactions[index] == null || json.transactions[index].status == null) return
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

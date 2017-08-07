/* @flow */

import type { TreePath, Nodes, NodeId, NodeData, Transactions, Transaction, TransactionStatus } from '../../flow/tree'
import type { NodesAction } from '../../flow/types'
import fetch from 'isomorphic-fetch'
import { getParentFromTreePath, getNodeFromTreePath } from '../lib/tree/TreeUtils'
import createTransaction from '../lib/node/createTransaction'
import { initUIRoot, unsetUIExpandedDeep, setUIActive } from './ui'
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
export const SET_NODE_TRANSACTION_IS_SYNCING = 'SET_NODE_TRANSACTION_IS_SYNCING'

// Action creators
export const startSyncing = () : NodesAction => (
  {
    type: START_SYNCING,
    data: {}
  }
)

export const stopSyncing = () : NodesAction => (
  {
    type: STOP_SYNCING,
    data: {}
  }
)

export const hasErrors = () : NodesAction => (
  {
    type: HAS_ERRORS,
    data: {}
  }
)

export const indexNodes = (nodes: Nodes) : NodesAction => (
  {
    type: INDEX_NODES,
    data: { nodes }
  }
)

// @TODO: Specify return type
export const getNodes = (rootNode: NodeId) => (dispatch: (action: any) => void) => {
  dispatch(startSyncing())
  const url = `${ host }/nodes/${ rootNode }`
  const options = {
    method: 'GET',
    headers: { Accept: 'application/json' },
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
      // Errors
      () => {
        dispatch(stopSyncing())
        dispatch(hasErrors())
      }
    )
}

export const addNodeTransaction = (transaction: Transaction) : NodesAction => (
  {
    type: ADD_NODE_TRANSACTION,
    data: { transaction }
  }
)

export const updateNodeTransactionStatus = (transaction: Transaction, status: TransactionStatus) : NodesAction => (
  {
    type: UPDATE_NODE_TRANSACTION_STATUS,
    data: {
      transaction,
      status
    }
  }
)

export const setNodeTransactionIsSyncing = (transaction: Transaction, isSyncing: boolean) : NodesAction => (
  {
    type: SET_NODE_TRANSACTION_IS_SYNCING,
    data: {
      transaction,
      isSyncing
    }
  }
)

// @TODO: Specify return type
const postTransactions = (transactions: Transactions) => {

  // Only post PENDING transactions
  const transactionsPending = transactions.filter(transaction => transaction.status === 'PENDING')

  // Guard
  if (transactionsPending.length === 0) return

  return (dispatch: (action: any) => void) => {
    // Global syncing
    dispatch(startSyncing())
    // Transactions syncing
    transactionsPending.forEach(transaction => dispatch(setNodeTransactionIsSyncing(transaction, true)))
    // POST request
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
          transactionsPending.forEach(transaction => dispatch(setNodeTransactionIsSyncing(transaction, false)))
          // Guard
          if (!Array.isArray(json.transactions)) return
          json.transactions.forEach(transaction => {
            const status = transaction.status
            // Guard
            if (status == null) return
            dispatch(updateNodeTransactionStatus(transaction, status))
          })
        },
        () => {
          dispatch(stopSyncing())
          transactionsPending.forEach(transaction => dispatch(setNodeTransactionIsSyncing(transaction, false)))
          dispatch(hasErrors())
        }
      )
  }
}

// @TODO: Specify return type (?NodesAction[])
export const create = (parentPath: TreePath, data: NodeData) => {
  const transaction0 = createTransaction('CREATE')
  const node = transaction0.node
  const transaction1 = createTransaction('SET', node, data)
  const parent = getNodeFromTreePath(parentPath)
  const transaction2 = createTransaction('ADD_CHILD', parent, undefined, node)
  const path = parentPath.concat(transaction0.node)
  return [
    addNodeTransaction(transaction0),
    addNodeTransaction(transaction1),
    addNodeTransaction(transaction2),
    setUIActive(path),
    postTransactions([transaction0, transaction1, transaction2])
  ]
}

// @TODO: Specify return type (?NodesAction[])
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

// @TODO: Specify return type (?NodesAction[])
export const remove = (path: TreePath) => {

  const parent = getParentFromTreePath(path)
  const node = getNodeFromTreePath(path)

  // Guard
  if (parent == null || node == null) return

  const transaction = createTransaction('REMOVE_CHILD', parent, undefined, node)

  return [
    addNodeTransaction(transaction),
    unsetUIExpandedDeep(path),
    postTransactions([transaction])
  ]
}

// @TODO: Specify return type (?NodesAction[])
export const move = (path: TreePath, newPath: TreePath, before?: NodeId) => {

  const node = getNodeFromTreePath(path)
  const parent = getParentFromTreePath(path)
  const newParent = getNodeFromTreePath(newPath)

  // Guard
  if (node == null || parent == null || newParent == null) return

  const transaction0 = createTransaction('REMOVE_CHILD', parent, undefined, node)
  const transaction1 = createTransaction('ADD_CHILD', newParent, undefined, node, before)

  const newActivePath = newPath.concat(node)

  return [
    addNodeTransaction(transaction0),
    addNodeTransaction(transaction1),
    unsetUIExpandedDeep(path),
    setUIActive(newActivePath),
    postTransactions([transaction0, transaction1])
  ]
}

// @TODO: Specify return type (?NodesAction)
export const syncTransaction = (transaction: Transaction) => {
  // Guard
  if (transaction.status !== 'PENDING') return
  const transactions = [transaction]
  return postTransactions(transactions)
}

export const cancelTransaction = (transaction: Transaction) : ?NodesAction => {
  // Guard
  if (transaction.status !== 'PENDING' || transaction.isSyncing === true) return
  return updateNodeTransactionStatus(transaction, 'CANCELLED')
}

// @TODO: Specify return type (?NodesAction[])
export const revertTransaction = (transaction: Transaction) => {
  // Guard
  if (transaction.status !== 'COMMITTED') return
  const node = transaction.node
  const uuid = transaction.uuid
  const transactionRevert = createTransaction('REVERT', undefined, undefined, node, undefined, uuid)
  return [
    addNodeTransaction(transactionRevert),
    postTransactions([transactionRevert])
  ]
}

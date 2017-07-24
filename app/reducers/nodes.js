/* @flow */

import type { NodesState, NodesAction } from '../../flow/types'
import {
  START_SYNCING,
  STOP_SYNCING,
  HAS_ERRORS,
  INDEX_NODES,
  ADD_NODE_TRANSACTION,
  UPDATE_NODE_TRANSACTION_STATUS,
  SET_NODE_TRANSACTION_IS_SYNCING
} from '../actions/nodes'
import { fromJS } from 'immutable'
import createNode from '../lib/node/createNode'
import getNodeData from '../lib/node/getNodeData'
import getNodes from '../lib/node/getNodes'

export const defaultState: NodesState = {
  isSyncing: false,
  hasErrors: false,
  nodes: []
}

export default function nodes (state: NodesState = defaultState, action: NodesAction) : NodesState {

  // Backend
  switch (action.type) {
  case START_SYNCING:
    return { ...state, isSyncing: true }
  case STOP_SYNCING:
    return { ...state, isSyncing: false }
  case HAS_ERRORS:
    return { ...state, hasErrors: true }

  // Nodes
  // @TODO: Parsing
  case INDEX_NODES:
    if (action.data.nodes != null) {
      const nodes = action.data.nodes
      return { ...state, nodes }
    }
    return state

  case ADD_NODE_TRANSACTION:

    if (action.data.transaction != null) {

      const transaction = action.data.transaction
      const uuid = transaction.node
      const index = state.nodes.findIndex(node => node.uuid === uuid)
      let nodes = fromJS(state.nodes)

      // Create new node
      if (index === -1 && transaction.type === 'CREATE') {
        const node = createNode(transaction.node, transaction)
        nodes = nodes.push(node)
      }
      // Update existing node
      else if (index > -1) {

        nodes = nodes.updateIn([index, 'transactions'], arr => arr.push(transaction))
        const transactions = nodes.getIn([index, 'transactions']).toJS()
        switch (transaction.type) {

        // Update node data
        case 'SET':
          nodes = nodes.setIn([index, 'data'], getNodeData(transactions))
          break

        // Update node children
        case 'ADD_CHILD':
        case 'REMOVE_CHILD':
          nodes = nodes.setIn([index, 'nodes'], getNodes(transactions))
          break

        // Revert transaction
        case 'REVERT': {
          const revertedTransaction = transactions.find(t => t.uuid === transaction.transaction)
          if (revertedTransaction != null) {
            if (revertedTransaction.type === 'SET') {
              nodes = nodes.setIn([index, 'data'], getNodeData(transactions))
            } else if (revertedTransaction.type === 'ADD_CHILD' || revertedTransaction.type === 'REMOVE_CHILD') {
              nodes = nodes.setIn([index, 'nodes'], getNodes(transactions))
            }
          }
          break
        }}
      }
      else {
        // @TODO: log error, feedback for non existing node
      }

      // Set new state
      nodes = nodes.toJS()
      return { ...state, nodes }
    }
    return state

  case UPDATE_NODE_TRANSACTION_STATUS:

    if (action.data.transaction != null) {

      const transaction = action.data.transaction
      const uuid = transaction.node
      const index = state.nodes.findIndex(node => node.uuid === uuid)
      if (index > -1) {

        let nodes = fromJS(state.nodes)
        let indexTransaction = nodes.getIn([index, 'transactions']).findIndex(elem => elem.get('uuid') === transaction.uuid)
        if (indexTransaction > -1) {

          // Update transaction status
          const status = action.data.status
          nodes = nodes.setIn([index, 'transactions', indexTransaction, 'status'], status)

          // Transaction committed, apply
          if (status === 'COMMITTED') {
            if (transaction.type === 'CREATE' && transaction.auth != null) {
              nodes = nodes.setIn([index, 'auth'], transaction.auth)
            }
          }

          // Transaction cancelled or denied, rollback
          else if (status === 'CANCELLED' || status === 'DENIED') {
            const transactions = nodes.getIn([index, 'transactions']).toJS()
            switch (transaction.type) {
            case 'CREATE':
              nodes = nodes.delete(index)
              break
            case 'SET':
              nodes = nodes.setIn([index, 'data'], getNodeData(transactions))
              break
            case 'ADD_CHILD':
            case 'REMOVE_CHILD':
              nodes = nodes.setIn([index, 'nodes'], getNodes(transactions))
              break
            case 'REVERT': {
              const revertedTransaction = transactions.find(t => t.uuid === transaction.transaction)
              if (revertedTransaction != null) {
                if (revertedTransaction.type === 'SET') {
                  nodes = nodes.setIn([index, 'data'], getNodeData(transactions))
                } else if (revertedTransaction.type === 'ADD_CHILD' || revertedTransaction.type === 'REMOVE_CHILD') {
                  nodes = nodes.setIn([index, 'nodes'], getNodes(transactions))
                }
              }
              break
            }
            }
          }

          nodes = nodes.toJS()
          return { ...state, nodes }
        } else {
          // @TODO: log error, feedback for non existing transaction
        }
      } else {
        // @TODO: log error, feedback for non existing node
      }
    }

    return state

  case SET_NODE_TRANSACTION_IS_SYNCING:

    if (action.data.transaction != null) {

      const transaction = action.data.transaction
      const uuid = transaction.node
      const isSyncing = action.data.isSyncing

      const index = state.nodes.findIndex(node => node.uuid === uuid)
      if (index > -1) {
        let nodes = fromJS(state.nodes)
        let indexTransaction = nodes.getIn([index, 'transactions']).findIndex(elem => elem.get('uuid') === transaction.uuid)
        if (indexTransaction > -1) {
          nodes = nodes.setIn([index, 'transactions', indexTransaction, 'isSyncing'], isSyncing)
          nodes = nodes.toJS()
          return { ...state, nodes }
        } else {
          // @TODO: log error, feedback for non existing transaction
        }
      } else {
        // @TODO: log error, feedback for non existing node
      }
    }
    return state


  default:
    return state
  }
}

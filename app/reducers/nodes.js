/* @flow */

import type { NodesState, NodesAction } from '../../flow/types'
import {
  START_SYNCING,
  STOP_SYNCING,
  HAS_ERRORS,
  INDEX_NODES,
  ADD_NODE_TRANSACTION,
  UPDATE_NODE_TRANSACTION_STATUS
} from '../actions/nodes'
import { fromJS } from 'immutable'
import createNode from '../lib/tree/createNode'

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

  // @TODO: Extract logic
  case ADD_NODE_TRANSACTION:
    if (action.data.transaction != null) {
      const transaction = action.data.transaction
      const uuid = transaction.node
      const data = transaction.data
      const index = state.nodes.findIndex(node => node.uuid === uuid)
      let nodes = fromJS(state.nodes)
      let indexChild
      let node
      if (index === -1 && transaction.type === 'CREATE') {
        node = createNode(transaction.node, transaction)
        nodes = nodes.push(node)
      } else if (index > -1) {
        nodes = nodes.updateIn([index, 'transactions'], arr => arr.push(transaction))
        switch (transaction.type) {
        case 'SET':
          nodes = nodes.setIn([index, 'data'], data)
          break
        case 'REMOVE_CHILD':
          indexChild = nodes.getIn([index, 'nodes']).findIndex(elem => elem === transaction.child)
          if (indexChild > -1) {
            nodes = nodes.updateIn([index, 'nodes'], arr => arr.splice(indexChild, 1))
          }
          break
        case 'ADD_CHILD':
          if (nodes.getIn([index, 'nodes']) === undefined) {
            nodes = nodes.setIn([index, 'nodes'], [])
          }
          if (transaction.before == null) {
            nodes = nodes.updateIn([index, 'nodes'], arr => arr.push(transaction.child))
          } else {
            const indexBefore = nodes.getIn([index, 'nodes']).findIndex(elem => elem === transaction.before)
            nodes = nodes.updateIn([index, 'nodes'], arr => arr.splice(indexBefore, 0, transaction.child))
          }
          break
        }
      }
      nodes = nodes.toJS()
      return { ...state, nodes }
    }
    return state

  // @TODO: Extract logic
  case UPDATE_NODE_TRANSACTION_STATUS:
    if (action.data.transaction != null) {
      const transaction = action.data.transaction
      const uuid = transaction.node
      const index = state.nodes.findIndex(node => node.uuid === uuid)
      if (index > -1) {
        let nodes = fromJS(state.nodes)
        let indexTransaction = nodes.getIn([index, 'transactions']).findIndex(elem => elem.get('uuid') === transaction.uuid)
        if (indexTransaction > -1) {
          if (transaction.type === 'CREATE' && transaction.auth != null) {
            nodes = nodes.setIn([index, 'auth'], transaction.auth)
          }
          nodes = nodes.setIn([index, 'transactions', indexTransaction, 'status'], action.data.status)
          nodes = nodes.toJS()
          return { ...state, nodes }
        }
      }
    }
    return state

  default:
    return state
  }
}

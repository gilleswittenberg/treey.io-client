/* @flow */

import type { NodesState, NodesAction } from '../../flow/types'
// @TODO: Use named imports
import * as types from '../actions/nodes'
import { fromJS } from 'immutable'
import createNode from '../lib/tree/createNode'

export const defaultState: NodesState = {
  isSyncing: false,
  hasErrors: false,
  nodes: []
}

export default function nodes (state: NodesState = defaultState, action: NodesAction) : NodesState {

  // backend
  switch (action.type) {
  case types.START_SYNCING:
    return { ...state, isSyncing: true }
  case types.STOP_SYNCING:
    return { ...state, isSyncing: false }
  case types.HAS_ERRORS:
    return { ...state, hasErrors: true }

  // nodes
  // @TODO: Parsing
  case types.INDEX_NODES:
    if (action.data.nodes != null) {
      const nodes = action.data.nodes
      return { ...state, nodes }
    }
    return state

  // @TODO: Extract logic
  case types.ADD_NODE_TRANSACTION:
    if (action.data.transaction != null) {
      const transaction = action.data.transaction
      const uid = transaction.uid
      const data = transaction.data
      const index = state.nodes.findIndex(node => node.uid === uid)
      let nodes = fromJS(state.nodes)
      let indexChild
      let node
      if (index === -1 && transaction.type === 'CREATE') {
        node = createNode(transaction.uid, transaction)
        nodes = nodes.push(node)
      } else if (index > -1) {
        nodes = nodes.updateIn([index, 'transactions'], arr => arr.push(transaction))
        switch (transaction.type) {
        case 'SET':
          nodes = nodes.setIn([index, 'data'], data)
          break
        case 'REMOVE_CHILD':
          indexChild = nodes.getIn([index, 'nodes']).findIndex(elem => elem === transaction.childUid)
          if (indexChild > -1) {
            nodes = nodes.updateIn([index, 'nodes'], arr => arr.splice(indexChild, 1))
          }
          break
        case 'ADD_CHILD':
          if (nodes.getIn([index, 'nodes']) === undefined) {
            nodes = nodes.setIn([index, 'nodes'], [])
          }
          if (transaction.before == null) {
            nodes = nodes.updateIn([index, 'nodes'], arr => arr.push(transaction.childUid))
          } else {
            const indexBefore = nodes.getIn([index, 'nodes']).findIndex(elem => elem === transaction.before)
            nodes = nodes.updateIn([index, 'nodes'], arr => arr.splice(indexBefore, 0, transaction.childUid))
          }
          break
        }
      }
      nodes = nodes.toJS()
      return { ...state, nodes }
    }
    return state

  // @TODO: Extract logic
  case types.UPDATE_NODE_TRANSACTION_STATUS:
    if (action.data.transaction != null) {
      const transaction = action.data.transaction
      const uid = transaction.uid
      const index = state.nodes.findIndex(node => node.uid === uid)
      if (index > -1) {
        let nodes = fromJS(state.nodes)
        let indexTransaction = nodes.getIn([index, 'transactions']).findIndex(elem => elem.get('uuid') === transaction.uuid)
        if (indexTransaction > -1) {
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

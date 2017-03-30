/* @flow */

import type { NodesState, NodesAction } from '../../flow/types'

import * as types from '../actions/nodes'
import {
  clearUI,
  setUI,
  selectActiveNode
} from '../lib/tree/TreeOperations'
import { fromJS } from 'immutable'

export const defaultState: NodesState = {
  isSyncing: false,
  hasErrors: false,
  tree: null,
  nodes: [],
  userIsDragging: false,
  activePath: null
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
  case types.INDEX_NODES:
    if (action.data.nodes != null) {
      return { ...state, nodes: action.data.nodes }
    }
    return state

  case types.ADD_NODE_TRANSACTION:
    if (action.data.transaction != null) {
      const transaction = action.data.transaction
      const uid = transaction.uid
      const data = transaction.data
      const index = state.nodes.findIndex(node => node.uid === uid)
      let indexChild
      if (index > -1) {
        let nodes = fromJS(state.nodes)
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
          if (transaction.before == null) {
            nodes = nodes.updateIn([index, 'nodes'], arr => arr.push(transaction.childUid))
          } else {
            const indexBefore = nodes.getIn([index, 'nodes']).findIndex(elem => elem === transaction.before)
            nodes = nodes.updateIn([index, 'nodes'], arr => arr.splice(indexBefore, 0, transaction.childUid))
          }
          break
        }

        nodes = nodes.toJS()
        return { ...state, nodes }
      }
    }
    return state

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

  // ui
  case types.CLEAR_NODE_UI:
    if (state.tree != null && action.data.keys != null) {
      const tree = clearUI(state.tree, action.data.keys)
      const userIsDragging = action.data.keys != null && action.data.keys.includes('dragging') ? false : state.userIsDragging
      return { ...state, userIsDragging, tree }
    }
    return state

  case types.UPDATE_NODE_UI:
    if (action.data.key != null) {
      if (state.tree != null && action.data.path != null && action.data.key != null && action.data.value != null) {
        const tree = setUI(state.tree, action.data.path, { [action.data.key]: action.data.value })
        const userIsDragging = action.data.key === 'dragging' ? action.data.value : state.userIsDragging
        const activePath = action.data.key === 'active' ? action.data.path : state.activePath
        return { ...state, tree, userIsDragging, activePath }
      }
    }
    return state

  case types.UPDATE_ACTIVE_NODE_UI:
    if (state.tree != null && state.activePath != null && action.data.key != null && action.data.value != null) {
      const tree = setUI(state.tree, state.activePath, { [action.data.key]: action.data.value })
      return { ...state, tree }
    }
    return state

  case types.SET_NEXT_UI_ACTIVE:
  case types.SET_PREV_UI_ACTIVE:
    if (state.tree != null && state.activePath) {
      const selector = action.type === types.SET_PREV_UI_ACTIVE ? 'PREV' : 'NEXT'
      const tuple = selectActiveNode(state.tree, state.activePath, selector)
      const tree = tuple[0]
      const activePath = tuple[1]
      return { ...state, tree, activePath }
    }
    return state

  default:
    return state
  }
}

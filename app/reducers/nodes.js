/* @flow */

import type { NodesState, NodesAction } from '../../flow/types'

import * as types from '../actions/nodes'
import {
  index,
  createAndAdd,
  update,
  remove,
  move,
  clearUI,
  setUI,
  selectActiveNode
} from '../lib/tree/TreeOperations'

export const defaultState: NodesState = {
  isSyncing: false,
  hasErrors: false,
  tree: null,
  userIsDragging: false,
  activePath: null
}

export default function nodes (state: NodesState = defaultState, action: NodesAction) {

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
    if (action.data.tree != null) {
      const tree = index(action.data.tree)
      return { ...state, tree }
    }
    return state

  case types.ADD_NODE:
    if (state.tree != null && action.data.path != null) {
      const tree = createAndAdd(state.tree, action.data.path, action.data.uid, action.data.nodeData)
      return { ...state, tree }
    }
    return state

  case types.UPDATE_NODE:
    if (state.tree != null && action.data.path != null && action.data.nodeData != null) {
      const tree = update(state.tree, action.data.path, action.data.nodeData)
      return { ...state, tree }
    }
    return state

  case types.REMOVE_NODE:
    if (state.tree != null && action.data.path) {
      const tree = remove(state.tree, action.data.path)
      return { ...state, tree }
    }
    return state

  case types.MOVE_NODE:
    if (state.tree != null && action.data.path != null && action.data.newPath != null) {
      const tree = move(state.tree, action.data.path, action.data.newPath, action.data.before)
      return { ...state, tree }
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

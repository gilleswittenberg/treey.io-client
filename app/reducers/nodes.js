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
  setUIActiveNode,
  selectActiveNode
} from '../lib/tree/TreeOperations'

export const defaultState: NodesState = {
  isSyncing: false,
  hasErrors: false,
  tree: null,
  userIsDragging: false
}

export default function nodes (state: NodesState = defaultState, action: NodesAction) {

  let tree, userIsDragging

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
      tree = index(action.data.tree)
      return { ...state, tree }
    }
    return state

  case types.ADD_NODE:
    if (state.tree != null && action.data.path != null && action.data.nodeData != null) {
      tree = createAndAdd(state.tree, action.data.path, action.data.nodeData)
      return { ...state, tree }
    }
    return state

  case types.UPDATE_NODE:
    if (state.tree != null && action.data.path != null && action.data.nodeData != null) {
      tree = update(state.tree, action.data.path, action.data.nodeData)
      return { ...state, tree }
    }
    return state

  case types.REMOVE_NODE:
    if (state.tree != null && action.data.path) {
      tree = remove(state.tree, action.data.path)
      return { ...state, tree }
    }
    return state

  case types.MOVE_NODE:
    if (state.tree != null && action.data.path != null && action.data.newPath != null && action.data.before != null) {
      tree = move(state.tree, action.data.path, action.data.newPath, action.data.before)
      return { ...state, tree }
    }
    return state


  // ui
  case types.CLEAR_NODE_UI:
    if (state.tree != null && action.data.keys != null) {
      tree = clearUI(state.tree, action.data.keys)
      userIsDragging = action.data.keys != null && action.data.keys.includes('dragging') ? false : state.userIsDragging
      return { ...state, userIsDragging, tree }
    }
    return state

  case types.UPDATE_NODE_UI:
    if (action.data.key != null) {
      if (state.tree != null && action.data.path != null && action.data.key != null && action.data.value != null) {
        tree = setUI(state.tree, action.data.path, { [action.data.key]: action.data.value })
        userIsDragging = action.data.key === 'dragging' ? action.data.value : state.userIsDragging
        return { ...state, userIsDragging, tree }
      }
    }
    return state

  case types.UPDATE_ACTIVE_NODE_UI:
    if (state.tree != null && action.data.key != null && action.data.value != null) {
      tree = setUIActiveNode(state.tree, action.data.key, action.data.value)
      return { ...state, tree }
    }
    return state

  case types.SET_NEXT_UI_ACTIVE:
  case types.SET_PREV_UI_ACTIVE:
    if (state.tree != null) {
      const selector = action.type === types.SET_PREV_UI_ACTIVE ? 'PREV' : 'NEXT'
      tree = selectActiveNode(state.tree, selector)
      return { ...state, tree }
    }
    return state

  default:
    return state
  }
}

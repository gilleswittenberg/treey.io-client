/* @flow */

import * as types from '../actions/nodes'
import Tree from '../lib/Tree'

import type { NodesState, NodesAction } from '../../flow/types'

export const defaultState: NodesState = {
  isSyncing: false,
  hasErrors: false,
  tree: null
}

export default function nodes (state: NodesState = defaultState, action: NodesAction) {
  let tree

  // backend
  switch (action.type) {
  case types.START_SYNCING:
    return { ...state, isSyncing: true }
  case types.STOP_SYNCING:
    return { ...state, isSyncing: false }
  case types.HAS_ERRORS:
    return { ...state, hasErrors: true }

  // nodes tree
  case types.INDEX_NODES:
    tree = Tree.parse(action.data.tree)
    return { ...state, tree }
  case types.ADD_NODE:
    if (state.tree) {
      tree = Tree.create(state.tree, action.data.parent, action.data.node)
    } else {
      tree = state.tree
    }
    return { ...state, tree }
  case types.UPDATE_NODE:
    if (state.tree) {
      tree = Tree.update(state.tree, action.data.uid, action.data.node)
    } else {
      tree = state.tree
    }
    return { ...state, tree }
  case types.REMOVE_NODE:
    if (state.tree) {
      tree = Tree.removeChild(state.tree, action.data.parent, action.data.uid)
    } else {
      tree = state.tree
    }
    return { ...state, tree }
  case types.MOVE_NODE:
    if (state.tree) {
      tree = Tree.move(state.tree, action.data.parent, action.data.uid, action.data.newParent, action.data.before)
    } else {
      tree = state.tree
    }
    return { ...state, tree }

  // node ui
  // case types.SET_ACTIVE:
    // tree = Tree.setNodeKey('ui.active', node, true)
  default:
    return state
  }
}

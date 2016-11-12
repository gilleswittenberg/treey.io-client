/* @flow */

import * as types from '../actions/nodes'
import TreeParse from '../lib/TreeParse'
import Tree from '../lib/Tree'
import Tree2 from '../lib/Tree2'
import { updateNodeUI } from '../lib/TreeActions'

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
    tree = TreeParse.parse(action.data.tree)
    return { ...state, tree }

  // ui
  case types.UPDATE_NODE_UI:
    if (state.tree) {
      tree = Tree2.doAction(state.tree, action.data.path, updateNodeUI(action.data.key, action.data.value))
    } else {
      // @TODO: Clean up (@flow)
      tree = state.tree
    }
    return { ...state, tree }

  case types.SET_NEXT_UI_ACTIVE:
    if (state.tree) {
      // const next = Tree2.getNextExpanded()
      tree = Tree2.doActionAll(state.tree, node => {
        if (node.ui) node.ui.active = false
        return node
      })
    } else {
      // @TODO: Clean up (@flow)
      tree = state.tree
    }
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

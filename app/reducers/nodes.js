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
  case types.CLEAR_NODE_UI:
    if (state.tree) {
      tree = Tree2.doActionAll(state.tree, updateNodeUI(action.data.key, false))
    } else {
      // @TODO: Clean up (@flow)
      tree = state.tree
    }
    return { ...state, tree }

  case types.UPDATE_NODE_UI:
    if (state.tree) {
      tree = Tree2.doAction(state.tree, action.data.path, updateNodeUI(action.data.key, action.data.value))
    } else {
      // @TODO: Clean up (@flow)
      tree = state.tree
    }
    return { ...state, tree }

  case types.UPDATE_ACTIVE_NODE_UI:
    if (state.tree) {
      const active = Tree2.find(state.tree, node => {
        return node.nodeUi.active === true
      })[0]
      tree = Tree2.doAction(state.tree, active.path, updateNodeUI(action.data.key, action.data.value))
    } else {
      // @TODO: Clean up (@flow)
      tree = state.tree
    }
    return { ...state, tree }

  case types.SET_NEXT_UI_ACTIVE:
  case types.SET_PREV_UI_ACTIVE:
    if (state.tree) {
      const active = Tree2.find(state.tree, node => {
        return node.nodeUi.active === true
      })[0]
      const search = (node, parent) => {
        const parentVisible = parent && parent.nodeUi.expanded === true
        const visible = node.nodeUi.expanded === true
        return parentVisible || visible
      }
      const visible = Tree2.find(state.tree, search)
      const index = visible.findIndex(node => node.path === active.path)
      let indexNext
      if (action.type === types.SET_NEXT_UI_ACTIVE) {
        indexNext = index + 1 < visible.length ? index + 1 : 0
      } else {
        indexNext = index - 1 >= 0 ? index - 1 : visible.length - 1
      }
      const next = visible[indexNext]
      tree = Tree2.doActionAll(state.tree, node => {
        if (node.nodeUi) node.nodeUi.active = false
        return node
      })
      tree = Tree2.doAction(tree, next.path, node => {
        node.nodeUi.active = true
        return node
      })
    } else {
      // @TODO: Clean up (@flow)
      tree = state.tree
    }
    return { ...state, tree }

  case types.ADD_NODE:
    if (state.tree) {
      // @TOOD: parse from backend
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

  default:
    return state
  }
}

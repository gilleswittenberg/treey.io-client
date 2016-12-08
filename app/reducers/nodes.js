/* @flow */

import * as types from '../actions/nodes'
import { index, createAndAdd, update, remove, move, setUI, setUIActiveNode } from '../lib/TreeOperations'
// @TODO: move next 3 lines to TreeOperations
import { updateNodes/* , getNodeFromIndexPath */ } from '../lib/treeModifiers'
// import { find, filter, flatten, pathToNodesPath } from '../lib/TreeUtils'
// import { getNextCircular, getPrevCircular } from '../lib/ArrayUtils'

import type { NodesState, NodesAction } from '../../flow/types'

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
    // @TODO: change action.data.node.data to action.data.nodeData
    if (state.tree != null && action.data.path != null && action.data.node != null && action.data.node.data != null) {
      tree = createAndAdd(state.tree, action.data.path, action.data.node.data)
      return { ...state, tree }
    }
    return state

  case types.UPDATE_NODE:
    // @TODO: change action.data.node.data to action.data.nodeData
    if (state.tree != null && action.data.path != null && action.data.node != null && action.data.node.data != null) {
      tree = update(state.tree, action.data.path, action.data.node.data)
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
    if (state.tree != null && action.data.key != null) {
      tree = updateNodes(state.tree, null, { [action.data.key]: false })
      userIsDragging = action.data.key === 'dragging' ? false : state.userIsDragging
      return { ...state, userIsDragging, tree }
    }
    return state

  case types.UPDATE_NODE_UI:
    if (state.tree != null && action.data.path != null && action.data.key != null) {
      tree = setUI(state.tree, action.data.path, { [action.data.key]: action.data.value })
      return { ...state, tree }
    }
    return state

  case types.UPDATE_ACTIVE_NODE_UI:
    if (state.tree != null) {
      tree = setUIActiveNode(state.tree, action.data.key, action.data.value)
      return { ...state, tree }
    }
    return state

  /*
  case types.SET_NEXT_UI_ACTIVE:
  case types.SET_PREV_UI_ACTIVE:
    if (state.tree != null) {
      const activeIndexPath = find(state.tree, node => node.ui && node.ui.active === true, 'nodes', 'uid')
      if (activeIndexPath != null && state.tree != null) {
        const activeNode = getNodeFromIndexPath(state.tree, activeIndexPath)
        if (activeNode != null && state.tree != null) {
          const search = (node, parent) => {
            const parentVisible = parent && parent.ui.expanded === true
            const visible = node.ui && node.ui.expanded === true
            return parentVisible || visible
          }
          const filteredTree = filter(state.tree, null, search, 'nodes', 'uid')
          const flattenedTree = flatten(filteredTree, 'nodes')
          const index = flattenedTree.findIndex(node => node.uid === activeNode.uid)
          let next: any
          if (action.type === types.SET_NEXT_UI_ACTIVE) {
            next = getNextCircular(flattenedTree, index)
          } else if (action.type === types.SET_PREV_UI_ACTIVE) {
            next = getPrevCircular(flattenedTree, index)
          }
          if (state.tree != null) {
            tree = updateNodes(state.tree, null, { active: false })
          }
          if (state.tree != null && next != null) {
            tree = setUI(state.tree, next.path, { active: true })
          }
          return { ...state, tree }
        }
      }
      return state
    }
    return { ...state, tree }
  */


  default:
    return state
  }
}

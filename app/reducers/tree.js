/* @flow */

import type { TreeState, TreeAction } from '../../flow/types'

import * as types from '../actions/tree'

import {
  updateNodeAtIndexPath,
  updateAllNodes // ,
  // getNextIndexPath
} from '../lib/tree/TreeUtils2'

export const defaultState: TreeState = {
  tree: null,
  activeIndexPath: null,
  userIsDragging: false
}

export default function tree (state: TreeState = defaultState, action: TreeAction) : TreeState {

  switch (action.type) {
  case types.CLEAR_NODE_UI:
    if (state.tree != null && action.data.keys != null) {
      let tree = state.tree
      action.data.keys.forEach(key => {
        tree = updateAllNodes(tree, 'nodes', `ui.${ key }`, false)
      })
      const userIsDragging = action.data.keys != null && action.data.keys.includes('dragging') ? false : state.userIsDragging
      return { ...state, userIsDragging, tree }
    }
    return state

  case types.UPDATE_NODE_UI:
    if (state.tree != null && action.data.indexPath != null && action.data.key != null && action.data.value != null) {
      const tree = updateNodeAtIndexPath(state.tree, 'nodes', action.data.indexPath, `ui.${ action.data.key }`, action.data.value)
      const userIsDragging = action.data.key === 'dragging' ? action.data.value : state.userIsDragging
      const activeIndexPath = action.data.key === 'active' ? action.data.indexPath : state.activeIndexPath
      return { ...state, tree, userIsDragging, activeIndexPath }
    }
    return state

  case types.UPDATE_ACTIVE_NODE_UI:
    if (state.tree != null && state.activeIndexPath != null && action.data.key != null && action.data.value != null) {
      const tree = updateNodeAtIndexPath(state.tree, 'nodes', state.activeIndexPath, `ui.${ action.data.key }`, action.data.value)
      return { ...state, tree }
    }
    return state

  /*
  case types.SET_NEXT_UI_ACTIVE:
  case types.SET_PREV_UI_ACTIVE:
    if (state.tree != null && state.activeIndexPath) {
      const selector = action.type === types.SET_PREV_UI_ACTIVE ? 'PREV' : 'NEXT'
      const tuple = selectActiveNode(state.tree, state.activeIndexPath, selector)
      const tree = tuple[0]
      const activeIndexPath = tuple[1]
      return { ...state, tree, activeIndexPath }
    }
    return state
  */

  default:
    return state
  }

}

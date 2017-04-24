/* @flow */

import type { UIKey, TreePath, Nodes } from '../../flow/tree'

// actions
export const SET_UI_KEY = 'SET_UI_KEY'
export const UNSET_UI_KEY = 'UNSET_UI_KEY'
export const SET_EXPANDED = 'SET_EXPANDED'
export const UNSET_EXPANDED = 'UNSET_EXPANDED'

// action creators
const setUIKey = (key: UIKey, treePath: TreePath) => {
  return [
    {
      type: SET_UI_KEY,
      data: {
        key,
        treePath
      }
    }
  ]
}

const unsetUIKey = (key: UIKey) => {
  return [
    {
      type: UNSET_UI_KEY,
      data: {
        key
      }
    }
  ]
}

export const clearUIEditingAdding = () => {
  return [
    unsetUIKey('editing'),
    unsetUIKey('adding')
  ]
}

export const setUIEditing = (treePath: TreePath) => {
  return setUIKey('editing', treePath)
}

export const setUIAdding = (treePath: TreePath) => {
  return setUIKey('adding', treePath)
}

export const setUIActive = (treePath: TreePath) => {
  return setUIKey('active', treePath)
}

export const setUIExpanded = (treePath: TreePath) => {
  return {
    type: SET_EXPANDED,
    data: {
      treePath
    }
  }
}

export const unsetUIExpanded = (treePath: TreePath) => {
  return {
    type: UNSET_EXPANDED,
    data: {
      treePath
    }
  }
}

export const setUIMovingChild = (treePath: TreePath) => {
  return setUIKey('movingChild', treePath)
}

export const clearUIMovingChild = () => {
  return unsetUIKey('movingChild')
}

export const setUIButtonsShown = (treePath: TreePath) => {
  return setUIKey('buttonsShown', treePath)
}

export const clearUIButtonsShown = () => {
  return unsetUIKey('buttonsShown')
}

export const setUIDragging = (treePath: TreePath) => {
  return setUIKey('dragging', treePath)
}

export const clearUIDragging = () => {
  return unsetUIKey('dragging')
}

export const initUIRoot = (nodes: Nodes) => {

  // guard
  if (nodes.length === 0) return

  const rootUid = nodes[0].uid

  // guard
  if (rootUid == null) return

  const treePath = [rootUid]
  return [
    setUIExpanded(treePath),
    setUIKey('active', treePath)
  ]
}

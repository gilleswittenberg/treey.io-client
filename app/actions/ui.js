/* @flow */

import type { UIKey, TreePath, Nodes } from '../../flow/tree'
import type { UIAction } from '../../flow/types'
import type { UIActions } from '../../flow/types'

// Actions
export const SET_UI_KEY = 'SET_UI_KEY'
export const UNSET_UI_KEY = 'UNSET_UI_KEY'
export const SET_EXPANDED = 'SET_EXPANDED'
export const UNSET_EXPANDED = 'UNSET_EXPANDED'

// Action creators

const setUIKey = (key: UIKey, treePath: TreePath) : UIAction => {
  return {
    type: SET_UI_KEY,
    data: {
      key,
      treePath
    }
  }
}

const unsetUIKey = (key: UIKey) : UIAction  => {
  return {
    type: UNSET_UI_KEY,
    data: {
      key
    }
  }
}

export const clearUIEditingAdding = () : UIActions => {
  return [
    unsetUIKey('editing'),
    unsetUIKey('adding')
  ]
}

export const setUIEditing = (treePath: TreePath) : UIActions => {
  return [
    setUIKey('editing', treePath),
    setUIActive(treePath)
  ]
}

export const setUIAdding = (treePath: TreePath) : UIActions => {
  return [
    setUIKey('adding', treePath),
    setUIActive(treePath)
  ]
}

export const setUIActive = (treePath: TreePath) : UIAction => {
  return setUIKey('active', treePath)
}

export const setUIExpanded = (treePath: TreePath) : UIAction => {
  return {
    type: SET_EXPANDED,
    data: {
      treePath
    }
  }
}

export const unsetUIExpanded = (treePath: TreePath) : UIAction => {
  return {
    type: UNSET_EXPANDED,
    data: {
      treePath
    }
  }
}

export const setUIMovingChild = (treePath: TreePath) : UIAction => {
  return setUIKey('movingChild', treePath)
}

export const clearUIMovingChild = () : UIAction => {
  return unsetUIKey('movingChild')
}

export const setUIButtonsShown = (treePath: TreePath) : UIAction => {
  return setUIKey('buttonsShown', treePath)
}

export const clearUIButtonsShown = () : UIAction => {
  return unsetUIKey('buttonsShown')
}

export const setUIDragging = (treePath: TreePath) : UIAction => {
  return setUIKey('dragging', treePath)
}

export const clearUIDragging = () : UIAction => {
  return unsetUIKey('dragging')
}

export const initUIRoot = (nodes: Nodes) : ?UIActions => {

  // Guard
  if (nodes.length === 0) return

  const root = nodes[0].uuid

  // Guard
  if (root == null) return

  const treePath = [root]
  return [
    setUIExpanded(treePath),
    setUIKey('active', treePath)
  ]
}

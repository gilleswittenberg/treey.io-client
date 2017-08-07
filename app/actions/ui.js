/* @flow */

import type { UIKey, TreePath, Nodes } from '../../flow/tree'
import type { UIAction, UIActions } from '../../flow/types'

// Actions
export const SET_UI_KEY = 'SET_UI_KEY'
export const UNSET_UI_KEY = 'UNSET_UI_KEY'
export const SET_EXPANDED = 'SET_EXPANDED'
export const UNSET_EXPANDED = 'UNSET_EXPANDED'
export const UNSET_EXPANDED_DEEP = 'UNSET_EXPANDED_DEEP'

// Action creators

const setUIKey = (key: UIKey, treePath: TreePath) : UIAction => (
  {
    type: SET_UI_KEY,
    data: {
      key,
      treePath
    }
  }
)

const unsetUIKey = (key: UIKey) : UIAction => (
  {
    type: UNSET_UI_KEY,
    data: { key }
  }
)

export const setUIActive = (treePath: TreePath) : UIAction => setUIKey('active', treePath)

export const clearUIEditingAdding = () : UIActions => [
  unsetUIKey('editing'),
  unsetUIKey('adding')
]

export const setUIEditing = (treePath: TreePath) : UIActions => [
  setUIKey('editing', treePath),
  setUIActive(treePath)
]

export const setUIAdding = (treePath: TreePath) : UIActions => [
  setUIKey('adding', treePath),
  setUIActive(treePath)
]

export const setUIExpanded = (treePath: TreePath) : UIAction => (
  {
    type: SET_EXPANDED,
    data: { treePath }
  }
)

export const unsetUIExpanded = (treePath: TreePath) : UIAction => (
  {
    type: UNSET_EXPANDED,
    data: { treePath }
  }
)

export const unsetUIExpandedDeep = (treePath: TreePath) : UIAction => (
  {
    type: UNSET_EXPANDED_DEEP,
    data: { treePath }
  }
)

export const setUIMovingChild = (treePath: TreePath) : UIAction => setUIKey('movingChild', treePath)

export const clearUIMovingChild = () : UIAction => unsetUIKey('movingChild')

export const setUIButtonsShown = (treePath: TreePath) : UIAction => setUIKey('buttonsShown', treePath)

export const clearUIButtonsShown = () : UIAction => unsetUIKey('buttonsShown')

export const setUIDragging = (treePath: TreePath) : UIAction => setUIKey('dragging', treePath)

export const clearUIDragging = () : UIAction => unsetUIKey('dragging')

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

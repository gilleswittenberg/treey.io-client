/* @flow */

import type { UIKey, TreePath, Nodes } from '../../flow/tree'

// Actions
export const SET_UI_KEY = 'SET_UI_KEY'
export const UNSET_UI_KEY = 'UNSET_UI_KEY'
export const SET_EXPANDED = 'SET_EXPANDED'
export const UNSET_EXPANDED = 'UNSET_EXPANDED'

// Action creators

// @TODO: Specify return type
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

// @TODO: Specify return type
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

// @TODO: Specify return type
export const clearUIEditingAdding = () => {
  return [
    unsetUIKey('editing'),
    unsetUIKey('adding')
  ]
}

// @TODO: Specify return type
export const setUIEditing = (treePath: TreePath) => {
  return [
    setUIKey('editing', treePath),
    setUIActive(treePath)
  ]
}

// @TODO: Specify return type
export const setUIAdding = (treePath: TreePath) => {
  return setUIKey('adding', treePath)
}

// @TODO: Specify return type
export const setUIActive = (treePath: TreePath) => {
  return setUIKey('active', treePath)
}

// @TODO: Specify return type
export const setUIExpanded = (treePath: TreePath) => {
  return {
    type: SET_EXPANDED,
    data: {
      treePath
    }
  }
}

// @TODO: Specify return type
export const unsetUIExpanded = (treePath: TreePath) => {
  return {
    type: UNSET_EXPANDED,
    data: {
      treePath
    }
  }
}

// @TODO: Specify return type
export const setUIMovingChild = (treePath: TreePath) => {
  return setUIKey('movingChild', treePath)
}

// @TODO: Specify return type
export const clearUIMovingChild = () => {
  return unsetUIKey('movingChild')
}

// @TODO: Specify return type
export const setUIButtonsShown = (treePath: TreePath) => {
  return setUIKey('buttonsShown', treePath)
}

// @TODO: Specify return type
export const clearUIButtonsShown = () => {
  return unsetUIKey('buttonsShown')
}

// @TODO: Specify return type
export const setUIDragging = (treePath: TreePath) => {
  return setUIKey('dragging', treePath)
}

// @TODO: Specify return type
export const clearUIDragging = () => {
  return unsetUIKey('dragging')
}

// @TODO: Specify return type
export const initUIRoot = (nodes: Nodes) => {

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

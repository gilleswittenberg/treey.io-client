/* @flow */

import type {
  NodeId,
  TreeData,
  TreePath,
  NodeData,
  NodeUI,
  PrevOrNext
} from '../../flow/tree'

import { createNode } from './NodeModifiers'
import { indexNodes, addNode, updateTreeNode, removeNode, updateNodes } from './TreeModifiers'
import { getNode, find, filter, flatten } from './TreeUtils'
import { getNextCircular, getPrevCircular } from './ArrayUtils'
import ID from '../settings/TREE_ID_KEY'
import NODES from '../settings/TREE_NODES_KEY'

export const index = (data: TreeData) : TreeData => {
  return indexNodes(data)
}

export const createAndAdd = (tree: TreeData, path: TreePath, data: NodeData) : TreeData  => {
  const node = createNode(undefined, data)
  return addNode(tree, path, node)
}

export const update = (tree: TreeData, path: TreePath, data: NodeData) : TreeData  => {
  return updateTreeNode(tree, path, data)
}

export const remove = (tree: TreeData, path: TreePath) : TreeData  => {
  return removeNode(tree, path)
}

export const move = (tree: TreeData, path: TreePath, newPath: TreePath, before: ?NodeId) : TreeData  => {
  const node = getNode(tree, path, NODES, ID)
  if (node != null) {
    tree = removeNode(tree, path)
    tree = addNode(tree, newPath, node, before)
  }
  return tree
}

export const clearUI = (tree: TreeData, keys: string[]) : TreeData  => {
  // @TODO: extract as falsyUI
  const ui = {}
  keys.forEach(key => ui[key] = false)
  return updateNodes(tree, null, ui)
}

export const setUI = (tree: TreeData, path: TreePath, ui: NodeUI) : TreeData  => {
  return updateTreeNode(tree, path, null, ui)
}

export const setUIUnique = (tree: TreeData, path: TreePath, ui: NodeUI) : TreeData  => {
  tree = updateNodes(tree, undefined, invertedUI(ui))
  tree = updateTreeNode(tree, path, undefined, ui)
  return tree
}

export const setUIActiveNode = (tree: TreeData, key: string, value: boolean) : TreeData  => {
  // @TODO: use isActive function
  // @TODO: rename activeIndexPath => indexPath
  const activeIndexPath = find(tree, node => node.ui && node.ui.active === true, NODES, ID)
  if (activeIndexPath != null) {
    tree = updateTreeNode(tree, activeIndexPath, null, { [key]: value })
  }
  return tree
}

export const selectActiveNode = (tree: TreeData, selector: PrevOrNext) : TreeData => {
  const activePath = find(tree, isActive, NODES, ID)
  if (activePath != null) {
    const activeNode = getNode(tree, activePath, NODES, ID)
    if (activeNode != null) {
      const filteredTree = filter(tree, null, isVisible, NODES, ID)
      const flattenedTree = flatten(filteredTree, NODES)
      const index = flattenedTree.findIndex(isActive)
      const nextActive = selector === 'PREV' ? getPrevCircular(flattenedTree, index) : getNextCircular(flattenedTree, index)
      // unset active
      tree = updateNodes(tree, null, { active: false })
      // set active
      if (nextActive != null) {
        tree = setUI(tree, nextActive.path, { active: true })
      }
    }
  }
  return tree
}

// helper methods
const isActive = node => node && node.ui && node.ui.active === true

const isVisible = (node, parent) => (parent && parent.ui && parent.ui.expanded === true) || (node && node.ui && node.ui.expanded === true)

const invertedUI = ui => {
  const invertedUI = {}
  Object.keys(ui).forEach(key => invertedUI[key] = !ui[key])
  return invertedUI
}

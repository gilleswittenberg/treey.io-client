/* @flow */

import type {
  NodeId,
  Tree,
  TreeNode,
  TreePath,
  NodeData,
  NodeUI,
  NodeUIKey,
  PrevOrNext
} from '../../../flow/tree'

import { createNode } from './NodeModifiers'
import { createTreeNode } from './TreeNodeModifiers'
import { indexTreeNodes, addTreeNode, updateTreeNode, removeTreeNode, updateTreeNodes } from './TreeModifiers'
import { getTreeNode, findTreePath, filterTree, flattenTree } from './TreeUtils'
import { getNextCircular, getPrevCircular } from '../utils/ArrayUtils'
import ID from '../../settings/TREE_ID_KEY'
import NODES from '../../settings/TREE_NODES_KEY'

export const index = (data: any) : Tree => {
  return indexTreeNodes(data)
}

export const createAndAdd = (tree: Tree, path: TreePath, data: NodeData) : Tree  => {
  const node = createNode(undefined, data)
  const treeNode = createTreeNode(node)
  return addTreeNode(tree, path, treeNode)
}

export const update = (tree: Tree, path: TreePath, data: NodeData) : Tree  => {
  return updateTreeNode(tree, path, data)
}

export const remove = (tree: Tree, path: TreePath) : Tree  => {
  return removeTreeNode(tree, path)
}

export const move = (tree: Tree, path: TreePath, newPath: TreePath, before?: NodeId) : Tree  => {
  const node = getTreeNode(tree, path, NODES, ID)
  if (node != null) {
    tree = removeTreeNode(tree, path)
    tree = addTreeNode(tree, newPath, node, before)
  }
  return tree
}

export const clearUI = (tree: Tree, keys: NodeUIKey[]) : Tree  => {
  return updateTreeNodes(tree, undefined, falsyUI(keys))
}

export const setUI = (tree: Tree, path: TreePath, ui: NodeUI) : Tree  => {
  return updateTreeNode(tree, path, undefined, ui)
}

export const setUIActiveNode = (tree: Tree, key: NodeUIKey, value: boolean) : Tree  => {
  const activePath = findTreePath(tree, undefined, isActive, NODES, ID)
  if (activePath != null) {
    tree = updateTreeNode(tree, activePath, undefined, { [key]: value })
  }
  return tree
}

export const selectActiveNode = (tree: Tree, selector: PrevOrNext) : Tree => {
  const activePath = findTreePath(tree, undefined, isActive, NODES, ID)
  if (activePath != null) {
    const activeNode = getTreeNode(tree, activePath, NODES, ID)
    if (activeNode != null) {
      const filteredTree = filterTree(tree, undefined, undefined, isVisible, NODES, ID)
      const flattenedTree = flattenTree(filteredTree, NODES)
      const index = flattenedTree.findIndex(isActive)
      const nextActive = selector === 'PREV' ? getPrevCircular(flattenedTree, index) : getNextCircular(flattenedTree, index)
      // unset active
      tree = updateTreeNodes(tree, undefined, { active: false })
      // set active
      if (nextActive != null) {
        tree = setUI(tree, nextActive.path, { active: true })
      }
    }
  }
  // @TODO: select first when none is active
  return tree
}

// helper methods
export const isActive = (node: TreeNode) : boolean => (node && node.node && node.node.ui && node.node.ui.active === true) || false

export const isVisible = (treeNode?: TreeNode, parent?: TreeNode) : boolean => {
  const isRoot = parent == null
  const parentIsExpanded = parent != null && parent.node && parent.node.ui && parent.node.ui.expanded === true
  return isRoot || parentIsExpanded
}

export const falsyUI = (keys: NodeUIKey[]) : NodeUI => keys.reduce((prev, key) => { prev[key] = false; return prev }, {})

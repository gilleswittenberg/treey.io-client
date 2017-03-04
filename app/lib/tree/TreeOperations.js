/* @flow */

import type {
  NodeId,
  Tree,
  TreeNode,
  TreePath,
  NodeData,
  NodeUI,
  NodeUIKey,
  Transaction,
  PrevOrNext
} from '../../../flow/tree'

import { createNode } from './NodeModifiers'
import { createTreeNode } from './TreeNodeModifiers'
import { indexTreeNodes, addTreeNode, updateTreeNode, updateTreeNodeTransaction, removeTreeNode, updateTreeNodes } from './TreeModifiers'
import { getTreeNode, filterTree, flattenTree } from './TreeUtils'
import { getNextCircular, getPrevCircular } from '../utils/ArrayUtils'
import ID from '../../settings/TREE_ID_KEY'
import NODES from '../../settings/TREE_NODES_KEY'

export const index = (data: { nodes: [] }) : Tree => {
  return indexTreeNodes(data.nodes[0])
}

export const createAndAdd = (tree: Tree, path: TreePath, uid?: NodeId, data?: NodeData) : Tree  => {
  const node = createNode(uid, undefined, data)
  const treeNode = createTreeNode(node, path)
  return addTreeNode(tree, path, treeNode)
}

export const update = (tree: Tree, path: TreePath, data: NodeData) : Tree  => {
  return updateTreeNode(tree, path, data)
}

export const updateTransaction = (tree: Tree, path: TreePath, transaction: Transaction) : Tree  => {
  return updateTreeNodeTransaction(tree, path, transaction)
}

export const remove = (tree: Tree, path: TreePath) : Tree  => {
  return removeTreeNode(tree, path)
}

export const move = (tree: Tree, path: TreePath, newPath: TreePath, before?: NodeId) : Tree  => {
  const node = getTreeNode(tree, path, NODES, ID)
  if (node != null) {
    // @TODO: Combine in an atomic transaction
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

export const selectActiveNode = (tree: Tree, activePath: TreePath, selector: PrevOrNext) : [Tree, ?TreePath] => {
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
        return [tree, nextActive.path]
      }
    }
  }
  // @TODO: select first when none is active
  return [tree, null]
}

// helper methods
export const isActive = (node: TreeNode) : boolean => (node && node.node && node.node.ui && node.node.ui.active === true) || false

export const isVisible = (treeNode?: TreeNode, parent?: TreeNode) : boolean => {
  const isRoot = parent == null
  const parentIsExpanded = parent != null && parent.node && parent.node.ui && parent.node.ui.expanded === true
  return isRoot || parentIsExpanded
}

export const falsyUI = (keys: NodeUIKey[]) : NodeUI => keys.reduce((prev, key) => { prev[key] = false; return prev }, {})

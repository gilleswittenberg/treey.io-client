/* @flow */

import type {
  Tree,
  TreePath,
  TreeNode,
  NodeId,
  NodeData,
  NodeUI
} from '../../../flow/tree'

import { fromJS } from 'immutable'
import { updatePath, parseTreeNode, updateTreeNode as updateNode } from './TreeNodeModifiers'
import { getNodesIndex, getTreeIndexPath, treeIndexPathToTreeNodesPath, parseTree, mapTree } from './TreeUtils'
import ID from '../../settings/TREE_ID_KEY'
import NODES from '../../settings/TREE_NODES_KEY'

export const indexTreeNodes = (data: {}) : Tree => {
  return parseTree(data, parseTreeNode, NODES, ID)
}

export const addTreeNode = function (treeData: Tree, path: TreePath, node: TreeNode, before?: NodeId) : Tree {
  const pathIndexes = getTreeIndexPath(treeData, path, NODES, ID)
  if (pathIndexes == null) return treeData
  // set new path on node
  node = updatePath(node, path)
  // add node to nodes
  let tree = fromJS(treeData)
  const nodesPath = treeIndexPathToTreeNodesPath(pathIndexes, NODES, true)
  let nodes = tree.getIn(nodesPath)
  if (before != null) {
    let index = getNodesIndex(nodes.toJS(), before, ID)
    nodes = nodes.insert(index, node)
  } else {
    nodes = nodes.push(node)
  }
  tree = tree.setIn(nodesPath, nodes)
  return tree.toJS()
}

// @TODO: add uid
export const updateTreeNode = (treeData: Tree, path: TreePath, data?: NodeData, ui?: NodeUI) : Tree => {
  const pathIndexes = getTreeIndexPath(treeData, path, NODES, ID)
  if (pathIndexes == null) return treeData
  const nodesPath = treeIndexPathToTreeNodesPath(pathIndexes, NODES)
  let tree = fromJS(treeData)
  const treeNode = updateNode(tree.getIn(nodesPath).toJS(), undefined, data, ui)
  return tree.setIn(nodesPath, treeNode).toJS()
}

export const removeTreeNode = (treeData: Tree, path: TreePath) : Tree => {
  const pathIndexes = getTreeIndexPath(treeData, path, NODES, ID)
  if (pathIndexes == null) return treeData
  const nodesPath = treeIndexPathToTreeNodesPath(pathIndexes, NODES)
  let tree = fromJS(treeData)
  return tree.deleteIn(nodesPath).toJS()
}

export const updateTreeNodes = (treeData: Tree, data?: NodeData, ui?: NodeUI) : Tree => {
  let tree = fromJS(treeData).toJS()
  const mapFunc = node => updateNode(node, undefined, data, ui)
  return mapTree(tree, mapFunc, NODES)
}

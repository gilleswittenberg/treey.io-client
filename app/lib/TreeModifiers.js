/* @flow */

import type {
  TreeData,
  TreePath,
  // Node,
  NodeId,
  NodeData,
  NodeUI
} from '../../flow/tree'

import { fromJS } from 'immutable'
import { updateNode, parseTreeNode } from './NodeModifiers'
import { getNodesIndex, getTreeIndexPath, treeIndexPathToTreeNodesPath, parseTree, mapTree } from './TreeUtils'
import ID from '../settings/TREE_ID_KEY'
import NODES from '../settings/TREE_NODES_KEY'

export const indexTreeNodes = (data: {}) : TreeData => {
  return parseTree(data, parseTreeNode, NODES, ID)
}

// @TODO: Flow type for node argument
export const addTreeNode = function (treeData: TreeData, path: TreePath, node: any, before: ?NodeId) : TreeData {
  const pathIndexes = getTreeIndexPath(treeData, path, NODES, ID)
  if (pathIndexes == null) return treeData
  let tree = fromJS(treeData)
  const nodesPath = treeIndexPathToTreeNodesPath(pathIndexes, NODES, true)
  let nodes = tree.getIn(nodesPath)
  if (before) {
    let index = getNodesIndex(nodes.toJS(), before, ID)
    nodes = nodes.insert(index, node)
  } else {
    nodes = nodes.push(node)
  }
  tree = tree.setIn(nodesPath, nodes)
  return tree.toJS()
}

export const updateTreeNode = function (treeData: TreeData, path: TreePath, data: ?NodeData, ui: ?NodeUI) : TreeData {
  const pathIndexes = getTreeIndexPath(treeData, path, NODES, ID)
  if (pathIndexes == null) return treeData
  const nodesPath = treeIndexPathToTreeNodesPath(pathIndexes, NODES)
  let tree = fromJS(treeData)
  const node = updateNode(tree.getIn(nodesPath).toJS(), undefined, data, ui)
  return tree.setIn(nodesPath, node).toJS()
}

export const removeTreeNode = function (treeData: TreeData, path: TreePath) : TreeData {
  const pathIndexes = getTreeIndexPath(treeData, path, NODES, ID)
  if (pathIndexes == null) return treeData
  const nodesPath = treeIndexPathToTreeNodesPath(pathIndexes, NODES)
  let tree = fromJS(treeData)
  return tree.deleteIn(nodesPath).toJS()
}

export const updateTreeNodes = function (treeData: TreeData, data: ?NodeData, ui: ?NodeUI) : TreeData {
  const mapFn = node => updateNode(node, null, data, ui)
  let tree = fromJS(treeData).toJS()
  return mapTree(tree, mapFn, NODES)
}

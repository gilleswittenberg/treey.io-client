/* @flow */

import type {
  TreeData,
  TreePath,
  TreeIndexPath,
  Node,
  NodeId,
  NodeData,
  NodeUI
} from '../../flow/tree'

import { fromJS } from 'immutable'
import { update } from './NodeModifiers'
import { getNodesIndex, getPathIndexes, pathToNodesPath, parse, map } from './TreeUtils'
import * as nodeModifiers from '../../app/lib/NodeModifiers'
const { parse: parseNode } = nodeModifiers
import ID from '../settings/TREE_ID_KEY'
import NODES from '../settings/TREE_NODES_KEY'

// @TODO: Move to TreeUtils
export const getNode = function (treeData: TreeData, path: TreePath) : ?Node {
  const pathIndexes = getPathIndexes(treeData, path, NODES, ID)
  if (pathIndexes == null) return null
  const nodesPath = pathToNodesPath(pathIndexes, NODES)
  let tree = fromJS(treeData)
  return tree.getIn(nodesPath).toJS()
}

// @TODO: Move to TreeUtils
export const getNodeFromIndexPath = function (treeData: TreeData, indexPath: TreeIndexPath) : ?Node {
  const nodesPath = pathToNodesPath(indexPath, NODES)
  let tree = fromJS(treeData)
  return tree.getIn(nodesPath).toJS()
}

export const indexNodes = (data: {}) : TreeData => {
  return parse(data, parseNode, NODES, ID)
}

export const addNode = function (treeData: TreeData, path: TreePath, node: Node, before: ?NodeId) : TreeData {
  const pathIndexes = getPathIndexes(treeData, path, NODES, ID)
  if (pathIndexes == null) return treeData
  let tree = fromJS(treeData)
  const nodesPath = pathToNodesPath(pathIndexes, NODES, true)
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

export const updateNode = function (treeData: TreeData, path: TreePath, data: ?NodeData, ui: ?NodeUI) : TreeData {
  const pathIndexes = getPathIndexes(treeData, path, NODES, ID)
  if (pathIndexes == null) return treeData
  const nodesPath = pathToNodesPath(pathIndexes, NODES)
  let tree = fromJS(treeData)
  const node = update(tree.getIn(nodesPath).toJS(), undefined, data, ui)
  return tree.setIn(nodesPath, node).toJS()
}

export const removeNode = function (treeData: TreeData, path: TreePath) : TreeData {
  const pathIndexes = getPathIndexes(treeData, path, NODES, ID)
  if (pathIndexes == null) return treeData
  const nodesPath = pathToNodesPath(pathIndexes, NODES)
  let tree = fromJS(treeData)
  return tree.deleteIn(nodesPath).toJS()
}

export const updateNodes = function (treeData: TreeData, data: ?NodeData, ui: ?NodeUI) : TreeData {
  const mapFn = node => update(node, null, data, ui)
  let tree = fromJS(treeData).toJS()
  return map(tree, mapFn, NODES)
}

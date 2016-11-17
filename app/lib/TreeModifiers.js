/* @flow */

import type {
  TreeData,
  TreePath,
  Node,
  NodeId,
  NodeData,
  NodeUI
} from '../../flow/tree'

import { fromJS } from 'immutable'
import { getNodesIndex, getPathIndexes, pathToNodesPath, map } from './TreeUtils'
import defaultUI from './defaultUI'
import ID from '../settings/TREE_ID_KEY'
import NODES from '../settings/TREE_NODES_KEY'

export const create = function (id: ?NodeId, data: ?NodeData, ui: ?NodeUI) : Node {
  id = id || null
  data = data || { title: '' }
  ui = ui || defaultUI
  return {
    uid: id,
    data,
    ui,
    nodes: []
  }
}

export const update = function (node: Node, id: ?NodeId, data: ?NodeData, ui: ?NodeUI) : Node {
  node = fromJS(node)
  if (id) node = node.set(ID, id)
  if (data) node = node.mergeIn(['data'], fromJS(data))
  if (ui) node = node.mergeIn(['ui'], fromJS(ui))
  return node.toJS()
}

export const getNode = function (treeData: TreeData, path: TreePath) : ?Node {
  const pathIndexes = getPathIndexes(treeData, path, NODES, ID)
  if (pathIndexes == null) return null
  const nodesPath = pathToNodesPath(pathIndexes, NODES)
  let tree = fromJS(treeData)
  return tree.getIn(nodesPath).toJS()
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
  const mapFn = node => update(node, undefined, data, ui)
  let tree = fromJS(treeData).toJS()
  return map(tree, mapFn, NODES)
}

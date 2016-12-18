/* @flow */

import type {
  Tree,
  TreeNode,
  TreeNodes,
  TreePath,
  TreeNodesPath,
  TreeIndexPath,
  TreeNodesIndex,
  NodesKey,
  IdKey,
  NodeId
} from '../../../flow/tree'

import { fromJS } from 'immutable'
import { parseTreeNode } from './TreeNodeModifiers'

export const treeIndexPathToTreeNodesPath = (path: TreeIndexPath, nodesKey: NodesKey, appendNodesKey: boolean = false) : TreeNodesPath => {
  let nodesPath = path.reduce((prev, index) => prev.concat([nodesKey, index]), [])
  if (appendNodesKey) nodesPath.push(nodesKey)
  return nodesPath
}

export const getNodesIndex = (nodes: TreeNodes, id: NodeId, idKey: IdKey) : ?TreeNodesIndex => {
  if (Array.isArray(nodes)) {
    const index = nodes.findIndex(entry => entry && entry.node && entry.node[idKey] === id)
    if (index > -1) return index
  }
  return null
}

export const getTreeIndexPath = (node: Tree, path: TreePath, nodesKey: NodesKey, idKey: IdKey) : ?TreeIndexPath => {
  const pathIndexes = []
  let currentNodes = node[nodesKey]
  for (let i = 0, l = path.length; i < l; i++) {
    const index = getNodesIndex(currentNodes, path[i], idKey)
    if (index == null) return null
    pathIndexes.push(index)
    currentNodes = currentNodes[index][nodesKey]
  }
  return pathIndexes
}

export const getUidFromPath = (arr: ?NodeId[]) : ?NodeId => {
  if (arr == null) return null
  if (arr.length === 0) return null
  return arr[arr.length - 1]
}

export const getTreeNode = function (treeData: Tree, path: TreePath, nodesKey: NodesKey, idKey: IdKey) : ?TreeNode {
  const pathIndexes = getTreeIndexPath(treeData, path, nodesKey, idKey)
  if (pathIndexes == null) return null
  const nodesPath = treeIndexPathToTreeNodesPath(pathIndexes, nodesKey)
  const tree = fromJS(treeData)
  const node = tree.getIn(nodesPath)
  if (node == null) return null
  return node.toJS()
}

export const parseTree = (nodeData: {}) : Tree => {
  let node = parseTreeNode(nodeData)
  return { nodes: [node] }
}

// @TODO: Flow type for node (Tree, TreeNode)
// @TODO: Flow type for search
export const findTreePath = (node: any, search: (node: any) => boolean, nodesKey: NodesKey, idKey: IdKey) : ?TreePath => {
  if (search(node)) return [node.node[idKey]]
  let nodes = node[nodesKey]
  let path = []
  if (node && node.node && node.node[idKey]) path.push(node.node[idKey])
  for (let i = 0, l = nodes.length; i < l; i++) {
    const childPath = findTreePath(nodes[i], search, nodesKey, idKey)
    if (childPath != null) {
      return path.concat(childPath)
    }
  }
  return null
}

// @TODO: Flow type for node (Tree, TreeNode)
// @TODO: flowtype for filterFunc (Tree, TreeNode)
export const filterTree = (node: Tree, parent?: Tree, filterFunc: Function, nodesKey: NodesKey, idKey: IdKey) : Tree => {
  const filteredTree = { nodes: [] }
  const nodes = node[nodesKey]
  for (let i = 0, l = nodes.length; i < l; i++) {
    if (filterFunc(nodes[i], node)) {
      const filteredNode = filterTree(nodes[i], node, filterFunc, nodesKey, idKey)
      filteredTree.nodes.push({ ...nodes[i], nodes: filteredNode.nodes })
    }
  }
  return filteredTree
}

export const flattenTree = (node: Tree, nodesKey: NodesKey) : TreeNodes => {
  let flattenedTree = []
  const nodes = node[nodesKey]
  for (let i = 0, l = nodes.length; i < l; i++) {
    flattenedTree.push(nodes[i])
    flattenedTree = flattenedTree.concat(flattenTree(nodes[i], nodesKey))
  }
  return flattenedTree
}

// @TODO: flowtype for mapFunc
export const mapTree = (node: Tree, mapFunc: Function, nodesKey: NodesKey) : Tree => {
  let nodes = node[nodesKey]
  if (Array.isArray(nodes)) {
    for (let i = 0, l = nodes.length; i < l; i++) {
      nodes[i] = mapTree(mapFunc(nodes[i]), mapFunc, nodesKey)
    }
  }
  return node
}

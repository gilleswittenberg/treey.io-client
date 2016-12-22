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

export const getUidFromPath = (arr: ?TreePath) : ?NodeId => {
  if (arr == null) return null
  if (arr.length === 0) return null
  return arr[arr.length - 1]
}

export const getParentFromPath = (arr: ?TreePath) : ?NodeId => {
  if (arr == null) return null
  if (arr.length < 2) return null
  return arr[arr.length - 2]
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

export const findTreePath = (tree?: Tree, node?: TreeNode, searchFunc: (node: TreeNode) => boolean, nodesKey: NodesKey, idKey: IdKey) : ?TreePath => {
  if (node != null) {
    if (searchFunc(node)) return [node.node[idKey]]
  }
  let nodes
  if (tree != null) {
    nodes = tree[nodesKey]
  } else if (node != null){
    nodes = node[nodesKey]
  } else {
    return null
  }
  let path = []
  if (node && node.node && node.node[idKey]) path.push(node.node[idKey])
  for (let i = 0, l = nodes.length; i < l; i++) {
    const childPath = findTreePath(undefined, nodes[i], searchFunc, nodesKey, idKey)
    if (childPath != null) {
      return path.concat(childPath)
    }
  }
  return null
}

export const filterTree = (tree?: Tree, node?: TreeNode, parent?: TreeNode, filterFunc: (treeNode: TreeNode, parent?: TreeNode) => boolean, nodesKey: NodesKey, idKey: IdKey) : Tree => {
  const filteredTree = { nodes: [] }
  let nodes
  if (tree != null) {
    nodes = tree[nodesKey]
  } else if (node != null) {
    nodes = node[nodesKey]
  } else {
    return filteredTree
  }
  for (let i = 0, l = nodes.length; i < l; i++) {
    const parent = tree != null ? undefined : node
    if (filterFunc(nodes[i], parent)) {
      const filteredNode = filterTree(undefined, nodes[i], parent, filterFunc, nodesKey, idKey)
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

export const mapTree = (node: Tree, mapFunc: (node: TreeNode) => TreeNode, nodesKey: NodesKey) : Tree => {
  let nodes = node[nodesKey]
  if (Array.isArray(nodes)) {
    for (let i = 0, l = nodes.length; i < l; i++) {
      nodes[i] = mapTree(mapFunc(nodes[i]), mapFunc, nodesKey)
    }
  }
  return node
}

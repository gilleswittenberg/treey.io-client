/* @flow */

import type {
  TreeData,
  Nodes,
  TreePath,
  TreeNodesPath,
  TreeIndexPath,
  NodesIndex,
  NodesKey,
  IdKey,
  NodeId
} from '../../flow/tree'

import { fromJS } from 'immutable'
import { setPathOnNode } from './NodeModifiers'

export const treeIndexPathToTreeNodesPath = (path: TreeIndexPath, nodesKey: string, appendNodesKey: boolean = false) : TreeNodesPath => {
  let nodesPath = path.reduce((prev, index) => prev.concat([nodesKey, index]), [])
  if (appendNodesKey) nodesPath.push(nodesKey)
  return nodesPath
}

export const getNodesIndex = (nodes: Nodes, id: NodeId, idKey: IdKey) : ?NodesIndex => {
  if (Array.isArray(nodes)) {
    const index = nodes.findIndex(entry => entry[idKey] === id)
    if (index > -1) return index
  }
  return null
}

export const getTreeIndexPath = (node: TreeData, path: TreePath, nodesKey: NodesKey, idKey: IdKey) : ?TreeIndexPath => {
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

export const getTreeNode = function (treeData: TreeData, path: TreePath, nodesKey: NodesKey, idKey: IdKey) : ?Node {
  const pathIndexes = getTreeIndexPath(treeData, path, nodesKey, idKey)
  if (pathIndexes == null) return null
  const nodesPath = treeIndexPathToTreeNodesPath(pathIndexes, nodesKey)
  const tree = fromJS(treeData)
  const node = tree.getIn(nodesPath)
  if (node == null) return null
  return node.toJS()
}

// @TODO: Flowtype for parseFn
// @TODO: Flowtype for return value
export const parseTreeNode = (nodeData: any, parseFn: Function, parentPath: string[] = [], nodesKey: NodesKey, idKey: IdKey) => {
  let node = parseFn(nodeData)
  node = setPathOnNode(node, parentPath, idKey)
  const nodesData = nodeData[nodesKey]
  if (nodesData) {
    const nodes = nodesData.map(data => parseTreeNode(data, parseFn, node.path, nodesKey, idKey))
    node.nodes = nodes
  }
  return node
}

// @TODO: flowtype for parseFn
export const parseTree = (nodeData: any, parseFn: Function, nodesKey: NodesKey, idKey: IdKey) : TreeData => {
  let node = parseTreeNode(nodeData, parseFn, [], nodesKey, idKey)
  return { nodes: [node] }
}

// @TODO: flowtype for search
export const findTreePath = (node: TreeData, search: Function, nodesKey: NodesKey, idKey: IdKey) : ?TreePath => {
  if (search(node)) return [node[idKey]]
  let nodes = node[nodesKey]
  let path = []
  if (node[idKey]) path.push(node[idKey])
  for (let i = 0, l = nodes.length; i < l; i++) {
    const childPath = findTreePath(nodes[i], search, nodesKey, idKey)
    if (childPath != null) {
      return path.concat(childPath)
    }
  }
  return null
}

// @TODO: flowtype for filterFn
export const filterTree = (node: TreeData, parent: ?TreeData, filterFn: Function, nodesKey: NodesKey, idKey: IdKey) : TreeData => {
  const filteredTree = { nodes: [] }
  const nodes = node[nodesKey]
  for (let i = 0, l = nodes.length; i < l; i++) {
    if (filterFn(nodes[i], node)) {
      const filteredNode = filterTree(nodes[i], node, filterFn, nodesKey, idKey)
      filteredTree.nodes.push({ ...nodes[i], nodes: filteredNode.nodes })
    }
  }
  return filteredTree
}

export const flattenTree = (node: TreeData, nodesKey: NodesKey) : Nodes => {
  let flattenedTree = []
  const nodes = node[nodesKey]
  for (let i = 0, l = nodes.length; i < l; i++) {
    flattenedTree.push(nodes[i])
    flattenedTree = flattenedTree.concat(flattenTree(nodes[i], nodesKey))
  }
  return flattenedTree
}

// @TODO: flowtype for mapFn
export const mapTree = (node: TreeData, mapFn: Function, nodesKey: NodesKey) : TreeData => {
  let nodes = node[nodesKey]
  if (Array.isArray(nodes)) {
    for (let i = 0, l = nodes.length; i < l; i++) {
      nodes[i] = mapTree(mapFn(nodes[i]), mapFn, nodesKey)
    }
  }
  return node
}

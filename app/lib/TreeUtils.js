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

export const pathToNodesPath = (path: TreeIndexPath, nodesKey: string, appendNodesKey: boolean = false) : TreeNodesPath => {
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

export const getPathIndexes = (node: TreeData, path: TreePath, nodesKey: NodesKey, idKey: IdKey) : ?TreeIndexPath => {
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

export const find = (node: TreeData, search: Function, nodesKey: NodesKey, idKey: IdKey) : ?TreeIndexPath => {
  if (search(node)) return [node[idKey]]
  let nodes = node[nodesKey]
  let path = []
  if (node[idKey]) path.push(node[idKey])
  for (let i = 0, l = nodes.length; i < l; i++) {
    const childPath = find(nodes[i], search, nodesKey, idKey)
    if (childPath != null) {
      return path.concat(childPath)
    }
  }
  return null
}

export const filter = (node: TreeData, parent: ?TreeData, filterFn: Function, nodesKey: NodesKey, idKey: IdKey) : TreeData => {
  const filteredTree = { nodes: [] }
  const nodes = node[nodesKey]
  for (let i = 0, l = nodes.length; i < l; i++) {
    if (filterFn(nodes[i], node)) {
      const filteredNode = filter(nodes[i], node, filterFn, nodesKey, idKey)
      filteredTree.nodes.push({ ...nodes[i], nodes: filteredNode.nodes })
    }
  }
  return filteredTree
}

export const flatten = (node: TreeData, nodesKey: NodesKey) : Nodes => {
  let flattenedTree = []
  const nodes = node[nodesKey]
  for (let i = 0, l = nodes.length; i < l; i++) {
    flattenedTree.push(nodes[i])
    flattenedTree = flattenedTree.concat(flatten(nodes[i], nodesKey))
  }
  return flattenedTree
}

export const map = (node: TreeData, mapFn: Function, nodesKey: NodesKey) : TreeData => {
  let nodes = node[nodesKey]
  if (Array.isArray(nodes)) {
    for (let i = 0, l = nodes.length; i < l; i++) {
      nodes[i] = map(mapFn(nodes[i]), mapFn, nodesKey)
    }
  }
  return node
}

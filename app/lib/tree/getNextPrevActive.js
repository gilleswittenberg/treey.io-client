/* @flow */

import type { Nodes, Node, NodeId, TreePath } from '../../../flow/tree'
import type { ExpandedObject } from '../../../flow/types'
import arraysEqual from '../utils/arraysEqual'

const findNode = (nodes: Nodes, uuid: NodeId) : ?Node => nodes.find(node => node.uuid === uuid)

const getNodesAtTreePath = (nodesArray: Nodes, treePath: TreePath) : Nodes => {
  const nodes = []
  // Guard
  if (treePath == null) return nodes
  treePath.forEach(uuid => {
    const node = findNode(nodesArray, uuid)
    if (node != null) {
      nodes.push(node)
    }
  })
  return nodes
}

const isExpanded = (treePath: TreePath, expanded?: ExpandedObject) : boolean => {
  // Guard
  if (expanded == null) return false
  let ret = false
  Object.keys(expanded).forEach(k => {
    if (expanded != null && arraysEqual(expanded[k], treePath)) {
      ret = true
    }
  })
  return ret
}

const getLastTreePath = (nodes: Nodes, expanded?: ExpandedObject) : TreePath => {
  let node = nodes[0]
  const treePath = node != null && node.uuid != null ? [node.uuid] : []
  while (node && node.nodes && node.nodes.length > 0 && isExpanded(treePath, expanded)) {
    const uuid = node.nodes[node.nodes.length - 1]
    treePath.push(uuid)
    node = findNode(nodes, uuid)
  }
  return treePath
}

export const getNextActive = (nodesArray: Nodes, treePath: TreePath, expanded?: ExpandedObject) : TreePath => {

  console.log(nodesArray, treePath, expanded)

  const nodes = getNodesAtTreePath(nodesArray, treePath)
  console.log(nodes)

  // First child of active and expanded node
  const node = nodes[treePath.length - 1]
  if (node && node.nodes && node.nodes.length > 0 && isExpanded(treePath, expanded)) {
    return treePath.concat([node.nodes[0]])
  }

  // Next sibling or parent's sibling recursive
  for (let i = treePath.length - 1; i >= 0; i--) {
    const parent = nodes[i - 1]
    // Guard
    if (parent == null || parent.nodes == null) continue // eslint-disable-line no-continue
    if (parent.nodes != null) {
      const index = parent.nodes.findIndex(uuid => uuid === treePath[i])
      if (parent.nodes != null && parent.nodes.length - 1 > index) {
        const diff = treePath.length - 1 - i
        const ret = treePath.slice(0, treePath.length - diff)
        if (parent.nodes != null) {
          ret[ret.length - 1] = parent.nodes[index + 1]
        }
        return ret
      }
    }
  }

  // Return root (circular back to beginning)
  return treePath.slice(0, 1)
}

export const getPrevActive = (nodesArray: Nodes, treePath: TreePath, expanded?: ExpandedObject) : TreePath => {

  // Guards
  if (nodesArray.length === 0) return []
  if (treePath == null) return []

  const nodes = getNodesAtTreePath(nodesArray, treePath)

  if (nodes.length >= 2) {
    const parent = nodes[nodes.length - 2]
    if (parent != null && parent.nodes != null) {
      const index = parent.nodes.findIndex(uuid => uuid === treePath[treePath.length - 1])
      if (index > 0) {
        if (parent.nodes != null) {
          const prevUuid = parent.nodes[index - 1]
          let ret = treePath.slice(0, -1).concat([prevUuid])
          const prevNode = findNode(nodesArray, prevUuid)
          if (isExpanded(ret, expanded) && prevNode != null && prevNode.nodes != null && prevNode.nodes.length > 0) {
            ret = ret.concat([prevNode.nodes[prevNode.nodes.length - 1]])
          }
          return ret
        }
      }
    }
  }

  if (arraysEqual(treePath, [nodesArray[0].uuid])) {
    return getLastTreePath(nodesArray, expanded)
  }

  return treePath.slice(0, -1)
}

/* @flow */

import type { Nodes, TreePath } from '../../../flow/tree'
import arraysEqual from '../utils/arraysEqual'

export const getNextActive = (nodesArray: Nodes, indices: TreePath, expanded: any) : TreePath => {

  const nodes = getNodesAtIndices(nodesArray, indices)

  // First child
  const node = nodes[indices.length - 1]
  if (node && node.nodes && node.nodes.length > 0 && isExpanded(indices, expanded)) {
    return indices.concat([node.nodes[0]])
  }

  // Next sibling or parent's sibling recursive
  for (let i = indices.length - 1; i >= 0; i--) {
    const parent = nodes[i - 1]
    // Guard
    if (parent == null || parent.nodes == null) continue
    if (parent.nodes != null) {
      const index = parent.nodes.findIndex(uuid => uuid === indices[i])
      if (parent.nodes != null && parent.nodes.length - 1 > index) {
        const diff = (indices.length - 1) - i
        const ret = indices.slice(0, indices.length - diff)
        if (parent.nodes != null) {
          ret[ret.length - 1] = parent.nodes[index + 1]
        }
        return ret
      }
    }
  }

  // Return root
  return indices.slice(0, 1)
}

export const getPrevActive = (nodesArray: Nodes, indices: TreePath, expanded: any) : TreePath => {

  // Guards
  if (nodesArray.length === 0) return []
  if (indices == null) return []

  const nodes = getNodesAtIndices(nodesArray, indices)

  if (nodes.length >= 2) {
    const parent = nodes[nodes.length - 2]
    if (parent != null && parent.nodes != null) {
      const index = parent.nodes.findIndex(uuid => uuid === indices[indices.length - 1])
      if (index > 0) {
        if (parent.nodes != null) {
          const prevUuid = parent.nodes[index - 1]
          let ret = indices.slice(0, -1).concat([prevUuid])
          const prevNode = findNode(nodesArray, prevUuid)
          if (isExpanded(ret, expanded) && prevNode != null && prevNode.nodes != null && prevNode.nodes.length > 0) {
            ret = ret.concat([prevNode.nodes[prevNode.nodes.length - 1]])
          }
          return ret
        }
      }
    }
  }

  if (arraysEqual(indices, [nodesArray[0].uuid])) {
    return getLastIndices(nodesArray, expanded)
  }

  return indices.slice(0, -1)
}

const findNode = (nodes, uuid) => {
  return nodes.find(node => node.uuid === uuid)
}

const getNodesAtIndices = (nodes, indices) => {
  // Guard
  if (indices == null) return []
  return indices.map(uuid => findNode(nodes, uuid))
}

const isExpanded = (indices, expanded) => {
  // Guard
  if (!expanded) return false
  let ret = false
  Object.keys(expanded).forEach(k => {
    if (arraysEqual(expanded[k], indices)) {
      ret = true
    }
  })
  return ret
}

const getLastIndices = (nodes, expanded) => {
  let node = nodes[0]
  const indices = node != null && node.uuid != null ? [node.uuid] : []
  while (node && node.nodes && node.nodes.length > 0 && isExpanded(indices, expanded)) {
    const uuid = node.nodes[node.nodes.length - 1]
    indices.push(uuid)
    node = findNode(nodes, uuid)
  }
  return indices
}

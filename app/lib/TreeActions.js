import type { NodeData, Node, NodeMap } from '../../flow/types'
import { List } from 'immutable'

import defaultUI from './defaultUI'

const nodesKey = 'nodes'

export const updateNode = (data: NodeData) => {
  return function (node: Node) : Node {
    node.data = data
    return node
  }
}

export const updateNodeUI = (key: string, value: boolean) => {
  return function (node: Node) : Node {
    node.ui[key] = value
    return node
  }
}

export const createNode = (data: NodeData, uid?: string = null) => {
  return function () : Node {
    return {
      uid,
      path: null,
      data,
      ui: defaultUI
    }
  }
}

export const addNode = (node: Node, before?: string) => {
  return function (parent: Node, prev?: Node) : Node {
    let nodes = parent[nodesKey] || []
    const index = before ? nodes.findIndex(index => index.uid === before) : -1
    node = prev === undefined ? node : prev
    node.path = List(parent.path).push(node.uid).toJS()
    index > -1 ? nodes.splice(index, 0, node) : nodes.push(node)
    parent[nodesKey] = nodes
    return parent
  }
}

export const removeNode = (uid: string) => {
  return function (parent: NodeMap) : NodeMap {
    let nodes = parent[nodesKey]
    let index = nodes.findIndex(index => index.uid === uid)
    if (index > -1) nodes.splice(index, 1)
    parent[nodesKey] = nodes
    return parent
  }
}

/* @flow */

import { fromJS, List } from 'immutable'
import type { Node, NodeMap, NodesList } from '../../flow/types'

const idKey = 'uid'
const nodesKey = 'nodes'

function toJS (im: ?NodeMap) {
  return im ? im.toJS() : {}
}

const Tree = {

  // do action or skip
  skipOrDo (node: Node, action: Function, skip: Function = () => false) : Node {
    if (!skip(node)) return action(node)
    return node
  },

  // path index
  getNextChildIndex (node: NodeMap, id: string) : ?number {
    let nodes = node.get(nodesKey)
    if (List.isList(nodes)) {
      const index = nodes.findIndex(entry => entry.get(idKey) === id)
      if (index > -1) return index
    }
    return null
  },

  getPathIndexes (node: NodeMap, path: string[]) : ?number[] {
    const pathIndexes = []
    let currentNode = node
    if (currentNode.get(idKey) !== path[0]) return null
    for (let i = 1, l = path.length; i < l; i++) {
      const index = this.getNextChildIndex(currentNode, path[i])
      if (index === null) return null
      pathIndexes.push(index)
      currentNode = currentNode.getIn([nodesKey, index])
    }
    return pathIndexes
  },

  includeNodesKeyInPathIndexes (pathIndexes: number[]) : mixed[] {
    return pathIndexes.reduce((prev, index) => prev.concat([nodesKey, index]), [])
  },

  doAction (treeData: Node, path: string[], action: Function) {
    let tree = fromJS(treeData)
    let indexPath = this.includeNodesKeyInPathIndexes(this.getPathIndexes(tree, path))
    let node = tree.getIn(indexPath)
    node = this.skipOrDo(node, action)
    tree = tree.setIn(indexPath, node)
    return toJS(tree)
  },

  doActionRecursive (node: Node, action: Function, skip: Function) {
    node = this.skipOrDo(node, action, skip)
    let nodes: NodesList = node.get(nodesKey)
    if (List.isList(nodes)) {
      for (let i = 0, l = nodes.size; i < l; i++) {
        nodes = nodes.set(i, this.doActionRecursive(nodes.get(i), action, skip))
      }
    }
    node = node.set(nodesKey, nodes)
    return node
  },

  doActionAll (treeData: Node, action: Function, skip: Function) {
    let tree = fromJS(treeData)
    tree = this.doActionRecursive(tree, action, skip)
    return toJS(tree)
  }
}

export default Tree

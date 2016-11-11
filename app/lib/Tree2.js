/* @flow */

import { fromJS, List } from 'immutable'
import type { Node, NodeMap, NodesList } from '../../flow/types'

const idKey = 'uid'
const nodesKey = 'nodes'

const Tree = {

  doo (node: NodeMap, action: Function, prev: any) : NodeMap {
    node = node.toJS()
    node = action(node, prev)
    return fromJS(node)
  },

  doos (node: NodeMap, actions: any) : any {
    let result
    for (let i = 0, l = actions.length; i < l; i++) {
      result = this.doo(node, actions[i], result)
    }
    return result
  },

  // do action or skip
  skipOrDo (node: NodeMap, action: Function, skip: Function = () => false) : NodeMap {
    node = node.toJS()
    if (!skip(node)) {
      node = action(node)
    }
    return fromJS(node)
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

  getNode (treeData: Node, path: string[]) {
    let tree = fromJS(treeData)
    let indexPath = this.includeNodesKeyInPathIndexes(this.getPathIndexes(tree, path))
    let node = tree.getIn(indexPath)
    return node
  },

  doAction (treeData: Node, path: string[], ...actions: any) {
    let tree = fromJS(treeData)
    let indexPath = this.includeNodesKeyInPathIndexes(this.getPathIndexes(tree, path))
    let node = tree.getIn(indexPath)
    node = this.doos(node, actions)
    tree = tree.setIn(indexPath, node)
    return tree.toJS()
  },

  doActionRecursive (node: NodeMap, action: Function, skip: Function) {
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
    return tree.toJS()
  }
}

export default Tree

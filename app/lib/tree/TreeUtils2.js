import type { Tree, Nodes, TreeNode, NodesKey, IndexPath, TreePath, NodeId } from '../../../flow/tree'
import { fromJS } from 'immutable'

export const updateNodeAtIndexPath = (tree: Tree, nodesKey: NodesKey, indexPath: IndexPath, key: string, value: any) : Tree => {
  const tree1 = fromJS(tree)
  const nodesIndexPath = indexPathToNodesIndexPath(indexPath, nodesKey)
  const keys = key.split('.')
  const inPath = nodesIndexPath.concat(keys)
  const exists = tree1.getIn(inPath)
  if (exists != null) {
    const tree2 = tree1.setIn(inPath, value)
    return tree2.toJS()
  }
  return tree
}

export const updateAllNodes = (tree: Tree, nodesKey: NodesKey, key: string, value: any) : TreeNode => {
  const tree1 = fromJS(tree)
  const tree2 = tree1.set(nodesKey, updateNodes(tree1.get(nodesKey), nodesKey, key, value))
  return tree2.toJS()
}

const updateNodes = (nodes: Nodes, nodesKey: NodesKey, key: string, value: any) : Nodes => {
  const nodes1 = nodes.map(node => {
    const keys = key.split('.')
    const node1 = node.setIn(keys, value)
    const nodeNodes = node1.get(nodesKey)
    if (nodeNodes) {
      const node2 = node1.set(nodesKey, updateNodes(nodeNodes, nodesKey, key, value))
      return node2
    }
    return node1
  })
  return nodes1
}

// @TODO: breath first, depth first argument
// @TODO: direction type enum { 'FORWARDS', 'BACKWARDS' }
/*
export const getNextIndexPath = (tree: Tree, nodesKey: NodesKey, indexPath: IndexPath, direction: string = 'FORWARDS', circular: bool = true) : ?IndexPath => {

}
*/

const indexPathToNodesIndexPath = (indexPath: IndexPath, nodesKey: NodesKey) : [] => {
  return indexPath.reduce((prev, index) => prev.concat([nodesKey, index]) , [])
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

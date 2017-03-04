/* @flow */

import type {
  TreeNodes,
  TreeNode,
  TreePath,
  Node,
  NodeId,
  NodeData,
  NodeUI,
  Transaction
} from '../../../flow/tree'

import { fromJS } from 'immutable'
import { updateNode, updateNodeTransaction, parseNode } from './NodeModifiers'

// @TODO: Use Flow type TreeNode instead of any
const setPath = (treeNode: any, parentPath?: TreePath = [], id?: ?NodeId) : any => {
  let path = parentPath
  if (id != null) path = path.concat(id)
  treeNode.path = path
  return treeNode
}

// @TODO: Use Flow type TreeNode instead of any
const setNodes = (treeNode: any, nodes?: TreeNodes = []) : any => {
  treeNode.nodes = nodes
  return treeNode
}

const parseNodes = (treeNode: TreeNode, nodes: TreeNodes) : TreeNode => {
  let treeNodes = nodes != null ? nodes.map(data => parseTreeNode(data, treeNode.path)) : undefined
  return setNodes(treeNode, treeNodes)
}

export const updatePath = (treeNode: TreeNode, parentPath: TreePath = []) : TreeNode => {
  const uid = treeNode.node.uid
  const path = uid != null ? parentPath.concat(uid) : parentPath
  treeNode.path = path
  for (let i = 0, l = treeNode.nodes.length; i < l; i++) {
    treeNode.nodes[i] = updatePath(treeNode.nodes[i], treeNode.path)
  }
  return treeNode
}

export const createTreeNode = (node: Node, parentPath?: TreePath = [], nodes?: TreeNodes = []) : TreeNode => {
  let treeNode = {}
  treeNode.node = node
  treeNode = setPath(treeNode, parentPath, node.uid)
  treeNode = setNodes(treeNode, nodes)
  return treeNode
}

export const updateTreeNode = (treeNode: TreeNode, id?: NodeId, data?: NodeData, ui?: NodeUI) : TreeNode => {
  let map = fromJS(treeNode)
  map = map.set('node', updateNode(map.get('node').toJS(), id, data, ui))
  treeNode = map.toJS()
  if (id != null) {
    treeNode = setPath(treeNode, treeNode.path, id)
  }
  return treeNode
}

export const updateTreeNodeTransaction = (treeNode: TreeNode, transaction: Transaction) : TreeNode => {
  let map = fromJS(treeNode)
  map = map.set('node', updateNodeTransaction(map.get('node').toJS(), transaction))
  treeNode = map.toJS()
  return treeNode
}

export const parseTreeNode = (nodeData: any, parentPath: TreePath = []) : TreeNode => {
  const node = parseNode(nodeData)
  let treeNode = createTreeNode(node, parentPath)
  treeNode = parseNodes(treeNode, nodeData.nodes)
  return treeNode
}

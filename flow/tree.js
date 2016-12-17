/* @flow */

// @TODO: allow for settings NodesKey dynamically
export type NodesKey = string
// @TODO: allow for settings IdKey dynamically
export type IdKey = string
export type NodeId = string

export type TreePath = NodeId[]
export type TreeNodesIndex = number
export type TreeIndexPath = TreeNodesIndex[]
export type TreeNodesPath = []

export type TreeNode = {
  path: TreePath,
  nodes: TreeNodes,
  node: Node
}

export type TreeNodes = TreeNode[]

export type Tree = {
  nodes: TreeNodes
}

export type Node = {
  uid: ?NodeId,
  data: NodeData,
  ui: NodeUI
}

export type Nodes = Node[]

export type NodeData = {
  title: string
}
// @TODO: non-optional keys
export type NodeUI = {
  active?: boolean,
  expanded?: boolean,
  adding?: boolean,
  editing?: boolean,
  dragging?: boolean,
  movingChild?: boolean,
  buttonsShown?: boolean
}

export type PrevOrNext = 'PREV' | 'NEXT'

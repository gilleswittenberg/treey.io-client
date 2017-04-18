/* @flow */

export type UUID = string

// @TODO: allow for settings NodesKey dynamically
export type NodesKey = string
// @TODO: allow for settings IdKey dynamically
export type IdKey = string
export type NodeId = string
export type NodeUser = string

export type TreePath = NodeId[]
export type TreeNodesIndex = number
export type TreeIndexPath = TreeNodesIndex[]
export type IndexPath = number[]
export type TreeNodesPath = []

export type Tree = {
  nodes: TreeNodes
}
export type TreeNodes = TreeNode[]
export type TreeNode = {
  nodes: TreeNodes,
  ui: NodeUI
}

export type Node = {
  uid: ?NodeId,
  user: ?NodeUser,
  data: NodeData,
  transactions: Transaction[],
  // @TODO: make non-optional
  nodes?: NodeId[]
}

export type Nodes = Node[]

export type NodeData = {
  title: string
}

export type TransactionType = 'SET' | 'ADD_CHILD' | 'REMOVE_CHILD'
export type TransactionStatus = 'PENDING' | 'DENIED' | 'COMMITTED' | 'UNDONE'
export type Transaction = {
  type: TransactionType,
  uid: NodeId,
  uuid: UUID,
  status: TransactionStatus,
  data?: NodeData,
  childUid?: NodeId,
  before?: NodeId
}

export type NodeUIKey = 'active' | 'expanded' | 'adding' | 'editing' | 'dragging' | 'movingChild' | 'buttonsShown'
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

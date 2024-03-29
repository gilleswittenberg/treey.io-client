/* @flow */

export type UUID = string

// @TODO: allow for settings NodesKey dynamically
export type NodesKey = string
// @TODO: allow for settings IdKey dynamically
export type IdKey = string
export type NodeId = UUID
export type NodeUser = string

export type TreePath = NodeId[]

export type NodeData = {
  title: string
}

export type TransactionId = UUID
export type TransactionType = 'CREATE' | 'SET' | 'ADD_CHILD' | 'REMOVE_CHILD' | 'REVERT'
export type TransactionStatus = 'PENDING' | 'DENIED' | 'COMMITTED' | 'CANCELLED' | 'UNDONE'
export type Transaction = {
  uuid: TransactionId,
  node: NodeId,
  type: TransactionType,
  status: TransactionStatus,
  auth?: {
    user: string
  },
  data?: NodeData,
  child?: NodeId,
  before?: NodeId,
  transaction?: TransactionId,
  isSyncing?: boolean,
  isReverted?: boolean,
  isOverridden?: boolean,
  modified: Date,
  created: Date
}
export type Transactions = Transaction[]


export type Node = {
  uuid: UUID,
  auth?: {
    user: ?NodeUser,
  },
  data: NodeData,
  transactions: Transactions,
  nodes: NodeId[]
}

export type Nodes = Node[]

export type UIKey = 'active' | 'expanded' | 'adding' | 'editing' | 'dragging' | 'movingChild' | 'buttonsShown'

export type PrevOrNext = 'PREV' | 'NEXT'

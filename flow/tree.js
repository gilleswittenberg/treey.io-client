/* @flow */

export type NodesKey = string
export type IdKey = string
export type NodeId = string

// @TODO: allow for settings NodesKey dynamically
export type TreeData = {
  nodes: Nodes
}
// @TODO: allow for settings IdKey dynamically

export type TreePath = string[]
export type TreeIndexPath = number[]
export type TreeNodesPath = []

export type Nodes = Node[]
export type NodesIndex = number


// @TODO: allow for settings IdKey dynamically
// @TODO: allow for settings NodesKey dynamically
export type Node = {
  uid: ?NodeId,
  path?: TreePath,
  data?: NodeData,
  ui?: NodeUI,
  nodes: Nodes
}

export type NodeData = {
  title?: string
}
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

/* @flow */

import { Map, List } from 'immutable'

export type Node = { uid: string, title: string, nodes: ?Node[] }
export type NodeData = { title: string }
export type NodeMap = Map<string, any>
export type NodesList = List<NodeMap>

export type State = {
  nodes: NodesState,
  ui: UIState
}

export type NodesState = {
  isSyncing: boolean,
  hasErrors: boolean,
  tree: ?Node
}

type NodesActionType =
  'START_SYNCING' |
  'STOP_SYNCING' |
  'HAS_ERRORS' |
  'INDEX_NODES' |
  'GET_NODES' |
  'ADD_NODE' |
  'POST_NODE' |
  'UPDATE_NODE' |
  'PUT_NODE' |
  'REMOVE_NODE' |
  'DELETE_NODE' |
  'MOVE_NODE' |
  'PUT_MOVE_NODE'

export type NodesAction = {
  type: NodesActionType,
  data: {
    parent: string,
    node: NodeData,
    uid: string,
    newParent: string,
    before: string
  }
}

type UIActionType =
  'INIT' |
  'SET_IS_EDITING' |
  'UNSET_IS_EDITING' |
  'SET_SHOW_BUTTONS' |
  'UNSET_SHOW_BUTTONS' |
  'TOGGLE_EXPANDED'

export type UIAction = {
  type: UIActionType,
  data: {
    uid: string
  }
}

export type UIState = {
  editing: ?string,
  showButtons: ?string,
  expanded: string[]
}

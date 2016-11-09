/* @flow */

import { Map, List } from 'immutable'

export type Type = 'boolean' | 'number' | 'string' | '[]' | 'boolean[]' | 'string[]' | 'number[]'

export type NodeData = { title: string }
export type NodeUI = {
  active: boolean,
  expanded: boolean,
  adding: boolean,
  editing: boolean,
  dragging: boolean,
  movingChild: boolean,
  hasButtonsShown: boolean
}
export type Node = {
  uid: string,
  path?: string,
  data?: NodeData,
  ui?: NodeUI,
  nodes?: Node[]
}
export type NodeMap = Map<string, any>
export type NodesList = List<NodeMap>

// @LINK: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
export type Lang = 'en'

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
    tree: any,
    parent: string,
    node: NodeData,
    uid: string,
    newParent: string,
    before: string
  }
}

type UIActionType =
  'INIT_EXPANDED' |
  'TOGGLE_EXPANDED' |
  'SET_IS_EDITING' |
  'UNSET_IS_EDITING' |
  'SET_IS_MOVING_CHILD' |
  'UNSET_IS_MOVING_CHILD' |
  'SET_IS_DRAGGING' |
  'UNSET_IS_DRAGGING' |
  'SET_SHOW_BUTTONS' |
  'UNSET_SHOW_BUTTONS'

export type UIAction = {
  type: UIActionType,
  data: {
    expanded: string[],
    uid: string
  }
}

export type UIState = {
  lang: string,
  enableDnD: bool,
  active: ?string,
  editing: ?string,
  movingChild: ?string,
  dragging: ?string,
  showButtons: ?string,
  expanded: string[]
}

export type HoverRegion = 'top' | 'bottom'

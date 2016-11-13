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
  buttonsShown: boolean
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
  app: AppState
}

export type NodesState = {
  isSyncing: boolean,
  hasErrors: boolean,
  tree: ?Node,
  userIsDragging: boolean
}

type NodesActionType =
  'START_SYNCING' |
  'STOP_SYNCING' |
  'HAS_ERRORS' |
  'INDEX_NODES' |
  'UPDATE_NODE_UI' |
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
    path: string[],
    parent: string,
    node: NodeData,
    uid: string,
    newParent: string,
    before: string,
    key: string,
    value: boolean
  }
}

type AppActionType = '@TODO'

export type AppAction = {
  type: AppActionType,
  data: {}
}

export type AppState = {
  lang: Lang,
  enableDnD: boolean
}

export type HoverRegion = 'top' | 'bottom'

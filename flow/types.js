/* @flow */

import { Map, List } from 'immutable'
import type { TreeData, TreePath, NodeId, Node } from './tree'

export type Type = 'boolean' | 'number' | 'string' | '[]' | 'boolean[]' | 'string[]' | 'number[]'

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
  tree: ?TreeData,
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
    node?: Node,
    tree?: TreeData,
    path?: TreePath,
    newPath?: TreePath,
    before?: NodeId,
    key?: string,
    value?: boolean
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

/* @flow */

import type { Tree, TreePath, NodeId, NodeData, NodeUIKey } from './tree'

export type Type = 'boolean' | 'number' | 'string' | '[]' | 'boolean[]' | 'string[]' | 'number[]'

// @LINK: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
export type Lang = 'en' | 'nl'

export type State = {
  nodes: NodesState,
  app: AppState
}

export type NodesState = {
  isSyncing: boolean,
  hasErrors: boolean,
  tree: ?Tree,
  userIsDragging: boolean
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
  'PUT_MOVE_NODE' |
  'CLEAR_NODE_UI' |
  'UPDATE_NODE_UI' |
  'UPDATE_ACTIVE_NODE_UI' |
  'SET_NEXT_UI_ACTIVE' |
  'SET_PREV_UI_ACTIVE'

export type NodesAction = {
  type: NodesActionType,
  data: {
    nodeData?: NodeData,
    tree?: any,
    path?: TreePath,
    newPath?: TreePath,
    uid?: NodeId,
    before?: NodeId,
    key?: NodeUIKey,
    keys?: NodeUIKey[],
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

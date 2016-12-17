/* @flow */

import type { Tree, TreePath, NodeId, NodeData } from './tree'

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
  'CLEAR_UI_EDITING_ADDING' |
  'SET_UI_EDITING' |
  'SET_UI_ADDING' |
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
    nodeData?: NodeData,
    tree?: any,
    path?: TreePath,
    newPath?: TreePath,
    before?: NodeId,
    key?: string,
    keys?: [string],
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

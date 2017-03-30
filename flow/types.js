/* @flow */

import type { Tree, TreePath, Nodes, NodeId, NodeData, NodeUIKey, Transaction, TransactionStatus } from './tree'

export type Type = 'boolean' | 'number' | 'string' | '[]' | 'boolean[]' | 'string[]' | 'number[]'

// @LINK: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
export type Lang = 'en' | 'nl'

export type State = {
  app: AppState,
  nodes: NodesState,
  user: UserState
}

export type NodesState = {
  isSyncing: boolean,
  hasErrors: boolean,
  tree: ?Tree,
  nodes: Nodes,
  userIsDragging: boolean,
  activePath: ?TreePath
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
  'ADD_NODE_TRANSACTION' |
  'UPDATE_NODE_TRANSACTION_STATUS' |
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
    nodes?: Nodes,
    tree?: any,
    path?: TreePath,
    newPath?: TreePath,
    uid?: NodeId,
    before?: NodeId,
    key?: NodeUIKey,
    keys?: NodeUIKey[],
    value?: boolean,
    transaction?: Transaction,
    status?: TransactionStatus
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

export type UserState = {
  username: ?string,
  authenticationFailed: boolean,
  authenticationError: boolean,
  registrationFailed: boolean,
  registrationError: boolean,
  loggedIn: ?boolean,
  rootId: ?NodeId,
  signOutFailed: boolean
}

type UserActionType =
  'AUTHENTICATE' |
  'UNAUTHENTICATED' |
  'AUTHENTICATION_FAILED' |
  'AUTHENTICATION_ERROR' |
  'REGISTRATION_FAILED' |
  'REGISTRATION_ERROR' |
  'SIGN_OUT_FAILED'

export type UserAction = {
  type: UserActionType,
  data: {
    username?: string,
    rootId?: NodeId
  }
}

export type HoverRegion = 'top' | 'bottom'

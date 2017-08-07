/* @flow */

import type { TreePath, Nodes, NodeId, UIKey, Transaction, TransactionStatus } from './tree'

export type Type = 'boolean' | 'number' | 'string' | '[]' | 'boolean[]' | 'string[]' | 'number[]'

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type FetchOptions = {
  method: HTTPMethod,
  headers: {
    Accept: string,
    'Content-Type'?: string
  },
  credentials: string,
  body?: string
}

// @LINK: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
export type Lang = 'en' | 'nl'

export type NodesState = {
  isSyncing: boolean,
  hasErrors: boolean,
  nodes: Nodes
}

type NodesActionType =
  'START_SYNCING' |
  'STOP_SYNCING' |
  'HAS_ERRORS' |
  'INDEX_NODES' |
  'GET_NODES' |
  'ADD_NODE_TRANSACTION' |
  'UPDATE_NODE_TRANSACTION_STATUS' |
  'SET_NODE_TRANSACTION_IS_SYNCING'

export type NodesAction = {
  type: NodesActionType,
  data: {
    nodes?: Nodes,
    transaction?: Transaction,
    status?: TransactionStatus,
    isSyncing?: boolean
  }
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
  rootNode: ?NodeId,
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
    rootNode?: NodeId
  }
}

export type ExpandedObject = Object

export type UIState = {
  expanded: ExpandedObject,
  active: ?TreePath,
  editing: ?TreePath,
  adding: ?TreePath,
  movingChild: ?TreePath,
  buttonsShown: ?TreePath,
  dragging: ?TreePath
}

type UIActionType =
  'SET_UI_KEY' |
  'UNSET_UI_KEY' |
  'SET_EXPANDED' |
  'UNSET_EXPANDED' |
  'UNSET_EXPANDED_DEEP'

export type UIAction = {
  type: UIActionType,
  data: {
    treePath?: TreePath,
    key?: UIKey
  }
}
export type UIActions = UIAction[]

export type State = {
  app: AppState,
  user: UserState,
  nodes: NodesState,
  ui: UIState
}

export type HoverRegion = 'top' | 'bottom'
